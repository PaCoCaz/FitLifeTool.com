import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildRegistrationMetadata,
  normalizeRegistrationFailure,
  REGISTRATION_LANGUAGES,
  validateRegistration,
  validateRegistrationFields,
} from "./registration.ts";
import { PASSWORD_MIN_LENGTH } from "./passwordPolicy.ts";

const valid = { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", password: "abcdefghij", countryCode: "GB", language: "en" as const };
const validStructured = { ...valid, confirmPassword: valid.password };

test("registration requires a valid country", () => {
  assert.equal(validateRegistration(valid), true);
  assert.equal(validateRegistration({ ...valid, countryCode: "" }), false);
});

test("structured registration validation accepts a complete valid input", () => {
  assert.deepEqual(validateRegistrationFields(validStructured), {
    valid: true,
    errors: {},
  });
});

test("structured registration validation returns deterministic field errors", () => {
  const result = validateRegistrationFields({
    ...validStructured,
    language: null,
    firstName: "  ",
    lastName: "",
    email: "not-an-email",
    password: "123456789",
    confirmPassword: "",
    countryCode: "",
  });
  assert.equal(result.valid, false);
  if (result.valid) return;
  assert.deepEqual(result.errors, {
    language: "REG_LANGUAGE_INVALID",
    firstName: "REG_FIRST_NAME_REQUIRED",
    lastName: "REG_LAST_NAME_REQUIRED",
    email: "REG_EMAIL_INVALID",
    password: "REG_PASSWORD_TOO_SHORT",
    countryCode: "REG_COUNTRY_INVALID",
  });
});

test("registration distinguishes missing email, password, confirmation, and mismatch", () => {
  const missing = validateRegistrationFields({
    ...validStructured,
    email: " ",
    password: "",
    confirmPassword: "",
  });
  assert.equal(missing.valid, false);
  if (!missing.valid) {
    assert.equal(missing.errors.email, "REG_EMAIL_REQUIRED");
    assert.equal(missing.errors.password, "REG_PASSWORD_REQUIRED");
  }

  const confirmationMissing = validateRegistrationFields({
    ...validStructured,
    confirmPassword: "",
  });
  assert.equal(confirmationMissing.valid, false);
  if (!confirmationMissing.valid) {
    assert.equal(
      confirmationMissing.errors.confirmPassword,
      "REG_CONFIRMATION_REQUIRED"
    );
  }

  const mismatch = validateRegistrationFields({
    ...validStructured,
    confirmPassword: "abcdefghik",
  });
  assert.equal(mismatch.valid, false);
  if (!mismatch.valid) {
    assert.equal(mismatch.errors.confirmPassword, "REG_PASSWORD_MISMATCH");
  }
});

test("registration uses the shared password minimum and supports country reference validation", () => {
  assert.equal(PASSWORD_MIN_LENGTH, 10);
  assert.equal(validateRegistration({ ...valid, password: "123456789" }), false);
  assert.equal(validateRegistration({ ...valid, password: "1234567890" }), true);

  const rejectedCountry = validateRegistrationFields(validStructured, {
    isCountryAllowed: () => false,
  });
  assert.equal(rejectedCountry.valid, false);
  if (!rejectedCountry.valid) {
    assert.equal(rejectedCountry.errors.countryCode, "REG_COUNTRY_INVALID");
  }
});

test("provider and unknown failures always collapse to one generic application code", () => {
  assert.equal(
    normalizeRegistrationFailure(new Error("User already registered")),
    "REGISTRATION_FAILED"
  );
  assert.equal(
    normalizeRegistrationFailure({ message: "rate limit", status: 429 }),
    "REGISTRATION_FAILED"
  );
  assert.equal(normalizeRegistrationFailure(null), "REGISTRATION_FAILED");
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
