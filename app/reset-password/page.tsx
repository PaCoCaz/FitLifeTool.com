import { Suspense } from "react";
import ResetPasswordClient from "@/reset-password/ResetPasswordClient";
import { resolveRecoveryLanguage } from "@/lib/auth/passwordRecovery";

type ResetPasswordPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const requestedLanguage = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang;
  const language = resolveRecoveryLanguage(requestedLanguage);

  return (
    <Suspense fallback={null}>
      <ResetPasswordClient language={language} />
    </Suspense>
  );
}
