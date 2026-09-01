import { createClient } from "../../../lib/supabaseServer";
import { resolvePostLoginDestination } from "../../../lib/auth/postLoginDestination";
import {
  resolveServerAuthState,
  type ServerAuthClient,
} from "../../../lib/auth/serverAuthState";

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

export function createPostLoginHandler(
  createServerAuthClient: CreateServerAuthClient
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
    try {
      const supabase = await createServerAuthClient();
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

    return Response.json(
      { destination: result.destination },
      { status: 200, headers: RESPONSE_HEADERS }
    );
  };
}

export const POST = createPostLoginHandler(createClient);
