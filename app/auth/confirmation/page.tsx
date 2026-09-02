import type { Metadata } from "next";
import EmailConfirmationPanel from "@/components/auth/EmailConfirmationPanel";
import {
  resolveEmailConfirmationLanguage,
  resolveEmailConfirmationPresentationState,
} from "@/lib/auth/emailConfirmation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    lang?: string | string[];
    state?: string | string[];
  }>;
};

export default async function EmailConfirmationPage({ searchParams }: Props) {
  const parameters = await searchParams;
  const language = resolveEmailConfirmationLanguage(
    Array.isArray(parameters.lang) ? undefined : parameters.lang
  );
  const state = resolveEmailConfirmationPresentationState(
    Array.isArray(parameters.state) ? undefined : parameters.state
  );

  return (
    <main className="min-h-screen bg-[#DBE4F0] px-4 py-6">
      <div className="mx-auto w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow">
        <EmailConfirmationPanel
          mode="recovery"
          language={language}
          state={state}
        />
      </div>
    </main>
  );
}
