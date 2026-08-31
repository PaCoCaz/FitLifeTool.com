import assert from "node:assert/strict";
import test from "node:test";
import {
  PASSWORD_MIN_LENGTH,
  validatePassword,
  validatePasswordConfirmation,
} from "./passwordPolicy.ts";

test("password minimum is exactly ten JavaScript string code units", () => {
  assert.equal(PASSWORD_MIN_LENGTH, 10);
  assert.deepEqual(validatePassword(""), {
    valid: false,
    code: "PASSWORD_REQUIRED",
  });

  for (let length = 1; length < PASSWORD_MIN_LENGTH; length += 1) {
    assert.deepEqual(validatePassword("a".repeat(length)), {
      valid: false,
      code: "PASSWORD_TOO_SHORT",
    });
  }

  assert.deepEqual(validatePassword("a".repeat(10)), {
    valid: true,
    code: null,
  });
  assert.deepEqual(validatePassword("a".repeat(11)), {
    valid: true,
    code: null,
  });
});

test("password policy has no character-class requirements", () => {
  for (const password of [
    "ABCDEFGHIJ",
    "abcdefghij",
    "1234567890",
    "!!!!!!!!!!",
  ]) {
    assert.equal(validatePassword(password).valid, true);
  }
});

test("confirmation is required and must exactly match without normalization", () => {
  assert.deepEqual(validatePasswordConfirmation("abcdefghij", ""), {
    valid: false,
    code: "PASSWORD_CONFIRMATION_REQUIRED",
  });
  assert.deepEqual(
    validatePasswordConfirmation("abcdefghij", "abcdefghij"),
    { valid: true, code: null }
  );
  assert.deepEqual(
    validatePasswordConfirmation("abcdefghij", "ABCDEFGHIJ"),
    { valid: false, code: "PASSWORD_MISMATCH" }
  );
  assert.equal(validatePassword("          ").valid, true);
  assert.equal(validatePassword(" 12345678 ").valid, true);
  assert.deepEqual(
    validatePasswordConfirmation(" 12345678 ", "12345678"),
    { valid: false, code: "PASSWORD_MISMATCH" }
  );
});

test("Unicode behavior follows deterministic JavaScript string length", () => {
  assert.equal("😀😀😀😀😀".length, 10);
  assert.equal(validatePassword("😀😀😀😀😀").valid, true);
  assert.equal(validatePassword("é".repeat(9)).valid, false);
  assert.equal(validatePassword("é".repeat(10)).valid, true);
});
