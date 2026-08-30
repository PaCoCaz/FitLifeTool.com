import assert from "node:assert/strict";
import test from "node:test";

import {
  asRecoveryLanguage,
  buildRecoveryRedirectUrl,
  requestPasswordRecovery,
  resolveRecoveryLanguage,
} from "./passwordRecovery.ts";

test("recovery accepts only the supported public languages", () => {
  for (const language of ["en", "nl", "fr", "de", "pl"] as const) {
    assert.equal(asRecoveryLanguage(language), language);
    assert.equal(resolveRecoveryLanguage(language), language);
  }

  assert.equal(asRecoveryLanguage("es"), null);
  assert.equal(asRecoveryLanguage(undefined), null);
});

test("recovery language falls back safely to English", () => {
  assert.equal(resolveRecoveryLanguage(undefined), "en");
  assert.equal(resolveRecoveryLanguage("es"), "en");
  assert.equal(
    resolveRecoveryLanguage("en&next=https://evil.example"),
    "en"
  );
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

test("recovery redirect strips caller state and rejects untrusted protocols", () => {
  const redirectTo = buildRecoveryRedirectUrl(
    "https://app.fitlifetool.test/untrusted?next=https://evil.test#fragment",
    "fr"
  );

  assert.equal(
    redirectTo,
    "https://app.fitlifetool.test/reset-password?lang=fr"
  );
  assert.equal(new URL(redirectTo).searchParams.size, 1);
  assert.throws(() =>
    buildRecoveryRedirectUrl("javascript:alert(1)", "nl")
  );
});

test("forgot password returns the same public success for every address", async () => {
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
    () => assert.fail("public behavior must remain indistinguishable")
  );

  assert.deepEqual(known, { ok: true });
  assert.deepEqual(unknown, known);
  assert.equal(sent.length, 2);
});

test("provider failures remain generic in the public response", async () => {
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
