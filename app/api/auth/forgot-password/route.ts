import { createClient } from "@supabase/supabase-js";
import { createPasswordRecoveryHandler } from "@/lib/auth/passwordRecovery";

export const POST = createPasswordRecoveryHandler({
  configuration: () => ({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  }),
  createAnonClient: createClient,
});
