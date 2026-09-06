import { createClient } from "@/lib/supabaseServer";
import {
  createDefaultFreshPasswordChangeClient,
  createPasswordChangeHandler,
  type PasswordChangeNormalClient,
} from "@/lib/auth/passwordChange";

export const POST = createPasswordChangeHandler({
  configuration: () => ({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }),
  createNormalClient: async () =>
    (await createClient()) as unknown as PasswordChangeNormalClient,
  createFreshClient: createDefaultFreshPasswordChangeClient,
});
