import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { AuthRetryableFetchError } from "@supabase/supabase-js";
import {
  createPasswordRecoveryAction,
  executePasswordRecoverySubmission,
  type RecoveryAuthClient,
  type RecoveryClientFactory,
} from "./passwordRecoveryClient.ts";

function setup(overrides: {
  verifyError?: unknown;
  verifyThrows?: boolean;
  updateError?: unknown;
  updateThrows?: boolean;
  globalFailures?: number;
} = {}) {
  const calls: string[] = [];
  const factoryCalls: unknown[][] = [];
  let remainingGlobalFailures = overrides.globalFailures ?? 0;
  const client: RecoveryAuthClient = {
    auth: {
      verifyOtp: async ({ token_hash, type }) => {
        calls.push(`verify:${token_hash}:${type}`);
        if (overrides.verifyThrows) throw new Error("private verify detail");
        return { error: overrides.verifyError ?? null };
      },
      updateUser: async ({ password }) => {
        calls.push(`update:${password.length}`);
        if (overrides.updateThrows) throw new Error("private update detail");
        return { error: overrides.updateError ?? null };
      },
      signOut: async ({ scope }) => {
        calls.push(`signout:${scope}`);
        if (scope === "global" && remainingGlobalFailures > 0) {
          remainingGlobalFailures -= 1;
          return { error: new Error("private cleanup detail") };
        }
        return { error: null };
      },
    },
  };
  const factory: RecoveryClientFactory = (...arguments_) => {
    factoryCalls.push(arguments_);
    return client;
  };
  const action = createPasswordRecoveryAction(
    { supabaseUrl: "https://project.supabase.test", anonKey: "public-key" },
    factory
  );
  return { action, calls, factoryCalls };
}

test("recovery client is action-scoped, nonpersistent, and ordered", async () => {
  const { action, calls, factoryCalls } = setup();
  assert.deepEqual(factoryCalls, [[
    "https://project.supabase.test",
    "public-key",
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
  ]]);
  assert.equal(
    await action.execute("safe_token", "1234567890"),
    "PASSWORD_RESET_COMPLETED"
  );
  assert.deepEqual(calls, [
    "verify:safe_token:recovery",
    "update:10",
    "signout:global",
  ]);
});

test("concurrent executions enter only one verification and mutation path", async () => {
  const calls: string[] = [];
  let releaseVerification!: () => void;
  const verificationPending = new Promise<void>((resolve) => {
    releaseVerification = resolve;
  });
  const action = createPasswordRecoveryAction(
    { supabaseUrl: "https://project.supabase.test", anonKey: "public-key" },
    () => ({
      auth: {
        verifyOtp: async () => {
          calls.push("verify");
          await verificationPending;
          return { error: null };
        },
        updateUser: async () => {
          calls.push("update");
          return { error: null };
        },
        signOut: async ({ scope }) => {
          calls.push(`signout:${scope}`);
          return { error: null };
        },
      },
    })
  );

  const first = action.execute("token", "1234567890");
  const second = action.execute("token", "abcdefghij");
  assert.equal(await second, "PASSWORD_RESET_STATUS_UNKNOWN");
  assert.deepEqual(calls, ["verify"]);
  releaseVerification();
  assert.equal(await first, "PASSWORD_RESET_COMPLETED");
  assert.equal(calls.filter((call) => call === "verify").length, 1);
  assert.equal(calls.filter((call) => call === "update").length, 1);
  assert.equal(
    await action.execute("token", "klmnopqrst"),
    "PASSWORD_RESET_STATUS_UNKNOWN"
  );
  assert.equal(calls.filter((call) => call === "update").length, 1);
});

test("submission validation prevents provider actions and accepts exact minimum", async () => {
  let actionsCreated = 0;
  let executions = 0;
  const createAction = () => {
    actionsCreated += 1;
    return {
      execute: async () => {
        executions += 1;
        return "PASSWORD_RESET_COMPLETED" as const;
      },
      retryCleanup: async () => "PASSWORD_RESET_COMPLETED" as const,
    };
  };

  const tooShort = await executePasswordRecoverySubmission(
    { tokenHash: "token", password: "123456789", confirmation: "123456789" },
    createAction
  );
  assert.deepEqual(tooShort, {
    kind: "validation",
    field: "password",
    code: "PASSWORD_TOO_SHORT",
  });

  const mismatch = await executePasswordRecoverySubmission(
    { tokenHash: "token", password: "1234567890", confirmation: "abcdefghij" },
    createAction
  );
  assert.deepEqual(mismatch, {
    kind: "validation",
    field: "confirmation",
    code: "PASSWORD_MISMATCH",
  });
  assert.equal(actionsCreated, 0);
  assert.equal(executions, 0);

  const valid = await executePasswordRecoverySubmission(
    { tokenHash: "token", password: "1234567890", confirmation: "1234567890" },
    createAction
  );
  assert.equal(valid.kind, "recovery");
  assert.equal(actionsCreated, 1);
  assert.equal(executions, 1);
});

test("verification failures never update and close only isolated local state", async () => {
  const expired = setup({ verifyError: { code: "otp_expired", message: "private" } });
  assert.equal(await expired.action.execute("token", "1234567890"), "RECOVERY_LINK_EXPIRED_OR_USED");
  assert.deepEqual(expired.calls, ["verify:token:recovery", "signout:local"]);

  const unavailable = setup({ verifyError: new AuthRetryableFetchError("private", 503) });
  assert.equal(await unavailable.action.execute("token", "1234567890"), "RECOVERY_VERIFICATION_UNAVAILABLE");
  assert.deepEqual(unavailable.calls, ["verify:token:recovery", "signout:local"]);

  const thrown = setup({ verifyThrows: true });
  assert.equal(await thrown.action.execute("token", "1234567890"), "RECOVERY_VERIFICATION_UNAVAILABLE");
  assert.deepEqual(thrown.calls, ["verify:token:recovery", "signout:local"]);
});

test("confirmed update failure closes isolated state without global or normal-session effects", async () => {
  const { action, calls } = setup({ updateError: { code: "weak_password", message: "private" } });
  assert.equal(await action.execute("token", "1234567890"), "PASSWORD_RESET_UNAVAILABLE");
  assert.deepEqual(calls, ["verify:token:recovery", "update:10", "signout:local"]);
});

test("a definite returned update failure remains safely retryable", async () => {
  let updateCalls = 0;
  const calls: string[] = [];
  const action = createPasswordRecoveryAction(
    { supabaseUrl: "https://project.supabase.test", anonKey: "public-key" },
    () => ({
      auth: {
        verifyOtp: async () => {
          calls.push("verify");
          return { error: null };
        },
        updateUser: async () => {
          updateCalls += 1;
          calls.push("update");
          return { error: updateCalls === 1 ? new Error("private") : null };
        },
        signOut: async ({ scope }) => {
          calls.push(`signout:${scope}`);
          return { error: null };
        },
      },
    })
  );

  assert.equal(await action.execute("token", "1234567890"), "PASSWORD_RESET_UNAVAILABLE");
  assert.equal(await action.execute("token", "1234567890"), "PASSWORD_RESET_COMPLETED");
  assert.deepEqual(calls, [
    "verify",
    "update",
    "signout:local",
    "verify",
    "update",
    "signout:global",
  ]);
});

test("thrown update has unknown status and cannot invoke a second mutation", async () => {
  const { action, calls } = setup({ updateThrows: true });
  assert.equal(await action.execute("token", "1234567890"), "PASSWORD_RESET_STATUS_UNKNOWN");
  assert.equal(await action.execute("token", "abcdefghij"), "PASSWORD_RESET_STATUS_UNKNOWN");
  assert.equal(calls.filter((call) => call.startsWith("update:")).length, 1);
  assert.deepEqual(calls, ["verify:token:recovery", "update:10", "signout:local"]);
});

test("cleanup failure is partial success and retry performs cleanup only", async () => {
  const { action, calls } = setup({ globalFailures: 1 });
  assert.equal(
    await action.execute("token", "1234567890"),
    "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED"
  );
  assert.equal(await action.retryCleanup(), "PASSWORD_RESET_COMPLETED");
  assert.equal(await action.retryCleanup(), "PASSWORD_RESET_COMPLETED");
  assert.equal(calls.filter((call) => call.startsWith("update:")).length, 1);
  assert.equal(calls.filter((call) => call === "signout:global").length, 2);
});

test("cleanup cannot be used before a successful password mutation", async () => {
  const { action, calls } = setup();
  assert.equal(await action.retryCleanup(), "PASSWORD_RESET_STATUS_UNKNOWN");
  assert.deepEqual(calls, []);
});

test("recovery client source has no normal client, cookies, storage, service role, or logging", async () => {
  const source = await readFile(new URL("./passwordRecoveryClient.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /@\/lib\/supabaseClient|createBrowserClient|cookie|localStorage|sessionStorage|service_role|console\./i);
  assert.equal((source.match(/client\.auth\.updateUser\(/g) ?? []).length, 1);
  assert.match(source, /signOut\(\{ scope: "global" \}\)/);
  assert.match(source, /signOut\(\{ scope: "local" \}\)/);
});
