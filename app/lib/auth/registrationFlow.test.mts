import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

const registrationFailureText = {
  en: "We couldn’t create your account. Please try again.",
  nl: "We konden je account niet aanmaken. Probeer het opnieuw.",
  fr: "Nous n’avons pas pu créer votre compte. Veuillez réessayer.",
  de: "Dein Konto konnte nicht erstellt werden. Bitte versuche es erneut.",
  pl: "Nie udało się utworzyć konta. Spróbuj ponownie.",
} as const;

test("confirmation route handles code and token safely before onboarding", async () => {
  const source = await read("app/auth/confirm/route.ts");
  assert.match(source, /exchangeCodeForSession/);
  assert.match(source, /verifyOtp/);
  assert.match(source, /confirmation_failed/);
  assert.match(source, /new URL\("\/onboarding"/);
});

test("protected routes distinguish unauthenticated, incomplete and complete users", async () => {
  const source = await read("proxy.ts");
  assert.match(source, /isProtected && onboardingStep !== "complete"/);
  assert.match(source, /isOnboarding && onboardingStep === "complete"/);
  assert.match(source, /new URL\("\/onboarding"/);
  assert.match(source, /new URL\("\/dashboard"/);
});

test("final onboarding retries reuse the active goal instead of inserting another", async () => {
  const source = await read("app/components/auth/OnboardingFinalStep.tsx");
  assert.match(source, /activeGoal[\s\S]*goal_key === goal/);
  assert.match(source, /update\(\{ goal_key: goal \}\)/);
  assert.match(source, /: await supabase\.from\("user_goal_periods"\)\.insert/);
});

test("region settings keep country and food region as separate draft fields", async () => {
  const source = await read("app/components/settings/RegionCard.tsx");
  assert.match(source, /country_code: draft\.country_code/);
  assert.match(source, /food_region: draft\.food_region/);
  assert.match(source, /\{ \.\.\.current, country_code \}/);
  assert.match(source, /\{ \.\.\.current, food_region \}/);
});

test("CountrySelect follows the existing language context", async () => {
  const source = await read("app/components/auth/CountrySelect.tsx");
  assert.match(source, /const lang = useLang\(\)/);
  assert.match(source, /countries\?lang=/);
  assert.doesNotMatch(source, /\[\s*\{\s*country_code/);
});

test("registration renders language selection before the remaining fields", async () => {
  const source = await read("app/components/auth/RegisterStep.tsx");
  assert.ok(source.indexOf("registrationLanguage") < source.indexOf('placeholder={t.firstName}'));
  assert.match(source, /selectedLanguage && \(/);
});

test("registration provider failures use one generic localized UI error", async () => {
  const [step, uiText] = await Promise.all([
    read("app/components/auth/RegisterStep.tsx"),
    read("app/lib/uiText.ts"),
  ]);
  const failureMessages = [
    ...uiText.matchAll(/registrationFailure: "([^"]+)"/g),
  ].map((match) => match[1]);

  assert.deepEqual(failureMessages, Object.values(registrationFailureText));
  assert.match(
    step,
    /if \(signUpError\) \{\s*setError\(t\.registrationFailure\);\s*return;/
  );
  assert.match(step, /catch \{\s*setError\(t\.registrationFailure\);\s*\}/);
  assert.match(step, /finally \{\s*setLoading\(false\);\s*\}/);
  assert.doesNotMatch(step, /signUpError\.message|console\.(?:debug|error|info|log|warn)/);

  for (const message of failureMessages) {
    assert.doesNotMatch(
      message.toLowerCase(),
      /already registered|already exists|confirmation|provider|rate.?limit|supabase|too many requests/
    );
  }
});

test("direct registration and the HP-01 modal share the hardened RegisterStep", async () => {
  const [directRegistration, modal, publicProvider] = await Promise.all([
    read("app/register/RegisterPageClient.tsx"),
    read("app/components/auth/RegisterModal.tsx"),
    read("app/components/public/PublicAuthModalProvider.tsx"),
  ]);

  assert.match(directRegistration, /import RegisterStep/);
  assert.match(directRegistration, /<RegisterStep/);
  assert.match(modal, /import RegisterStep/);
  assert.match(modal, /<RegisterStep/);
  assert.match(publicProvider, /<RegisterModal/);
  assert.match(publicProvider, /initialLanguage=\{locale\}/);
});

test("successful registration preserves metadata, confirmation redirect and status", async () => {
  const source = await read("app/components/auth/RegisterStep.tsx");

  assert.match(source, /data: buildRegistrationMetadata\(input\)/);
  assert.match(
    source,
    /emailRedirectTo: `\$\{window\.location\.origin\}\/auth\/confirm\?next=\/onboarding`/
  );
  assert.match(source, /setConfirmationSent\(true\)/);
});

test("registration marks explicit language separately from the provider fallback", async () => {
  const [step, modal] = await Promise.all([
    read("app/components/auth/RegisterStep.tsx"),
    read("app/components/auth/RegisterModal.tsx"),
  ]);
  assert.match(modal, /useState<Lang \| null>\(null\)/);
  assert.match(step, /language: selectedLanguage/);
  assert.doesNotMatch(step, /language: lang[, }]/);
});

test("registration starts in English without treating it as an explicit choice", async () => {
  const [step, modal] = await Promise.all([
    read("app/components/auth/RegisterStep.tsx"),
    read("app/components/auth/RegisterModal.tsx"),
  ]);
  assert.match(modal, /uiText\[selectedLanguage \?\? "en"\]/);
  assert.match(modal, /useState<Lang \| null>\(null\)/);
  assert.match(step, /uiText\[selectedLanguage \?\? "en"\]\.auth/);
  assert.match(step, /value=\{selectedLanguage \?\? ""\}/);
  assert.match(step, /selectedLanguage && \(/);
});

test("registration language selection immediately updates the shared LangProvider", async () => {
  const [step, provider] = await Promise.all([
    read("app/components/auth/RegisterStep.tsx"),
    read("app/lib/LangProvider.tsx"),
  ]);
  assert.match(step, /setInterfaceLanguage\(nextLanguage\)/);
  assert.match(provider, /setInterfaceLanguage/);
  assert.match(provider, /setLang\(newLang\)/);
});

test("registration keeps the chosen country code while the language changes", async () => {
  const source = await read("app/components/auth/RegisterStep.tsx");
  assert.match(source, /value=\{countryCode\}/);
  assert.match(source, /onChange=\{setCountryCode\}/);
  assert.doesNotMatch(source, /setCountryCode\([^)]*nextLanguage/);
});

test("confirmation status continues to use live translated UI text", async () => {
  const source = await read("app/components/auth/RegisterStep.tsx");
  assert.match(source, /const t = uiText\[selectedLanguage \?\? "en"\]\.auth/);
  assert.match(source, /t\.checkEmailTitle/);
  assert.match(source, /t\.checkEmailMessage/);
});

test("confirmation redirects into onboarding with signup metadata available on the auth user", async () => {
  const [confirmation, provider] = await Promise.all([
    read("app/auth/confirm/route.ts"),
    read("app/lib/LangProvider.tsx"),
  ]);
  assert.match(confirmation, /redirect\(new URL\("\/onboarding"/);
  assert.match(provider, /user\?\.user_metadata\?\.language/);
  assert.match(provider, /resolveInterfaceLanguage\(null, user\?\.user_metadata\?\.language\)/);
});

test("profile language replaces the temporary metadata bootstrap when available", async () => {
  const source = await read("app/lib/LangProvider.tsx");
  assert.match(source, /from\("profiles"\)/);
  assert.match(source, /select\("language"\)/);
  assert.match(source, /setLang\(profileLanguage\)/);
});

test("onboarding route uses the auth dialog presentation", async () => {
  const source = await read("app/onboarding/page.tsx");
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /fixed inset-0 z-\[100\]/);
  assert.match(source, /bg-black\/40/);
  assert.match(source, /max-w-md[^"]*bg-white[^"]*shadow-xl/);
});

test("onboarding steps stay inside the dialog container", async () => {
  const source = await read("app/onboarding/page.tsx");
  const dialogStart = source.indexOf('role="dialog"');
  const flow = source.indexOf("<OnboardingFlow />");
  const sectionEnd = source.indexOf("</section>", flow);
  assert.ok(dialogStart >= 0 && flow > dialogStart && sectionEnd > flow);
});

test("persistent profile-driven onboarding state remains intact", async () => {
  const source = await read("app/components/auth/OnboardingFlow.tsx");
  assert.match(source, /fetch\("\/api\/onboarding\/state"/);
  assert.match(source, /fetch\("\/api\/onboarding\/profile"/);
  assert.match(source, /result\.step/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
});

test("the dormant OTP login helper cannot create profile-less auth users", async () => {
  const source = await read("app/lib/authActions.ts");
  assert.match(source, /shouldCreateUser: false/);
});
