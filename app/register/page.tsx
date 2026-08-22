import RegisterPageClient from "./RegisterPageClient";
import {
  asPublicLocale,
  PUBLIC_DEFAULT_LOCALE,
} from "@/lib/publicWeb";

type Props = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const requestedLanguage = (await searchParams).lang;
  const locale =
    asPublicLocale(
      Array.isArray(requestedLanguage) ? requestedLanguage[0] : requestedLanguage
    ) ?? PUBLIC_DEFAULT_LOCALE;

  return <RegisterPageClient initialLanguage={locale} />;
}
