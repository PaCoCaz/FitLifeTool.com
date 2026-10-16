import { createClient } from "@/lib/supabaseServer";
import {
  PUBLIC_REGISTRATION_HEADERS,
  applyRegistrationAction,
  authorizeRegistrationAdministrator,
  parseRegistrationAction,
  readAdminRegistrationState,
  type RegistrationClient,
} from "@/lib/auth/publicRegistration";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 256;

function reply(code: string, status: number, state?: unknown) {
  return Response.json(state ? { code, state } : { code }, {
    status,
    headers: { ...PUBLIC_REGISTRATION_HEADERS, "Cache-Control": "private, no-store" },
  });
}

async function authorizedClient() {
  const client = await createClient() as unknown as RegistrationClient;
  const authorization = await authorizeRegistrationAdministrator(client);
  return { client, authorization };
}

export async function GET() {
  try {
    const { client, authorization } = await authorizedClient();
    if (!authorization.ok) return reply("REGISTRATION_CONTROL_DENIED", authorization.status);
    const state = await readAdminRegistrationState(client);
    return state
      ? reply("REGISTRATION_CONTROL_STATE", 200, state)
      : reply("REGISTRATION_CONTROL_UNAVAILABLE", 503);
  } catch {
    return reply("REGISTRATION_CONTROL_UNAVAILABLE", 503);
  }
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return reply("ORIGIN_NOT_ALLOWED", 403);
    }
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
      return reply("INVALID_REQUEST", 400);
    }
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return reply("INVALID_REQUEST", 400);
    }
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return reply("INVALID_REQUEST", 400);
    }
    const action = parseRegistrationAction(body);
    if (!action) return reply("INVALID_REQUEST", 400);

    const { client, authorization } = await authorizedClient();
    if (!authorization.ok) return reply("REGISTRATION_CONTROL_DENIED", authorization.status);
    const state = await applyRegistrationAction(client, action);
    return state
      ? reply("REGISTRATION_CONTROL_UPDATED", 200, state)
      : reply("REGISTRATION_CONTROL_UNAVAILABLE", 503);
  } catch {
    return reply("REGISTRATION_CONTROL_UNAVAILABLE", 503);
  }
}
