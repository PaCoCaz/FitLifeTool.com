import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import {
  asPublicLocale,
  getPublicPagePath,
  PUBLIC_DEFAULT_LOCALE,
} from "@/lib/publicWeb";
import { uiText } from "@/lib/uiText";

type Props = {
  searchParams: Promise<{
    auth_notice?: string | string[];
    lang?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const parameters = await searchParams;
  const requestedLanguage = parameters.lang;
  const locale =
    asPublicLocale(
      Array.isArray(requestedLanguage) ? requestedLanguage[0] : requestedLanguage
    ) ?? PUBLIC_DEFAULT_LOCALE;
  const t = uiText[locale].auth;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]"
      lang={locale}
    >
      <section className="w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-[#191970]">
          {t.loginTitle}
        </h1>
        {parameters.auth_notice === "password_reset" && (
          <p className="mb-4 text-sm text-green-700" role="status">
            {t.passwordResetSuccess} {t.loginAgain}
          </p>
        )}
        <LoginForm language={locale} />
        <Link
          href={getPublicPagePath("home", locale)}
          className="mt-4 inline-block text-sm text-[#191970] hover:underline"
        >
          {t.back}
        </Link>
      </section>
    </main>
  );
}
