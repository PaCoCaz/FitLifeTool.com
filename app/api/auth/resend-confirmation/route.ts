import { createClient } from "@supabase/supabase-js";
import { createResendConfirmationHandler } from "@/lib/auth/emailConfirmation";

export const POST = createResendConfirmationHandler({
  configuration: () => ({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  }),
  createAnonClient: createClient,
});
