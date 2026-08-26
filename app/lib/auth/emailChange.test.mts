import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  buildEmailChangeRedirectUrl,
  EmailChangeError,
  requestEmailChangeForAuthenticatedUser,
  type FreshEmailChangeAuthClient,
  type NormalEmailChangeAuthClient,
} from "./emailChange.ts";
import {
  deriveEmailChangeStatus,
  emailChangeRequestIsBlocked,
  getEmailChangeCardMode,
} from "./emailChangeValidation.ts";
import { uiText } from "../uiText.ts";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const projectRoot = new URL("../../../", import.meta.url);

function clients(input?: { providers?: string[]; freshUserId?: string; updateError?: unknown }) {
  const calls = { updates: 0, signOut: [] as string[], credentials: [] as unknown[] };
  const normalAuth: NormalEmailChangeAuthClient = {
    async getUser() {
      return {
        data: { user: { id: USER_A, email: "old@example.test", app_metadata: { providers: input?.providers ?? ["email"] } } },
        error: null,
      };
    },
  };
  const freshAuth: FreshEmailChangeAuthClient = {
    async signInWithPassword(credentials) {
      calls.credentials.push(credentials);
      const id = input?.freshUserId ?? USER_A;
      return { data: { user: { id }, session: { user: { id } } }, error: null };
    },
    async updateUser() {
      calls.updates += 1;
      return { data: { user: { id: USER_A } }, error: input?.updateError ?? null };
    },
    async signOut({ scope }) {
      calls.signOut.push(scope);
      return { error: null };
    },
  };
  return { normalAuth, freshAuth, calls };
}

async function expectCode(promise: Promise<unknown>, code: EmailChangeError["code"]) {
  await assert.rejects(promise, (error: unknown) => error instanceof EmailChangeError && error.code === code);
}

function request(state: ReturnType<typeof clients>, overrides = {}) {
  return requestEmailChangeForAuthenticatedUser(state.normalAuth, state.freshAuth, {
    currentPassword: "current-password",
    newEmail: "new@example.test",
    emailRedirectTo: "https://fitlifetool.example/settings?lang=en&email_change=return",
    ...overrides,
  });
}

test("fresh authentication binds email change to the current server-side identity", async () => {
  const state = clients();
  assert.deepEqual(await request(state), { status: "pending_confirmation" });
  assert.equal(state.calls.updates, 1);
  assert.deepEqual(state.calls.credentials, [{ email: "old@example.test", password: "current-password" }]);
  assert.deepEqual(state.calls.signOut, ["local"]);
});

test("identity mismatch and OAuth-only identities fail closed before mutation", async () => {
  const mismatch = clients({ freshUserId: USER_B });
  await expectCode(request(mismatch), "REAUTHENTICATION_IDENTITY_MISMATCH");
  assert.equal(mismatch.calls.updates, 0);

  const oauth = clients({ providers: ["google"] });
  await expectCode(request(oauth), "REAUTHENTICATION_FAILED");
  assert.equal(oauth.calls.updates, 0);
});

test("invalid, unchanged and provider-failed requests expose only stable error codes", async () => {
  const invalid = clients();
  await expectCode(request(invalid, { newEmail: "invalid" }), "INVALID_EMAIL");
  assert.equal(invalid.calls.updates, 0);

  const unchanged = clients();
  await expectCode(request(unchanged, { newEmail: " OLD@example.test " }), "EMAIL_UNCHANGED");
  assert.equal(unchanged.calls.updates, 0);
  assert.equal(unchanged.calls.credentials.length, 0);

  const failed = clients({ updateError: new Error("provider payload") });
  await expectCode(request(failed), "EMAIL_CHANGE_FAILED");
  assert.equal(failed.calls.updates, 1);
  assert.deepEqual(failed.calls.signOut, ["local"]);
});

test("trusted change-email redirects keep only an allowlisted locale and fixed path", () => {
  for (const language of ["en", "nl", "fr", "de", "pl"]) {
    assert.equal(
      buildEmailChangeRedirectUrl("https://fitlifetool.example/unsafe?next=bad#token", language),
      `https://fitlifetool.example/settings?lang=${language}&email_change=return`
    );
  }
  assert.equal(
    buildEmailChangeRedirectUrl("https://fitlifetool.example", "https://evil.example"),
    "https://fitlifetool.example/settings?lang=en&email_change=return"
  );
});

test("email-change status failures are fail-closed and expose a safe retry mode", () => {
  const safe = deriveEmailChangeStatus({ jobStatus: null, newEmail: null });
  assert.equal(emailChangeRequestIsBlocked(safe), false);
  assert.equal(
    getEmailChangeCardMode({ loading: false, statusIssue: null, status: safe }),
    "form"
  );

  for (const status of ["pending", "processing", "retryable_failed", "manual_review"]) {
    const blocked = deriveEmailChangeStatus({ jobStatus: status });
    assert.equal(emailChangeRequestIsBlocked(blocked), true);
  }
  assert.equal(
    emailChangeRequestIsBlocked(
      deriveEmailChangeStatus({ jobStatus: null, newEmail: "pending@example.test" })
    ),
    true
  );
  assert.equal(
    getEmailChangeCardMode({
      loading: false,
      statusIssue: "unavailable",
      status: safe,
    }),
    "status_error"
  );
  assert.throws(() => deriveEmailChangeStatus({ jobStatus: "unexpected" }));
});

test("email-change failure and retry states are localized behaviorally in all five locales", () => {
  const expected = {
    en: ["Your email-change status could not be verified.", "Retry status check"],
    nl: ["De status van je e-mailwijziging kon niet worden gecontroleerd.", "Status opnieuw controleren"],
    fr: ["Le statut de votre modification d’adresse e-mail n’a pas pu être vérifié.", "Vérifier à nouveau le statut"],
    de: ["Der Status deiner E-Mail-Änderung konnte nicht überprüft werden.", "Status erneut prüfen"],
    pl: ["Nie udało się zweryfikować statusu zmiany adresu e-mail.", "Sprawdź status ponownie"],
  } as const;

  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    const text = uiText[language].settings.emailChange;
    assert.match(text.statusUnavailable, new RegExp(`^${expected[language][0]}`));
    assert.equal(text.retryStatus, expected[language][1]);
    assert.ok(text.requestBlocked.length > 20);
    if (language !== "en") {
      assert.notEqual(
        text.statusUnavailable,
        uiText.en.settings.emailChange.statusUnavailable
      );
    }
  }
});

test("route and settings card keep identity server-owned and provider errors hidden", async () => {
  const [route, card, grid] = await Promise.all([
    readFile(new URL("app/api/auth/change-email/route.ts", projectRoot), "utf8"),
    readFile(new URL("app/components/settings/EmailChangeCard.tsx", projectRoot), "utf8"),
    readFile(new URL("app/components/layout/SettingsGrid.tsx", projectRoot), "utf8"),
  ]);
  assert.match(route, /requestHasTrustedOrigin/);
  assert.match(route, /buildEmailChangeRedirectUrl\(siteUrl, body\.language\)/);
  assert.match(route, /emailChangeRequestIsBlocked\(currentStatus\)/);
  assert.match(route, /errorResponse\("EMAIL_CHANGE_BLOCKED", 409\)/);
  assert.match(route, /errorResponse\("STATUS_UNAVAILABLE", 503\)/);
  assert.notEqual(
    route.indexOf("emailChangeRequestIsBlocked(currentStatus)"),
    -1,
    "formatting changed: server guard must remain visibly wired"
  );
  assert.ok(
    route.indexOf("emailChangeRequestIsBlocked(currentStatus)") <
      route.indexOf("requestEmailChangeForAuthenticatedUser(")
  );
  assert.doesNotMatch(route, /body\.(userId|user_id|emailRedirectTo)/);
  assert.doesNotMatch(`${route}\n${card}`, /error\.message|console\.(log|error)/);
  assert.match(card, /uiText\[language\]\.settings\.emailChange/);
  assert.match(card, /setStatusIssue\("unavailable"\)/);
  assert.match(card, /setStatusRequest\(\(value\) => value \+ 1\)/);
  assert.match(card, /cardMode === "status_error"/);
  assert.match(grid, /<EmailChangeCard language=\{language\}/);
});
