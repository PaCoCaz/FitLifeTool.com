export const PUBLIC_REGISTRATION_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json",
  "Referrer-Policy": "no-referrer",
  Vary: "Cookie",
} as const;

export type PublicRegistrationState = {
  open: boolean;
};

export type AdminRegistrationState = PublicRegistrationState & {
  openUntil: string | null;
  serverNow: string;
  version: number;
};

export type RegistrationAction =
  | { action: "open_temporary"; durationMinutes: number }
  | { action: "open_indefinite" }
  | { action: "close" };

type RpcResult = { data: unknown; error: unknown | null };
type QueryResult = { data: { role?: unknown } | null; error: unknown | null };
type ProfileQuery = {
  select(columns: string): ProfileQuery;
  eq(column: string, value: string): ProfileQuery;
  maybeSingle(): Promise<QueryResult>;
};

export type RegistrationClient = {
  auth: {
    getUser(): Promise<{
      data: { user: { id?: unknown } | null };
      error: unknown | null;
    }>;
  };
  from(table: string): ProfileQuery;
  rpc(name: string, input?: Record<string, unknown>): Promise<RpcResult>;
};

const ADMIN_ROLES = ["owner", "admin"] as const;

export function canManagePublicRegistration(role: unknown): boolean {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

function row(value: unknown): Record<string, unknown> | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && typeof candidate === "object" && !Array.isArray(candidate)
    ? candidate as Record<string, unknown>
    : null;
}

export function parsePublicRegistrationState(value: unknown): PublicRegistrationState | null {
  const candidate = row(value);
  return candidate && typeof candidate.is_open === "boolean"
    ? { open: candidate.is_open }
    : null;
}

export function parseAdminRegistrationState(value: unknown): AdminRegistrationState | null {
  const candidate = row(value);
  if (!candidate || typeof candidate.is_open !== "boolean") return null;
  if (candidate.open_until !== null && typeof candidate.open_until !== "string") return null;
  if (typeof candidate.server_now !== "string") return null;
  if (typeof candidate.version !== "number" || !Number.isSafeInteger(candidate.version) || candidate.version < 1) return null;
  if (!Number.isFinite(Date.parse(candidate.server_now))) return null;
  if (candidate.open_until !== null && !Number.isFinite(Date.parse(candidate.open_until))) return null;
  return {
    open: candidate.is_open,
    openUntil: candidate.open_until,
    serverNow: candidate.server_now,
    version: candidate.version,
  };
}

export function parseRegistrationAction(value: unknown): RegistrationAction | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  if (body.action === "open_temporary") {
    if (Object.keys(body).sort().join(",") !== "action,durationMinutes") return null;
    return Number.isInteger(body.durationMinutes) && Number(body.durationMinutes) >= 1 && Number(body.durationMinutes) <= 60
      ? { action: "open_temporary", durationMinutes: Number(body.durationMinutes) }
      : null;
  }
  if ((body.action === "open_indefinite" || body.action === "close") && Object.keys(body).length === 1) {
    return { action: body.action };
  }
  return null;
}

export async function authorizeRegistrationAdministrator(client: RegistrationClient) {
  let identity;
  try {
    identity = await client.auth.getUser();
  } catch {
    return { ok: false as const, status: 503 };
  }
  const userId = identity.data.user?.id;
  if (identity.error || typeof userId !== "string") return { ok: false as const, status: 401 };
  let profile;
  try {
    profile = await client.from("profiles").select("role").eq("id", userId).maybeSingle();
  } catch {
    return { ok: false as const, status: 503 };
  }
  if (profile.error || !profile.data) return { ok: false as const, status: 503 };
  if (!canManagePublicRegistration(profile.data.role)) return { ok: false as const, status: 403 };
  return { ok: true as const, userId };
}

export async function readPublicRegistrationState(client: RegistrationClient): Promise<PublicRegistrationState> {
  try {
    const result = await client.rpc("get_public_registration_status");
    if (result.error) return { open: false };
    return parsePublicRegistrationState(result.data) ?? { open: false };
  } catch {
    return { open: false };
  }
}

export async function readAdminRegistrationState(client: RegistrationClient): Promise<AdminRegistrationState | null> {
  try {
    const result = await client.rpc("get_admin_public_registration_status");
    return result.error ? null : parseAdminRegistrationState(result.data);
  } catch {
    return null;
  }
}

export async function applyRegistrationAction(client: RegistrationClient, action: RegistrationAction) {
  try {
    const result = await client.rpc("set_public_registration_status", {
      p_action: action.action,
      p_duration_minutes: action.action === "open_temporary" ? action.durationMinutes : null,
    });
    return result.error ? null : parseAdminRegistrationState(result.data);
  } catch {
    return null;
  }
}
