import {
  createClient as createSupabaseClient,
  isAuthRetryableFetchError,
} from "@supabase/supabase-js";
import {
  validatePassword,
  validatePasswordConfirmation,
  type PasswordErrorCode,
} from "./passwordPolicy";

export type PasswordRecoveryResult =
  | "RECOVERY_LINK_EXPIRED_OR_USED"
  | "RECOVERY_VERIFICATION_UNAVAILABLE"
  | "PASSWORD_RESET_UNAVAILABLE"
  | "PASSWORD_RESET_STATUS_UNKNOWN"
  | "PASSWORD_RESET_COMPLETED"
  | "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED";

export type RecoveryAuthClient = {
  auth: {
    verifyOtp(input: {
      token_hash: string;
      type: "recovery";
    }): Promise<{ error: unknown | null }>;
    updateUser(input: { password: string }): Promise<{ error: unknown | null }>;
    signOut(input: { scope: "local" | "global" }): Promise<{ error: unknown | null }>;
  };
};

export type RecoveryClientFactory = (
  supabaseUrl: string,
  anonKey: string,
  options: {
    auth: {
      persistSession: false;
      autoRefreshToken: false;
      detectSessionInUrl: false;
    };
  }
) => RecoveryAuthClient;

export type PasswordRecoveryAction = {
  execute(tokenHash: string, password: string): Promise<PasswordRecoveryResult>;
  retryCleanup(): Promise<PasswordRecoveryResult>;
};

export type PasswordRecoverySubmissionResult =
  | {
      kind: "validation";
      field: "password" | "confirmation";
      code: PasswordErrorCode;
    }
  | {
      kind: "recovery";
      action: PasswordRecoveryAction;
      result: PasswordRecoveryResult;
    };

const INFRASTRUCTURE_ERROR_CODES = new Set([
  "request_timeout",
  "hook_timeout",
  "hook_timeout_after_retry",
]);

function isInfrastructureFailure(error: unknown): boolean {
  return isAuthRetryableFetchError(error) || Boolean(
    typeof error === "object" && error !== null && "code" in error &&
    typeof error.code === "string" && INFRASTRUCTURE_ERROR_CODES.has(error.code)
  );
}

async function closeLocalRecoverySession(client: RecoveryAuthClient) {
  try { await client.auth.signOut({ scope: "local" }); }
  catch { /* Action-scoped memory is discarded by the caller. */ }
}

export function createPasswordRecoveryAction(
  configuration: { supabaseUrl: string; anonKey: string },
  createClient: RecoveryClientFactory = createSupabaseClient as unknown as RecoveryClientFactory
) {
  const client = createClient(configuration.supabaseUrl, configuration.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  let phase: "idle" | "in_flight" | "mutation_locked" | "password_changed" = "idle";
  let globalCleanupComplete = false;

  async function finishGlobalCleanup(): Promise<PasswordRecoveryResult> {
    if (globalCleanupComplete) return "PASSWORD_RESET_COMPLETED";
    try {
      const { error } = await client.auth.signOut({ scope: "global" });
      if (error) return "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED";
      globalCleanupComplete = true;
      return "PASSWORD_RESET_COMPLETED";
    } catch {
      return "PASSWORD_RESET_COMPLETED_CLEANUP_REQUIRED";
    }
  }

  const action: PasswordRecoveryAction = {
    async execute(tokenHash: string, password: string): Promise<PasswordRecoveryResult> {
      if (phase !== "idle") return "PASSWORD_RESET_STATUS_UNKNOWN";
      phase = "in_flight";

      try {
        const { error } = await client.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (error) {
          await closeLocalRecoverySession(client);
          phase = "idle";
          return isInfrastructureFailure(error)
            ? "RECOVERY_VERIFICATION_UNAVAILABLE"
            : "RECOVERY_LINK_EXPIRED_OR_USED";
        }
      } catch {
        await closeLocalRecoverySession(client);
        phase = "idle";
        return "RECOVERY_VERIFICATION_UNAVAILABLE";
      }

      phase = "mutation_locked";
      try {
        const { error } = await client.auth.updateUser({ password });
        if (error) {
          await closeLocalRecoverySession(client);
          phase = "idle";
          return "PASSWORD_RESET_UNAVAILABLE";
        }
      } catch {
        await closeLocalRecoverySession(client);
        return "PASSWORD_RESET_STATUS_UNKNOWN";
      }

      phase = "password_changed";
      return finishGlobalCleanup();
    },

    async retryCleanup(): Promise<PasswordRecoveryResult> {
      if (phase !== "password_changed") return "PASSWORD_RESET_STATUS_UNKNOWN";
      return finishGlobalCleanup();
    },
  };

  return action;
}

export async function executePasswordRecoverySubmission(
  input: {
    tokenHash: string;
    password: string;
    confirmation: string;
  },
  createAction: () => PasswordRecoveryAction
): Promise<PasswordRecoverySubmissionResult> {
  const passwordValidation = validatePassword(input.password);
  if (!passwordValidation.valid) {
    return { kind: "validation", field: "password", code: passwordValidation.code };
  }

  const confirmationValidation = validatePasswordConfirmation(
    input.password,
    input.confirmation
  );
  if (!confirmationValidation.valid) {
    return {
      kind: "validation",
      field: "confirmation",
      code: confirmationValidation.code,
    };
  }

  const action = createAction();
  return {
    kind: "recovery",
    action,
    result: await action.execute(input.tokenHash, input.password),
  };
}
