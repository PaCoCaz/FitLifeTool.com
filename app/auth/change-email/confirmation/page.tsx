import { asAppLanguage } from "@/lib/languagePreference";
import { uiText } from "@/lib/uiText";
export default async function EmailChangeConfirmation({ searchParams }: { searchParams: Promise<{ lang?: string; state?: string }> }) {
  const parameters = await searchParams, language = asAppLanguage(parameters.lang) ?? "en", t = uiText[language].auth;
  return <main lang={language} className="min-h-screen flex items-center justify-center px-4 bg-[#DBE4F0]">
    <section className="w-full max-w-md rounded-[var(--radius)] bg-white p-6 shadow">
      <h1 className="text-lg font-semibold text-[#191970]">{t.emailChangeConfirmationTitle}</h1>
      <p className="mt-3 text-sm text-gray-700" role="status">
        {parameters.state === "received" ? t.emailChangeConfirmationReceived : t.emailChangeConfirmationInvalid}
      </p>
    </section>
  </main>;
}
