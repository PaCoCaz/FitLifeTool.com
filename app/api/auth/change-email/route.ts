import { createClient } from "@/lib/supabaseServer";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import {
  createDefaultEmailChangeFreshClient,
  createEmailChangePostHandler,
  emailChangeReply,
  readEmailChangeState,
  resolveEmailChangeIdentity,
  type EmailChangeAdmin,
  type EmailChangeNormalClient,
} from "@/lib/auth/emailChange";
import { deriveEmailChangePublicState } from "@/lib/auth/emailChangeState";

function readConfiguration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return url && key && site ? { url, key, site } : null;
}

export async function GET() {
  try {
    const client = await createClient();
    const identity = await resolveEmailChangeIdentity(client as unknown as EmailChangeNormalClient);
    if (!identity.ok) return emailChangeReply(identity.code);
    const current = await readEmailChangeState(createSupabaseServer() as unknown as EmailChangeAdmin, identity.userId);
    return Response.json({
      code: "EMAIL_CHANGE_" + deriveEmailChangePublicState(current.requestStatus, current.syncStatus).toUpperCase(),
      canonicalEmail: identity.email,
    }, { headers: { "Cache-Control": "private, no-store", Vary: "Origin, Cookie", "Referrer-Policy": "no-referrer" } });
  } catch { return emailChangeReply("AUTH_STATE_UNAVAILABLE"); }
}

export const POST = createEmailChangePostHandler({
  createNormalClient: async () => await createClient() as unknown as EmailChangeNormalClient,
  createAdminClient: () => createSupabaseServer() as unknown as EmailChangeAdmin,
  createFreshClient: createDefaultEmailChangeFreshClient,
  readConfiguration,
});
