import { createClient } from "../../../lib/supabaseServer";
import { resolvePostLoginDestination } from "../../../lib/auth/postLoginDestination";
import {
  resolveServerAuthState,
  type ServerAuthClient,
} from "../../../lib/auth/serverAuthState";
import { readOwnEmailChangeSessionState } from "../../../lib/auth/emailChangeState";

const RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
};

function failure(code: string, status: number) {
  return Response.json(
    { code },
    { status, headers: RESPONSE_HEADERS }
  );
}

type CreateServerAuthClient = () => Promise<ServerAuthClient>;
type EmailChangeGuard = (client: ServerAuthClient, userId: string) => Promise<"ok" | "pending" | "unavailable">;

async function enforceEmailChangeGuard(client: ServerAuthClient, userId: string): Promise<"ok" | "pending" | "unavailable"> {
  void userId;
  const rpc = (client as unknown as { rpc(name: string): Promise<{ data: unknown; error: unknown }> }).rpc.bind(client);
  const current = await rpc("get_own_auth_email_change_state");
  if (current.error) return "unavailable";
  const state = readOwnEmailChangeSessionState(current.data);
  if (!state) return "unavailable";
  return state.requiresReauthentication ? "pending" : "ok";
}

export function createPostLoginHandler(
  createServerAuthClient: CreateServerAuthClient,
  emailChangeGuard: EmailChangeGuard = async () => "ok"
) {
  return async function postLogin(request: Request) {
    const requestOrigin = new URL(request.url).origin;
    if (request.headers.get("origin") !== requestOrigin) {
      return failure("ORIGIN_NOT_ALLOWED", 403);
    }

    if (
      request.headers.get("content-type")?.split(";", 1)[0].trim() !==
      "application/json"
    ) {
      return failure("INVALID_REQUEST", 400);
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return failure("INVALID_REQUEST", 400);
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return failure("INVALID_REQUEST", 400);
    }

    if (Object.keys(body).some((key) => key !== "returnTo")) {
      return failure("INVALID_REQUEST", 400);
    }

    let state;
    let supabase: ServerAuthClient;
    try {
      supabase = await createServerAuthClient();
      state = await resolveServerAuthState(supabase);
    } catch {
      return failure("AUTH_STATE_UNAVAILABLE", 503);
    }
    const result = resolvePostLoginDestination(state, body.returnTo);

    if (!result.ok) {
      return result.code === "AUTHENTICATION_REQUIRED"
        ? failure(result.code, 401)
        : failure(result.code, 503);
    }

    if (!state.userId) return failure("AUTHENTICATION_REQUIRED", 401);
    let guard: "ok" | "pending" | "unavailable";
    try {
      guard = await emailChangeGuard(supabase, state.userId);
    } catch {
      return failure("AUTH_STATE_UNAVAILABLE", 503);
    }
    if (guard === "pending") return failure("EMAIL_CHANGE_REAUTH_REQUIRED", 409);
    if (guard === "unavailable") return failure("AUTH_STATE_UNAVAILABLE", 503);

    return Response.json(
      { destination: result.destination },
      { status: 200, headers: RESPONSE_HEADERS }
    );
  };
}

export const POST = createPostLoginHandler(createClient, enforceEmailChangeGuard);
