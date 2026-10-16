import { createClient } from "@/lib/supabaseServer";
import {
  PUBLIC_REGISTRATION_HEADERS,
  readPublicRegistrationState,
  type RegistrationClient,
} from "@/lib/auth/publicRegistration";

export const dynamic = "force-dynamic";

export async function GET() {
  let state = { open: false };
  try {
    state = await readPublicRegistrationState(
      await createClient() as unknown as RegistrationClient
    );
  } catch {
    // Fail closed without exposing configuration or provider details.
  }
  return Response.json(state, { headers: PUBLIC_REGISTRATION_HEADERS });
}
