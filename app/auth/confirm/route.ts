import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import {
  parseEmailConfirmationRequest,
  type EmailConfirmationCredential,
} from "@/lib/auth/emailConfirmation";
import {
  resolveServerAuthState,
  type ServerAuthClient,
  type ServerAuthState,
} from "@/lib/auth/serverAuthState";

type ConfirmationClient = ServerAuthClient & {
  auth: ServerAuthClient["auth"] & {
    exchangeCodeForSession(code: string): Promise<{ error: unknown | null }>;
    verifyOtp(input: {
      token_hash: string;
      type: "signup";
    }): Promise<{ error: unknown | null }>;
  };
};

type CreateConfirmationClient = () => Promise<ConfirmationClient>;

function redirect(requestUrl: string, destination: string) {
  const response = NextResponse.redirect(new URL(destination, requestUrl));
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie");
  return response;
}

function confirmationPage(
  requestUrl: string,
  language: string,
  state: "invalid" | "unavailable"
) {
  const url = new URL("/auth/confirmation", requestUrl);
  url.searchParams.set("lang", language);
  url.searchParams.set("state", state);
  return redirect(requestUrl, url.toString());
}

function authenticatedDestination(state: ServerAuthState): string | null {
  if (state.kind === "AUTHENTICATED_ONBOARDING_INCOMPLETE") {
    return "/onboarding";
  }
  if (state.kind === "AUTHENTICATED_ONBOARDING_COMPLETE") {
    return "/dashboard";
  }
  return null;
}

async function verifyConfirmation(
  client: ConfirmationClient,
  credential: EmailConfirmationCredential
) {
  if (credential.kind === "code") {
    return client.auth.exchangeCodeForSession(credential.code);
  }
  return client.auth.verifyOtp({
    token_hash: credential.tokenHash,
    type: "signup",
  });
}

export function createEmailConfirmationHandler(
  createServerAuthClient: CreateConfirmationClient
) {
  return async function confirmEmail(request: Request) {
    const parsed = parseEmailConfirmationRequest(
      new URL(request.url).searchParams
    );

    if (!parsed.credential) {
      return confirmationPage(request.url, parsed.language, "invalid");
    }

    let client: ConfirmationClient;
    try {
      client = await createServerAuthClient();
    } catch {
      return confirmationPage(request.url, parsed.language, "unavailable");
    }

    let verificationSucceeded = false;
    try {
      const { error } = await verifyConfirmation(client, parsed.credential);
      verificationSucceeded = error == null;
    } catch {
      verificationSucceeded = false;
    }

    let state: ServerAuthState;
    try {
      state = await resolveServerAuthState(client);
    } catch {
      return confirmationPage(request.url, parsed.language, "unavailable");
    }

    const destination = authenticatedDestination(state);
    if (destination) return redirect(request.url, destination);

    if (state.kind === "RESOLUTION_FAILURE" || verificationSucceeded) {
      return confirmationPage(request.url, parsed.language, "unavailable");
    }

    return confirmationPage(request.url, parsed.language, "invalid");
  };
}

export const GET = createEmailConfirmationHandler(
  createClient as CreateConfirmationClient
);
