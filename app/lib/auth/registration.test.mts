import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildRegistrationMetadata,
  REGISTRATION_LANGUAGES,
  validateRegistration,
} from "./registration.ts";

const valid = { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", password: "secret", countryCode: "GB", language: "en" as const };

test("registration requires a valid country", () => {
  assert.equal(validateRegistration(valid), true);
  assert.equal(validateRegistration({ ...valid, countryCode: "" }), false);
});

test("registration requires an explicit language instead of accepting the provider fallback", () => {
  assert.equal(validateRegistration({ ...valid, language: null }), false);
});

test("all five language enum values are available and valid", () => {
  assert.deepEqual(REGISTRATION_LANGUAGES, ["en", "nl", "fr", "de", "pl"]);
  for (const language of REGISTRATION_LANGUAGES) {
    assert.equal(validateRegistration({ ...valid, language }), true);
  }
});

test("registration metadata contains the explicitly chosen language", () => {
  assert.equal(buildRegistrationMetadata({ ...valid, language: "pl" }).language, "pl");
});

test("registration metadata rejects a missing language instead of falling back", () => {
  assert.throws(
    () => buildRegistrationMetadata({ ...valid, language: null }),
    /explicit registration language/
  );
});

test("registration initializes food region from country without deriving language", () => {
  assert.deepEqual(buildRegistrationMetadata(valid), {
    first_name: "Ada", last_name: "Lovelace", country_code: "GB", food_region: "GB", language: "en",
  });
  assert.equal(buildRegistrationMetadata({ ...valid, countryCode: "DE", language: "fr" }).language, "fr");
});

test("changing language does not derive or replace the chosen country", () => {
  assert.equal(buildRegistrationMetadata({ ...valid, countryCode: "SE", language: "de" }).country_code, "SE");
  assert.equal(buildRegistrationMetadata({ ...valid, countryCode: "SE", language: "pl" }).country_code, "SE");
});

test("RegisterStep signs up with confirmation metadata and never inserts a profile", async () => {
  const source = await readFile(new URL("../../components/auth/RegisterStep.tsx", import.meta.url), "utf8");
  assert.match(source, /auth\.signUp/);
  assert.match(source, /buildRegistrationMetadata/);
  assert.match(source, /emailRedirectTo/);
  assert.match(source, /setConfirmationSent\(true\)/);
  assert.doesNotMatch(source, /from\(["']profiles["']\)/);
  assert.doesNotMatch(source, /profiles\.insert/);
});
