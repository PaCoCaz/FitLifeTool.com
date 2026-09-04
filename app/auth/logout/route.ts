import { cookies } from "next/headers";
import { createClient } from "@/lib/supabaseServer";
import { createLogoutHandler, type LogoutClient } from "@/lib/auth/logout";
import { AUTH_CONTEXT_COOKIE, AUTH_CONTEXT_COOKIE_OPTIONS } from "@/lib/auth/sessionLifecycle";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  return createLogoutHandler(
    async () => (await createClient()) as unknown as LogoutClient,
    () => cookieStore.get(AUTH_CONTEXT_COOKIE)?.value,
    () => cookieStore.set(AUTH_CONTEXT_COOKIE, "", { ...AUTH_CONTEXT_COOKIE_OPTIONS, maxAge: 0 })
  )(request);
}
