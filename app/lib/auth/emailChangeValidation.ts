export const EMAIL_MAX_LENGTH = 254;

export type EmailChangeSynchronization =
  | "none"
  | "pending"
  | "completed"
  | "manual_review";

export type EmailChangeStatus = {
  confirmationPending: boolean;
  synchronization: EmailChangeSynchronization;
};

export type EmailChangeStatusIssue = "unavailable" | "blocked" | null;

export function deriveEmailChangeStatus(input: {
  newEmail?: string | null;
  jobStatus?: string | null;
}): EmailChangeStatus {
  const knownStatuses = new Set([
    "pending",
    "processing",
    "retryable_failed",
    "completed",
    "manual_review",
  ]);

  if (input.jobStatus && !knownStatuses.has(input.jobStatus)) {
    throw new Error("Unknown email synchronization status");
  }

  return {
    confirmationPending: Boolean(input.newEmail),
    synchronization:
      input.jobStatus === "manual_review"
        ? "manual_review"
        : input.jobStatus === "pending" ||
            input.jobStatus === "processing" ||
            input.jobStatus === "retryable_failed"
          ? "pending"
          : input.jobStatus === "completed"
            ? "completed"
            : "none",
  };
}

export function emailChangeRequestIsBlocked(status: EmailChangeStatus) {
  return status.confirmationPending ||
    status.synchronization === "pending" ||
    status.synchronization === "manual_review";
}

export function getEmailChangeCardMode(input: {
  loading: boolean;
  statusIssue: EmailChangeStatusIssue;
  status: EmailChangeStatus;
}) {
  if (input.loading) return "loading" as const;
  if (input.statusIssue) return "status_error" as const;
  if (input.status.confirmationPending) return "confirmation_pending" as const;
  if (input.status.synchronization === "pending") return "synchronization_pending" as const;
  if (input.status.synchronization === "manual_review") return "manual_review" as const;
  return "form" as const;
}

export function normalizeEmailChangeInput(value: string) {
  return value.trim();
}

export function isValidEmailChangeInput(value: string) {
  const email = normalizeEmailChangeInput(value);
  const at = email.indexOf("@");

  return (
    email.length > 0 &&
    email.length <= EMAIL_MAX_LENGTH &&
    !/\s/.test(email) &&
    at > 0 &&
    at === email.lastIndexOf("@") &&
    at < email.length - 1
  );
}
