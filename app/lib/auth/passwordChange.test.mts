import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  changePasswordForAuthenticatedUser,
  PasswordChangeError,
  type FreshPasswordChangeAuthClient,
  type NormalPasswordChangeAuthClient,
} from "./passwordChange.ts";

const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";
const VALID_NEW_PASSWORD = "new-password-10";
const projectRoot = new URL("../../../", import.meta.url);

function authClients(input?: {
  initialUserId?: string | null;
  initialError?: unknown;
  email?: string | null;
  phone?: string | null;
  providers?: string[];
  freshUserId?: string | null;
  freshSessionUserId?: string | null;
  freshError?: unknown;
  updateUserId?: string | null;
  updateError?: unknown;
  globalSignOutError?: unknown;
  globalSignOutThrows?: boolean;
  normalSignOutError?: unknown;
}) {
  const initialUserId =
    input?.initialUserId === undefined ? USER_A : input.initialUserId;
  const freshUserId =
    input?.freshUserId === undefined ? USER_A : input.freshUserId;
  const freshSessionUserId =
    input?.freshSessionUserId === undefined
      ? USER_A
      : input.freshSessionUserId;
  const updateUserId =
    input?.updateUserId === undefined ? USER_A : input.updateUserId;
  const state = {
    normalCookieUserId: initialUserId,
    freshSessionUserId: null as string | null,
  };
  const calls = {
    getUser: 0,
    signIn: [] as Array<Record<string, string>>,
    updateUser: 0,
    updateAuthorizedUserIds: [] as Array<string | null>,
    freshSignOutScopes: [] as Array<"global" | "local">,
    normalSignOutScopes: [] as Array<"local">,
  };

  const normalAuth: NormalPasswordChangeAuthClient = {
    async getUser() {
      calls.getUser += 1;
      return {
        data: {
          user: initialUserId
            ? {
                id: initialUserId,
                email:
                  input?.email === undefined
                    ? "account@example.test"
                    : input.email,
                phone: input?.phone ?? null,
                app_metadata: {
                  providers: input?.providers ?? ["email"],
                },
              }
            : null,
        },
        error: input?.initialError ?? null,
      };
    },
    async signOut({ scope }) {
      calls.normalSignOutScopes.push(scope);
      if (input?.normalSignOutError) {
        return { error: input.normalSignOutError };
      }
      state.normalCookieUserId = null;
      return { error: null };
    },
  };

  const freshAuth: FreshPasswordChangeAuthClient = {
    async signInWithPassword(credentials) {
      calls.signIn.push(credentials);
      state.freshSessionUserId = freshSessionUserId;
      return {
        data: {
          user: freshUserId ? { id: freshUserId } : null,
          session: freshSessionUserId
            ? { user: { id: freshSessionUserId } }
            : null,
        },
        error: input?.freshError ?? null,
      };
    },
    async updateUser() {
      calls.updateUser += 1;
      calls.updateAuthorizedUserIds.push(state.freshSessionUserId);
      return {
        data: {
          user: updateUserId ? { id: updateUserId } : null,
        },
        error: input?.updateError ?? null,
      };
    },
    async signOut({ scope }) {
      calls.freshSignOutScopes.push(scope);
      if (scope === "global" && input?.globalSignOutThrows) {
        throw new Error("provider failure");
      }
      if (scope === "global" && input?.globalSignOutError) {
        return { error: input.globalSignOutError };
      }
      state.freshSessionUserId = null;
      return { error: null };
    },
  };

  return { normalAuth, freshAuth, calls, state };
}

function input(overrides?: Partial<{
  currentPassword: string;
  newPassword: string;
  confirmation: string;
}>) {
  return {
    currentPassword: "current-password",
    newPassword: VALID_NEW_PASSWORD,
    confirmation: VALID_NEW_PASSWORD,
    ...overrides,
  };
}

async function expectCode(
  promise: Promise<unknown>,
  code: PasswordChangeError["code"]
) {
  await assert.rejects(promise, (error: unknown) => {
    assert.equal(error instanceof PasswordChangeError, true);
    assert.equal((error as PasswordChangeError).code, code);
    return true;
  });
}

function change(
  clients: ReturnType<typeof authClients>,
  values = input()
) {
  return changePasswordForAuthenticatedUser(
    clients.normalAuth,
    clients.freshAuth,
    values
  );
}

test("unauthenticated requests are blocked before fresh authentication or mutation", async () => {
  const clients = authClients({ initialUserId: null });
  await expectCode(change(clients), "UNAUTHENTICATED");
  assert.equal(clients.calls.getUser, 1);
  assert.equal(clients.calls.signIn.length, 0);
  assert.equal(clients.calls.updateUser, 0);
});

test("unauthenticated invalid input remains an auth failure before validation", async () => {
  const clients = authClients({ initialUserId: null });
  await expectCode(
    change(
      clients,
      input({ currentPassword: "", newPassword: "short", confirmation: "x" })
    ),
    "UNAUTHENTICATED"
  );
  assert.equal(clients.calls.getUser, 1);
  assert.equal(clients.calls.signIn.length, 0);
  assert.equal(clients.calls.updateUser, 0);
});

test("explicit current-password proof is required before fresh authentication", async () => {
  const clients = authClients();
  await expectCode(
    change(clients, input({ currentPassword: "" })),
    "REAUTHENTICATION_FAILED"
  );
  assert.equal(clients.calls.signIn.length, 0);
  assert.equal(clients.calls.updateUser, 0);
});

test("fresh-auth provider failure preserves the normal session and clears isolated state", async () => {
  const clients = authClients({
    freshUserId: null,
    freshSessionUserId: null,
    freshError: new Error("invalid credentials"),
  });
  await expectCode(change(clients), "REAUTHENTICATION_FAILED");
  assert.equal(clients.state.normalCookieUserId, USER_A);
  assert.equal(clients.state.freshSessionUserId, null);
  assert.deepEqual(clients.calls.freshSignOutScopes, ["local"]);
  assert.equal(clients.calls.updateUser, 0);
});

test("identity mismatch preserves the normal cookie and removes the isolated session", async () => {
  const clients = authClients({
    freshUserId: USER_B,
    freshSessionUserId: USER_B,
  });
  await expectCode(change(clients), "REAUTHENTICATION_IDENTITY_MISMATCH");
  assert.equal(clients.state.normalCookieUserId, USER_A);
  assert.equal(clients.state.freshSessionUserId, null);
  assert.deepEqual(clients.calls.freshSignOutScopes, ["local"]);
  assert.deepEqual(clients.calls.normalSignOutScopes, []);
  assert.equal(clients.calls.updateUser, 0);
});

test("password update uses only the proven isolated fresh-auth identity", async () => {
  const clients = authClients();
  assert.deepEqual(await change(clients), { status: "success" });
  assert.deepEqual(clients.calls.updateAuthorizedUserIds, [USER_A]);
  assert.deepEqual(clients.calls.signIn, [
    {
      email: "account@example.test",
      password: "current-password",
    },
  ]);
  assert.equal(clients.calls.updateUser, 1);
});

test("caller cannot target another user or supply the fresh-auth identity", async () => {
  const clients = authClients();
  const maliciousInput = {
    ...input(),
    userId: USER_B,
    email: "other@example.test",
  };
  await change(clients, maliciousInput);
  assert.equal(clients.calls.signIn[0]?.email, "account@example.test");
  assert.equal("userId" in (clients.calls.signIn[0] ?? {}), false);
  assert.deepEqual(clients.calls.updateAuthorizedUserIds, [USER_A]);
});

test("OAuth-only accounts fail closed without treating email as identity proof", async () => {
  const clients = authClients({ providers: ["google"] });
  await expectCode(change(clients), "REAUTHENTICATION_FAILED");
  assert.equal(clients.calls.signIn.length, 0);
  assert.equal(clients.calls.updateUser, 0);
  assert.equal(clients.state.normalCookieUserId, USER_A);
});

test("too-short and mismatching passwords are rejected before provider calls", async () => {
  const short = authClients();
  await expectCode(
    change(short, input({ newPassword: "short", confirmation: "short" })),
    "PASSWORD_TOO_SHORT"
  );
  assert.equal(short.calls.signIn.length, 0);

  const mismatch = authClients();
  await expectCode(
    change(mismatch, input({ confirmation: "different-password" })),
    "PASSWORD_MISMATCH"
  );
  assert.equal(mismatch.calls.signIn.length, 0);
});

test("password update failure preserves the normal cookie and clears fresh auth", async () => {
  const clients = authClients({
    updateError: new Error("provider detail"),
  });
  await expectCode(change(clients), "PASSWORD_UPDATE_FAILED");
  assert.equal(clients.calls.updateUser, 1);
  assert.equal(clients.state.normalCookieUserId, USER_A);
  assert.equal(clients.state.freshSessionUserId, null);
  assert.deepEqual(clients.calls.freshSignOutScopes, ["local"]);
  assert.deepEqual(clients.calls.normalSignOutScopes, []);
});

test("success globally signs out fresh auth and clears the normal browser session", async () => {
  const clients = authClients();
  assert.deepEqual(await change(clients), { status: "success" });
  assert.deepEqual(clients.calls.freshSignOutScopes, ["global"]);
  assert.deepEqual(clients.calls.normalSignOutScopes, ["local"]);
  assert.equal(clients.state.freshSessionUserId, null);
  assert.equal(clients.state.normalCookieUserId, null);
});

test("global sign-out failure is partial success with isolated cleanup and no retry", async () => {
  for (const options of [
    { globalSignOutError: new Error("provider failure") },
    { globalSignOutThrows: true },
  ]) {
    const clients = authClients(options);
    assert.deepEqual(await change(clients), { status: "partial_success" });
    assert.equal(clients.calls.updateUser, 1);
    assert.deepEqual(clients.calls.freshSignOutScopes, ["global", "local"]);
    assert.deepEqual(clients.calls.normalSignOutScopes, ["local"]);
    assert.equal(clients.state.freshSessionUserId, null);
    assert.equal(clients.state.normalCookieUserId, null);
  }
});

test("normal browser cleanup failure after update is partial success", async () => {
  const clients = authClients({
    normalSignOutError: new Error("cookie cleanup failed"),
  });
  assert.deepEqual(await change(clients), { status: "partial_success" });
  assert.equal(clients.calls.updateUser, 1);
  assert.deepEqual(clients.calls.freshSignOutScopes, ["global"]);
  assert.deepEqual(clients.calls.normalSignOutScopes, ["local"]);
});

test("route wires fresh auth to a non-persistent client separate from normal auth", async () => {
  const [source, helper] = await Promise.all([
    readFile(new URL("app/api/auth/change-password/route.ts", projectRoot), "utf8"),
    readFile(new URL("app/lib/auth/freshAuthentication.ts", projectRoot), "utf8"),
  ]);
  assert.match(source, /const normalAuth = \(await createClient\(\)\)\.auth/);
  assert.match(source, /const freshAuth = createIsolatedFreshAuthClient/);
  assert.match(helper, /persistSession: false/);
  assert.match(helper, /autoRefreshToken: false/);
  assert.match(helper, /detectSessionInUrl: false/);
  assert.match(source, /changePasswordForAuthenticatedUser\(\s*normalAuth,\s*freshAuth/);
  assert.doesNotMatch(source, /body\.(email|userId|user_id)/);
  assert.doesNotMatch(source, /error\.message|console\.(log|error)/);
});

test("settings UI blocks duplicate submission and exposes success states safely", async () => {
  const source = await readFile(
    new URL(
      "app/components/settings/PasswordChangeCard.tsx",
      projectRoot
    ),
    "utf8"
  );
  assert.match(source, /submissionInProgress\.current/);
  assert.match(source, /if \(submissionInProgress\.current \|\| completion\) return/);
  assert.match(source, /disabled=\{submitting\}/);
  assert.match(source, /currentPassword,\s*newPassword,\s*confirmation/);
  assert.match(source, /setCompletion\(result\.status\)/);
  assert.match(source, /text\.auth\.passwordResetPartialSuccess/);
  assert.doesNotMatch(source, /userId|user_id|email:/);
});

test("settings passes its active locale to every PasswordChangeCard translation", async () => {
  const [grid, card, textSource] = await Promise.all([
    readFile(
      new URL("app/components/layout/SettingsGrid.tsx", projectRoot),
      "utf8"
    ),
    readFile(
      new URL("app/components/settings/PasswordChangeCard.tsx", projectRoot),
      "utf8"
    ),
    readFile(new URL("app/lib/uiText.ts", projectRoot), "utf8"),
  ]);

  assert.match(grid, /const language = useLang\(\)/);
  assert.match(grid, /<PasswordChangeCard language=\{language\} \/>/);
  assert.match(card, /language: Lang/);
  assert.match(card, /const text = uiText\[language\]/);
  assert.match(card, /href=\{`\/login\?lang=\$\{language\}`\}/);
  assert.doesNotMatch(card, /\?\?\s*["']en["']|\|\|\s*["']en["']/);

  const languages = ["en", "nl", "fr", "de", "pl"] as const;
  const passwordChangeKeys = [
    "title",
    "description",
    "currentPassword",
    "currentPasswordRequired",
    "reauthenticationFailed",
    "failure",
    "success",
    "unauthenticated",
    "submit",
    "saving",
  ];
  const sharedAuthKeys = [
    "newPassword",
    "confirmPassword",
    "passwordMinimum",
    "passwordMismatch",
    "passwordResetPartialSuccess",
    "loginAgain",
  ];
  const visibleLabels = {
    en: [
      "Change password",
      "Confirm your current password before choosing a new password.",
      "Current password",
      "New password",
      "Confirm new password",
    ],
    nl: [
      "Wachtwoord wijzigen",
      "Bevestig je huidige wachtwoord voordat je een nieuw wachtwoord kiest.",
      "Huidig wachtwoord",
      "Nieuw wachtwoord",
      "Bevestig nieuw wachtwoord",
    ],
    fr: [
      "Modifier le mot de passe",
      "Confirmez votre mot de passe actuel avant d'en choisir un nouveau.",
      "Mot de passe actuel",
      "Nouveau mot de passe",
      "Confirmer le nouveau mot de passe",
    ],
    de: [
      "Passwort ändern",
      "Bestätige dein aktuelles Passwort, bevor du ein neues Passwort wählst.",
      "Aktuelles Passwort",
      "Neues Passwort",
      "Neues Passwort bestätigen",
    ],
    pl: [
      "Zmień hasło",
      "Potwierdź obecne hasło przed wybraniem nowego.",
      "Obecne hasło",
      "Nowe hasło",
      "Potwierdź nowe hasło",
    ],
  } as const;

  for (const [index, language] of languages.entries()) {
    const start = textSource.indexOf(`const ${language} = {`);
    const nextLanguage = languages[index + 1];
    const end = nextLanguage
      ? textSource.indexOf(`const ${nextLanguage} = {`, start)
      : textSource.length;
    const localeSource = textSource.slice(start, end);
    const passwordChangeStart = localeSource.indexOf("passwordChange: {");
    const passwordChangeEnd = localeSource.indexOf("\n    },", passwordChangeStart);
    const passwordChangeSource = localeSource.slice(
      passwordChangeStart,
      passwordChangeEnd
    );

    assert.notEqual(start, -1, `${language} locale must exist`);
    assert.notEqual(
      passwordChangeStart,
      -1,
      `${language} passwordChange translations must exist`
    );
    for (const key of passwordChangeKeys) {
      assert.match(
        passwordChangeSource,
        new RegExp(`\\b${key}:\\s*["']`),
        `${language}.${key} must be localized`
      );
    }
    for (const key of sharedAuthKeys) {
      assert.match(
        localeSource,
        new RegExp(`\\b${key}:\\s*["']`),
        `${language}.auth.${key} must be localized`
      );
    }
    for (const label of visibleLabels[language]) {
      assert.equal(
        localeSource.includes(JSON.stringify(label)),
        true,
        `${language} must use its own PasswordChangeCard copy`
      );
    }
  }
});

test("password-change minimum and mismatch validation stay app-localized", async () => {
  const source = await readFile(
    new URL("app/components/settings/PasswordChangeCard.tsx", projectRoot),
    "utf8"
  );

  assert.match(source, /<form[^>]*onSubmit=\{submit\} noValidate>/);
  assert.equal(
    (source.match(/minLength=\{PASSWORD_CHANGE_MIN_LENGTH\}/g) ?? []).length,
    2
  );
  assert.match(
    source,
    /newPassword\.length < PASSWORD_CHANGE_MIN_LENGTH \|\|\s*confirmation\.length < PASSWORD_CHANGE_MIN_LENGTH/
  );
  assert.match(source, /setError\(text\.auth\.passwordMinimum\)/);
  assert.match(source, /setError\(text\.auth\.passwordMismatch\)/);
  assert.match(
    source,
    /nextNewPassword === nextConfirmation\s*\? null\s*: text\.auth\.passwordMismatch/
  );
  assert.match(source, /synchronizePasswordValidation\(value, confirmation\)/);
  assert.match(source, /synchronizePasswordValidation\(newPassword, value\)/);
  assert.match(source, /type="password"/);
  assert.match(source, /autoComplete="current-password"/);
  assert.equal((source.match(/autoComplete="new-password"/g) ?? []).length, 2);
});

test("password-change implementation never logs passwords, tokens, or provider errors", async () => {
  const sources = await Promise.all([
    "app/lib/auth/passwordChange.ts",
    "app/api/auth/change-password/route.ts",
    "app/components/settings/PasswordChangeCard.tsx",
  ].map((path) => readFile(new URL(path, projectRoot), "utf8")));
  for (const source of sources) {
    assert.doesNotMatch(source, /console\.(log|info|warn|error)/);
  }
});

test("password-change UI text is complete in all five languages", async () => {
  const source = await readFile(
    new URL("app/lib/uiText.ts", projectRoot),
    "utf8"
  );
  assert.equal((source.match(/passwordChange:\s*\{/g) ?? []).length, 5);
  for (const key of [
    "currentPassword",
    "currentPasswordRequired",
    "reauthenticationFailed",
    "failure",
    "success",
    "unauthenticated",
    "submit",
    "saving",
  ]) {
    assert.equal(
      (source.match(new RegExp(`\\b${key}:`, "g")) ?? []).length >= 5,
      true,
      `${key} must exist for all languages`
    );
  }
  for (const sharedKey of [
    "newPassword",
    "confirmPassword",
    "passwordMinimum",
    "passwordMismatch",
    "passwordResetPartialSuccess",
    "loginAgain",
  ]) {
    assert.equal(
      (source.match(new RegExp(`\\b${sharedKey}:`, "g")) ?? []).length,
      5,
      `${sharedKey} must remain shared across all languages`
    );
  }
});
