//  app/(app)/settings/page.tsx

import SettingsGrid from "@/components/layout/SettingsGrid";
import { resolvePasswordChangeAvailability, type PasswordChangeNormalClient } from "@/lib/auth/passwordChange";
import { resolveEmailChangeIdentity, type EmailChangeNormalClient } from "@/lib/auth/emailChange";
import { createClient } from "@/lib/supabaseServer";

export default async function SettingsPage() {
  let passwordChangeAvailable = false;
  let emailChangeAvailable = false;
  let canonicalEmail: string | null = null;
  try {
    const client = (await createClient()) as unknown as PasswordChangeNormalClient & EmailChangeNormalClient;
    passwordChangeAvailable = (await resolvePasswordChangeAvailability(client)).available;
    const emailIdentity = await resolveEmailChangeIdentity(client);
    emailChangeAvailable = emailIdentity.ok;
    canonicalEmail = emailIdentity.ok ? emailIdentity.email : null;
  } catch {
    passwordChangeAvailable = false;
    emailChangeAvailable = false;
    canonicalEmail = null;
  }
  return <SettingsGrid passwordChangeAvailable={passwordChangeAvailable} emailChangeAvailable={emailChangeAvailable} canonicalEmail={canonicalEmail} />;
}
