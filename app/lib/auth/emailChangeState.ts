export const ACTIVE_EMAIL_CHANGE_STATUSES = [
  "requesting", "confirmation_pending", "status_unknown",
  "canonical_changed", "manual_review",
] as const;

export type OwnEmailChangeSessionState = {
  status: string | null;
  generation: number | null;
  requiresReauthentication: boolean;
  preProviderRecoveryAvailable: boolean;
};

export function blocksEmailChangeRequest(value: unknown) {
  return typeof value === "string" && (ACTIVE_EMAIL_CHANGE_STATUSES as readonly string[]).includes(value);
}
export function readEmailChangeStatus(value: unknown): string | null {
  if (Array.isArray(value) && value.length !== 1) return null;
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object" || !("status" in row)) return null;
  const status = (row as { status?: unknown }).status;
  return typeof status === "string" && (ACTIVE_EMAIL_CHANGE_STATUSES as readonly string[]).includes(status)
    ? status : status === "completed" || status === "request_failed" ? status : null;
}

export function readOwnEmailChangeSessionState(
  value: unknown
): OwnEmailChangeSessionState | null {
  if (Array.isArray(value) && value.length === 0) {
    return {
      status: null,
      generation: null,
      requiresReauthentication: false,
      preProviderRecoveryAvailable: false,
    };
  }

  if (Array.isArray(value) && value.length !== 1) return null;

  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return null;
  const record = row as Record<string, unknown>;
  const status = readEmailChangeStatus(row);
  const generation = record.generation;
  const requiresReauthentication = record.requires_reauthentication;
  const preProviderRecoveryAvailable =
    record.pre_provider_recovery_available;

  if (
    status === null ||
    typeof generation !== "number" ||
    !Number.isSafeInteger(generation) ||
    generation < 1 ||
    typeof requiresReauthentication !== "boolean" ||
    typeof preProviderRecoveryAvailable !== "boolean"
  ) {
    return null;
  }

  return {
    status,
    generation,
    requiresReauthentication,
    preProviderRecoveryAvailable,
  };
}

export function deriveEmailChangePublicState(requestStatus: unknown, syncStatus: unknown) {
  if (requestStatus === "manual_review" || syncStatus === "manual_review") return "manual_review" as const;
  if (requestStatus === "canonical_changed") return "canonical_completed_reauth_required" as const;
  if (requestStatus === "requesting" || requestStatus === "confirmation_pending" || requestStatus === "status_unknown") return "confirmation_pending" as const;
  if (["pending", "processing", "retryable_failed"].includes(String(syncStatus))) return "sync_pending" as const;
  if (requestStatus === "completed" || syncStatus === "completed") return "completed" as const;
  return "idle" as const;
}
