export const PASSWORD_MIN_LENGTH = 10;

export const PASSWORD_ERROR_CODES = [
  "PASSWORD_REQUIRED",
  "PASSWORD_TOO_SHORT",
  "PASSWORD_CONFIRMATION_REQUIRED",
  "PASSWORD_MISMATCH",
] as const;

export type PasswordErrorCode = (typeof PASSWORD_ERROR_CODES)[number];

export type PasswordValidationResult =
  | { valid: true; code: null }
  | { valid: false; code: PasswordErrorCode };

export function validatePassword(password: string): PasswordValidationResult {
  if (password.length === 0) {
    return { valid: false, code: "PASSWORD_REQUIRED" };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, code: "PASSWORD_TOO_SHORT" };
  }

  return { valid: true, code: null };
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string
): PasswordValidationResult {
  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) return passwordResult;

  if (confirmation.length === 0) {
    return { valid: false, code: "PASSWORD_CONFIRMATION_REQUIRED" };
  }

  if (password !== confirmation) {
    return { valid: false, code: "PASSWORD_MISMATCH" };
  }

  return { valid: true, code: null };
}
