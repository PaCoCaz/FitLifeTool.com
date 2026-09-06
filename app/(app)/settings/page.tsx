//  app/(app)/settings/page.tsx

import SettingsGrid from "@/components/layout/SettingsGrid";
import { resolvePasswordChangeAvailability, type PasswordChangeNormalClient } from "@/lib/auth/passwordChange";
import { createClient } from "@/lib/supabaseServer";

export default async function SettingsPage() {
  let passwordChangeAvailable = false;
  try {
    const client = (await createClient()) as unknown as PasswordChangeNormalClient;
    passwordChangeAvailable = (await resolvePasswordChangeAvailability(client)).available;
  } catch {
    passwordChangeAvailable = false;
  }
  return <SettingsGrid passwordChangeAvailable={passwordChangeAvailable} />;
}
