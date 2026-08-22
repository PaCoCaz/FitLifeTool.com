import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  PasswordRecoveryError,
  buildRecoveryRedirectUrl,
  clearRecoveryParameters,
  getRecoveryPasswordFieldError,
  parseRecoveryCredential,
  requestPasswordRecovery,
  resolveRecoveryLanguage,
  resetPasswordFromRecovery,
  verifyRecoveryCredential,
  type RecoveryAuthClient,
} from "./passwordRecovery.ts";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const projectRoot = new URL("../../../", import.meta.url);

function authClient(input?: {
  recoveryUserId?: string | null;
  currentUserId?: string | null;
  verificationError?: unknown;
  updateError?: unknown;
  signOutError?: unknown;
}) {
  const calls = {
    tokenHashes: [] as string[],
    passwords: [] as string[],
    signOutScopes: [] as Array<"global" | "local">,
  };
  const recoveryUserId =
    input?.recoveryUserId === undefined
      ? USER_A
      : input.recoveryUserId;
  const verificationResult = {
    data: {
      session: recoveryUserId
        ? { user: { id: recoveryUserId } }
        : null,
      user: recoveryUserId ? { id: recoveryUserId } : null,
    },
    error: input?.verificationError ?? null,
  };

  const auth: RecoveryAuthClient = {
    async verifyOtp({ token_hash }) {
      calls.tokenHashes.push(token_hash);
      return verificationResult;
    },
    async getUser() {
      const currentUserId =
        input?.currentUserId === undefined
          ? USER_A
          : input.currentUserId;
      return {
        data: {
          user: currentUserId
            ? { id: currentUserId }
            : null,
        },
        error: null,
      };
    },
    async updateUser({ password }) {
      calls.passwords.push(password);
      return { error: input?.updateError ?? null };
    },
    async signOut({ scope }) {
      calls.signOutScopes.push(scope);
      return { error: input?.signOutError ?? null };
    },
  };

  return { auth, calls };
}

test("forgot password returns the same public success for known and unknown email addresses", async () => {
  const sent: string[] = [];
  const send = async (email: string) => {
    sent.push(email);
    return { error: null };
  };

  const known = await requestPasswordRecovery(
    {
      email: "known@example.test",
      language: "nl",
      siteUrl: "https://app.fitlifetool.test",
    },
    send,
    () => assert.fail("successful provider call must not report an error")
  );
  const unknown = await requestPasswordRecovery(
    {
      email: "unknown@example.test",
      language: "nl",
      siteUrl: "https://app.fitlifetool.test",
    },
    send,
    () => assert.fail("enumeration-safe provider behavior remains public success")
  );

  assert.deepEqual(known, { ok: true });
  assert.deepEqual(unknown, known);
  assert.equal(sent.length, 2);
});

test("forgot password keeps a Supabase error generic and does not expose it publicly", async () => {
  let technicalErrors = 0;
  const response = await requestPasswordRecovery(
    {
      email: "private@example.test",
      language: "en",
      siteUrl: "https://app.fitlifetool.test",
    },
    async () => ({ error: new Error("provider detail") }),
    () => {
      technicalErrors += 1;
    }
  );

  assert.deepEqual(response, { ok: true });
  assert.equal(technicalErrors, 1);
  assert.doesNotMatch(JSON.stringify(response), /private|provider/);
});

test("recovery redirect always includes an allowlisted language", () => {
  for (const language of ["nl", "en", "fr", "de", "pl"]) {
    assert.equal(
      buildRecoveryRedirectUrl(
        "https://app.fitlifetool.test",
        language
      ),
      `https://app.fitlifetool.test/reset-password?lang=${language}`
    );
  }

  assert.equal(
    buildRecoveryRedirectUrl("https://app.fitlifetool.test", undefined),
    "https://app.fitlifetool.test/reset-password?lang=en"
  );
  assert.equal(
    buildRecoveryRedirectUrl("https://app.fitlifetool.test", "unsafe"),
    "https://app.fitlifetool.test/reset-password?lang=en"
  );
});

test("reset-password UI locale resolves every supported language and falls back safely", () => {
  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    assert.equal(resolveRecoveryLanguage(language), language);
  }

  assert.equal(resolveRecoveryLanguage(undefined), "en");
  assert.equal(resolveRecoveryLanguage("es"), "en");
  assert.equal(
    resolveRecoveryLanguage("en&next=https://evil.example"),
    "en"
  );
});

test("recovery redirect strips caller URL state and is safe to extend with template credentials", () => {
  const redirectTo = buildRecoveryRedirectUrl(
    "https://app.fitlifetool.test/untrusted?next=https://evil.test#fragment",
    "fr"
  );

  assert.equal(
    redirectTo,
    "https://app.fitlifetool.test/reset-password?lang=fr"
  );
  assert.equal(
    `${redirectTo}&token_hash=redacted&type=recovery`,
    "https://app.fitlifetool.test/reset-password?lang=fr&token_hash=redacted&type=recovery"
  );
  assert.equal(new URL(redirectTo).searchParams.size, 1);
  assert.throws(() =>
    buildRecoveryRedirectUrl("javascript:alert(1)", "nl")
  );
});

test("recovery accepts only the project's explicit token-hash flow", () => {
  assert.deepEqual(
    parseRecoveryCredential(
      new URL(
        "https://app.fitlifetool.test/reset-password?token_hash=otp-hash&type=recovery&lang=nl"
      )
    ),
    { kind: "token_hash", tokenHash: "otp-hash" }
  );
  assert.equal(
    parseRecoveryCredential(
      new URL("https://app.fitlifetool.test/reset-password")
    ),
    null
  );
  assert.equal(
    parseRecoveryCredential(
      new URL(
        "https://app.fitlifetool.test/reset-password?code=pkce-code&token_hash=otp-hash&type=recovery"
      )
    ),
    null
  );
  assert.equal(
    parseRecoveryCredential(
      new URL(
        "https://app.fitlifetool.test/reset-password?code=pkce-code"
      )
    ),
    null
  );
});

test("recovery rejects mixed query and fragment auth credentials", () => {
  const mixedCredentials = [
    "access_token=secret",
    "refresh_token=secret",
    "code=pkce-code",
    "expires_in=3600",
    "token_type=bearer",
  ];

  for (const credential of mixedCredentials) {
    assert.equal(
      parseRecoveryCredential(
        new URL(
          `https://app.fitlifetool.test/reset-password?token_hash=otp-hash&type=recovery&${credential}`
        )
      ),
      null
    );
  }

  assert.equal(
    parseRecoveryCredential(
      new URL(
        "https://app.fitlifetool.test/reset-password?token_hash=otp-hash&type=recovery#access_token=secret&refresh_token=secret"
      )
    ),
    null
  );
});

test("valid recovery context is verified and sensitive URL parameters are removed", async () => {
  const state = authClient();
  const userId = await verifyRecoveryCredential(
    state.auth,
    { kind: "token_hash", tokenHash: "secret-hash" },
    null
  );
  const url = new URL(
    "https://app.fitlifetool.test/reset-password?token_hash=secret-hash&type=recovery&lang=de"
  );

  assert.equal(userId, USER_A);
  assert.deepEqual(state.calls.tokenHashes, ["secret-hash"]);
  assert.equal(clearRecoveryParameters(url), "/reset-password?lang=de");
});

test("recovery cleanup removes every credential and keeps only an allowlisted language", () => {
  const unsafeUrl = new URL(
    "https://app.fitlifetool.test/reset-password?token_hash=secret&type=recovery&code=pkce&access_token=access&refresh_token=refresh&expires_in=3600&token_type=bearer&lang=pl&next=https://evil.test#access_token=fragment"
  );
  const invalidLanguageUrl = new URL(
    "https://app.fitlifetool.test/reset-password?token_hash=secret&type=recovery&lang=unsafe#refresh_token=fragment"
  );

  assert.equal(
    clearRecoveryParameters(unsafeUrl),
    "/reset-password?lang=pl"
  );
  assert.equal(
    clearRecoveryParameters(invalidLanguageUrl),
    "/reset-password"
  );
});

test("expired recovery context and an existing different user fail closed", async () => {
  const expired = authClient({
    recoveryUserId: null,
    verificationError: new Error("expired"),
  });
  await assert.rejects(
    verifyRecoveryCredential(
      expired.auth,
      { kind: "token_hash", tokenHash: "expired" },
      null
    ),
    (error) =>
      error instanceof PasswordRecoveryError &&
      error.code === "INVALID_RECOVERY_CONTEXT"
  );

  const mismatch = authClient({ recoveryUserId: USER_A });
  await assert.rejects(
    verifyRecoveryCredential(
      mismatch.auth,
      { kind: "token_hash", tokenHash: "valid" },
      USER_B
    ),
    (error) =>
      error instanceof PasswordRecoveryError &&
      error.code === "RECOVERY_IDENTITY_MISMATCH"
  );
});

test("valid password reset checks identity, updates Supabase and globally signs out", async () => {
  const state = authClient();

  const outcome = await resetPasswordFromRecovery(state.auth, {
    recoveryUserId: USER_A,
    password: "new-password-123",
    confirmation: "new-password-123",
  });

  assert.deepEqual(outcome, { status: "success" });
  assert.deepEqual(state.calls.passwords, ["new-password-123"]);
  assert.deepEqual(state.calls.signOutScopes, ["global"]);
});

test("short or mismatched passwords never reach updateUser", async () => {
  const state = authClient();

  await assert.rejects(
    resetPasswordFromRecovery(state.auth, {
      recoveryUserId: USER_A,
      password: "short",
      confirmation: "short",
    }),
    (error) =>
      error instanceof PasswordRecoveryError &&
      error.code === "PASSWORD_TOO_SHORT"
  );
  await assert.rejects(
    resetPasswordFromRecovery(state.auth, {
      recoveryUserId: USER_A,
      password: "long-password-a",
      confirmation: "long-password-b",
    }),
    (error) =>
      error instanceof PasswordRecoveryError &&
      error.code === "PASSWORD_MISMATCH"
  );

  assert.equal(state.calls.passwords.length, 0);
});

test("client recovery validation distinguishes minimum, mismatch and valid input", () => {
  assert.equal(
    getRecoveryPasswordFieldError("short", "short"),
    "minimum"
  );
  assert.equal(
    getRecoveryPasswordFieldError("long-password-a", "short"),
    "minimum"
  );
  assert.equal(
    getRecoveryPasswordFieldError("long-password-a", "long-password-b"),
    "mismatch"
  );
  assert.equal(
    getRecoveryPasswordFieldError("long-password-a", "long-password-a"),
    null
  );
});

test("recovery form owns visible localized validation instead of browser popups", async () => {
  const [source, pageSource] = await Promise.all([
    readFile(
      new URL("app/reset-password/ResetPasswordClient.tsx", projectRoot),
      "utf8"
    ),
    readFile(
      new URL("app/reset-password/page.tsx", projectRoot),
      "utf8"
    ),
  ]);

  assert.match(source, /language: RecoveryLanguage/);
  assert.match(source, /const t = uiText\[language\]\.auth/);
  assert.doesNotMatch(source, /\buseLang\(\)/);
  assert.match(pageSource, /resolveRecoveryLanguage\(requestedLanguage\)/);
  assert.match(
    pageSource,
    /<ResetPasswordClient language=\{language\} \/>/
  );
  assert.match(source, /<form[^>]*onSubmit=\{handleReset\} noValidate>/);
  assert.equal(
    (source.match(/minLength=\{RECOVERY_PASSWORD_MIN_LENGTH\}/g) ?? []).length,
    2
  );
  assert.match(source, /getRecoveryPasswordFieldError\(\s*password,\s*confirmation/);
  assert.match(source, /setFieldError\(validationError\)/);
  assert.match(source, /fieldError === "minimum"\s*\? t\.passwordMinimum\s*: t\.passwordMismatch/);
  assert.match(source, /synchronizeFieldValidation\(value, confirmation\)/);
  assert.match(source, /synchronizeFieldValidation\(password, value\)/);
  assert.match(source, /disabled=\{loading\}/);
  assert.doesNotMatch(source, /disabled=\{[^}]*password\.length/);
  const submitStart = source.indexOf("const handleReset");
  assert.equal(
    source.indexOf("if (validationError)", submitStart) <
      source.indexOf("resetPasswordFromRecovery(", submitStart),
    true
  );
});

test("normal or changed auth identity cannot use a recovery page state", async () => {
  const state = authClient({ currentUserId: USER_B });

  await assert.rejects(
    resetPasswordFromRecovery(state.auth, {
      recoveryUserId: USER_A,
      password: "new-password-123",
      confirmation: "new-password-123",
    }),
    (error) =>
      error instanceof PasswordRecoveryError &&
      error.code === "RECOVERY_IDENTITY_MISMATCH"
  );
  assert.equal(state.calls.passwords.length, 0);
});

test("password update failure remains an ordinary reset failure", async () => {
  const updateFailure = authClient({
    updateError: new Error("update failed"),
  });
  await assert.rejects(
    resetPasswordFromRecovery(updateFailure.auth, {
      recoveryUserId: USER_A,
      password: "new-password-123",
      confirmation: "new-password-123",
    }),
    (error) =>
      error instanceof PasswordRecoveryError &&
      error.code === "PASSWORD_UPDATE_FAILED"
  );
  assert.equal(updateFailure.calls.signOutScopes.length, 0);
});

test("global sign-out failure after an update returns partial success without another update", async () => {
  const signOutFailure = authClient({
    signOutError: new Error("sign out failed"),
  });
  const outcome = await resetPasswordFromRecovery(
    signOutFailure.auth,
    {
      recoveryUserId: USER_A,
      password: "new-password-123",
      confirmation: "new-password-123",
    }
  );

  assert.deepEqual(outcome, { status: "partial_success" });
  assert.deepEqual(signOutFailure.calls.passwords, [
    "new-password-123",
  ]);
  assert.deepEqual(signOutFailure.calls.signOutScopes, ["global"]);
});

test("recovery UI uses isolated native auth, internal success redirect and sanitized logging", async () => {
  const [forgotPage, resetPage, apiRoute, recoveryClient] = await Promise.all([
    readFile(
      new URL("app/forgot-password/page.tsx", projectRoot),
      "utf8"
    ),
    readFile(
      new URL(
        "app/reset-password/ResetPasswordClient.tsx",
        projectRoot
      ),
      "utf8"
    ),
    readFile(
      new URL(
        "app/api/auth/forgot-password/route.ts",
        projectRoot
      ),
      "utf8"
    ),
    readFile(
      new URL("app/lib/supabaseRecoveryClient.ts", projectRoot),
      "utf8"
    ),
  ]);

  assert.match(apiRoute, /NEXT_PUBLIC_SITE_URL/);
  assert.doesNotMatch(apiRoute, /request\.url|body\.(redirect|next)/);
  assert.match(resetPage, /resetPasswordFromRecovery/);
  assert.match(resetPage, /auth_notice=password_reset/);
  assert.match(resetPage, /createSupabaseRecoveryClient/);
  assert.match(resetPage, /outcome\.status === "partial_success"/);
  assert.match(resetPage, /recoveryClient\.current = null/);
  assert.match(recoveryClient, /persistSession: false/);
  assert.match(recoveryClient, /detectSessionInUrl: false/);
  assert.doesNotMatch(recoveryClient, /SERVICE_ROLE/);
  const combinedSource = `${forgotPage}\n${resetPage}\n${apiRoute}\n${recoveryClient}`;
  assert.doesNotMatch(combinedSource, /console\.log\(/);

  for (const match of combinedSource.matchAll(/console\.error\(([^)]*)\)/g)) {
    assert.match(
      match[1].trim(),
      /^"[^"]+"$/,
      "recovery logs may contain only a fixed generic message"
    );
  }
});

test("all recovery translation keys exist exactly once in each of five languages", async () => {
  const source = await readFile(
    new URL("app/lib/uiText.ts", projectRoot),
    "utf8"
  );
  const keys = [
    "forgotPasswordTitle",
    "forgotPasswordSubmit",
    "forgotPasswordSubmitting",
    "forgotPasswordSent",
    "backToLogin",
    "resetPasswordTitle",
    "newPassword",
    "confirmPassword",
    "passwordMinimum",
    "passwordMismatch",
    "invalidRecoveryLink",
    "passwordResetSuccess",
    "passwordResetFailure",
    "passwordResetPartialSuccess",
    "loginAgain",
    "savingPassword",
    "savePassword",
  ];

  for (const key of keys) {
    assert.equal(
      source.match(new RegExp(`${key}:`, "g"))?.length,
      5,
      `${key} must exist for NL/EN/FR/DE/PL`
    );
  }

  const localizedRecoveryCopy = {
    en: [
      "Set a new password",
      "Save password",
      "Use at least 10 characters.",
      "The passwords do not match.",
    ],
    nl: [
      "Nieuw wachtwoord instellen",
      "Wachtwoord opslaan",
      "Gebruik minimaal 10 tekens.",
      "De wachtwoorden komen niet overeen.",
    ],
    fr: [
      "Définir un nouveau mot de passe",
      "Enregistrer le mot de passe",
      "Utilisez au moins 10 caractères.",
      "Les mots de passe ne correspondent pas.",
    ],
    de: [
      "Neues Passwort festlegen",
      "Passwort speichern",
      "Verwende mindestens 10 Zeichen.",
      "Die Passwörter stimmen nicht überein.",
    ],
    pl: [
      "Ustaw nowe hasło",
      "Zapisz hasło",
      "Użyj co najmniej 10 znaków.",
      "Hasła nie są zgodne.",
    ],
  } as const;
  const languages = Object.keys(
    localizedRecoveryCopy
  ) as Array<keyof typeof localizedRecoveryCopy>;

  for (const [index, language] of languages.entries()) {
    const start = source.indexOf(`const ${language} = {`);
    const nextLanguage = languages[index + 1];
    const end = nextLanguage
      ? source.indexOf(`const ${nextLanguage} = {`, start)
      : source.length;
    const localeSource = source.slice(start, end);

    for (const message of localizedRecoveryCopy[language]) {
      assert.equal(
        localeSource.includes(JSON.stringify(message)),
        true,
        `${language} recovery validation must not fall back to another locale`
      );
    }
  }
});
