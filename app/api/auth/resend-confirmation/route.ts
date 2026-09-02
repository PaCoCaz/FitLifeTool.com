import { createClient } from "@supabase/supabase-js";
import {
  buildEmailConfirmationRedirectUrl,
  normalizeConfirmationResendResult,
} from "@/lib/auth/emailConfirmation";
import { validateRegistrationEmail } from "@/lib/auth/registration";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
};

type ResendClient = {
  auth: {
    resend(input: {
      type: "signup";
      email: string;
      options: { emailRedirectTo: string };
    }): Promise<{ error: unknown | null }>;
  };
};

type ResendDependencies = {
  configuration(): {
    supabaseUrl?: string;
    anonKey?: string;
    siteUrl?: string;
  };
  createAnonClient(
    supabaseUrl: string,
    anonKey: string,
    options: {
      auth: {
        autoRefreshToken: false;
        detectSessionInUrl: false;
        persistSession: false;
      };
    }
  ): ResendClient;
};

function response(
  code:
    | "CONFIRMATION_RESEND_ACCEPTED"
    | "CONFIRMATION_RESEND_UNAVAILABLE"
    | "INVALID_REQUEST"
    | "ORIGIN_NOT_ALLOWED",
  status: number
) {
  return Response.json({ code }, { status, headers: RESPONSE_HEADERS });
}

export function createResendConfirmationHandler(
  dependencies: ResendDependencies
) {
  return async function resendConfirmation(request: Request) {
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return response("ORIGIN_NOT_ALLOWED", 403);
    }

    if (
      request.headers.get("content-type")?.split(";", 1)[0].trim() !==
      "application/json"
    ) {
      return response("INVALID_REQUEST", 400);
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return response("INVALID_REQUEST", 400);
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return response("INVALID_REQUEST", 400);
    }

    if (
      Object.keys(body).some(
        (key) => key !== "email" && key !== "language"
      )
    ) {
      return response("INVALID_REQUEST", 400);
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (validateRegistrationEmail(email) != null) {
      return response("INVALID_REQUEST", 400);
    }

    const { supabaseUrl, anonKey, siteUrl } = dependencies.configuration();
    if (!supabaseUrl || !anonKey || !siteUrl) {
      return response("CONFIRMATION_RESEND_UNAVAILABLE", 503);
    }

    try {
      const emailRedirectTo = buildEmailConfirmationRedirectUrl(
        siteUrl,
        body.language
      );
      const supabase = dependencies.createAnonClient(supabaseUrl, anonKey, {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
      });
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo },
      });

      return normalizeConfirmationResendResult(error) === "unavailable"
        ? response("CONFIRMATION_RESEND_UNAVAILABLE", 503)
        : response("CONFIRMATION_RESEND_ACCEPTED", 202);
    } catch {
      return response("CONFIRMATION_RESEND_UNAVAILABLE", 503);
    }
  };
}

export const POST = createResendConfirmationHandler({
  configuration: () => ({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  }),
  createAnonClient: createClient,
});
