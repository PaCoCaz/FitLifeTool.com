import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PASSWORD_MIN_LENGTH } from "./passwordPolicy.ts";
import { validateRegistrationFields } from "./registration.ts";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

const registrationFailureText = {
  en: "We couldn’t create your account. Please try again.",
  nl: "We konden je account niet aanmaken. Probeer het opnieuw.",
  fr: "Nous n’avons pas pu créer votre compte. Veuillez réessayer.",
  de: "Dein Konto konnte nicht erstellt werden. Bitte versuche es erneut.",
  pl: "Nie udało się utworzyć konta. Spróbuj ponownie.",
} as const;

const validRegistration = {
  firstName: "Alex",
  lastName: "Example",
  email: "alex@example.com",
  password: "correct-horse-battery-staple",
  confirmPassword: "correct-horse-battery-staple",
  countryCode: "NL",
  language: "en" as const,
};

test("confirmation route handles code and token safely before onboarding", async () => {
  const source = await read("app/auth/confirm/route.ts");
  assert.match(source, /exchangeCodeForSession/);
  assert.match(source, /verifyOtp/);
  assert.match(source, /parseEmailConfirmationRequest/);
  assert.match(source, /resolveServerAuthState\(client\)/);
  assert.match(source, /"\/onboarding"/);
  assert.match(source, /"\/dashboard"/);
  assert.doesNotMatch(source, /confirmation_failed|auth_error/);
});

test("protected routes distinguish unauthenticated, incomplete and complete users", async () => {
  const source = await read("proxy.ts");
  assert.match(source, /isProtected && onboardingStep !== "complete"/);
  assert.match(source, /isOnboarding && onboardingStep === "complete"/);
  assert.match(source, /new URL\("\/onboarding"/);
  assert.match(source, /new URL\("\/dashboard"/);
});

test("final onboarding delegates atomic completion to the server boundary", async () => {
  const source = await read("app/components/auth/OnboardingFinalStep.tsx");
  const submit = source.slice(source.indexOf("async function handleFinish"));

  assert.match(submit, /fetch\("\/api\/onboarding\/complete"/);
  assert.match(submit, /JSON\.stringify\(\{ activityLevel, goal \}\)/);
  assert.match(submit, /result\.destination !== "\/dashboard"/);
  assert.match(submit, /await onComplete\(\)/);
  assert.doesNotMatch(submit, /from\("profiles"\).*update/s);
  assert.doesNotMatch(submit, /from\("user_goal_periods"\).*(?:insert|update)/s);
  assert.doesNotMatch(submit, /recalculate_user_targets|\.message|returnTo/);
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

test("shared registration surfaces fail closed before rendering the signup form", async () => {
  const [modal, step] = await Promise.all([
    read("app/components/auth/RegisterModal.tsx"),
    read("app/components/auth/RegisterStep.tsx"),
  ]);

  assert.match(modal, /fetch\("\/api\/auth\/registration-status"/);
  assert.match(modal, /const modalReady = open && \(mode !== "register" \|\| registrationOpen !== null\)/);
  assert.match(modal, /if \(!modalReady\) return null/);
  assert.ok(modal.indexOf("if (!modalReady) return null") < modal.indexOf('role="dialog"'));
  assert.match(modal, /\.catch\(\(\) => \{[\s\S]*setRegistrationOpen\(false\)/);
  assert.match(step, /resolvedRegistrationOpen\?: boolean/);
  assert.match(step, /if \(resolvedRegistrationOpen !== undefined\)/);
  assert.match(step, /fetch\("\/api\/auth\/registration-status"/);
  assert.match(step, /setRegistrationOpen\(false\)/);
  assert.match(step, /if \(!registrationStatusLoaded\)/);
  assert.match(step, /if \(!registrationOpen\)/);
  assert.ok(step.indexOf("if (!registrationOpen)") < step.indexOf("<form onSubmit={handleRegister}"));
  assert.match(step, /onLogin\?: \(\) => void/);
  assert.match(step, /onClick=\{onLogin\}/);
  assert.match(step, /href=\{`\/login\?lang=/);
});

test("registration modal waits for one current status result and ignores stale requests", async () => {
  const modal = await read("app/components/auth/RegisterModal.tsx");

  assert.match(modal, /const registrationRequestRef = useRef\(0\)/);
  assert.match(modal, /const controller = new AbortController\(\)/);
  assert.match(modal, /signal: controller\.signal/);
  assert.match(modal, /registrationRequestRef\.current === requestId/);
  assert.match(modal, /!controller\.signal\.aborted/);
  assert.match(modal, /return \(\) => controller\.abort\(\)/);
  assert.match(modal, /resolvedRegistrationOpen=\{registrationOpen \?\? false\}/);
  assert.doesNotMatch(modal, /registrationStatusLoading/);
});

test("registration-closed login action reuses the public auth modal", async () => {
  const [modal, directRegistration] = await Promise.all([
    read("app/components/auth/RegisterModal.tsx"),
    read("app/register/RegisterPageClient.tsx"),
  ]);

  assert.match(modal, /onLogin=\{[\s\S]*onModeChange\("login"\)[\s\S]*\}/);
  assert.match(directRegistration, /<RegisterStep[\s\S]*onLanguageSelect=\{setLanguage\}[\s\S]*\/>/);
  assert.doesNotMatch(directRegistration, /onLogin=/);
});

test("registration-closed modal uses approved branding, layout and close actions", async () => {
  const [modal, step, text] = await Promise.all([
    read("app/components/auth/RegisterModal.tsx"),
    read("app/components/auth/RegisterStep.tsx"),
    read("app/lib/uiText.ts"),
  ]);

  assert.match(modal, /registrationClosed \? "p-\[14px\]" : "p-6"/);
  assert.match(modal, /src="\/images\/fitlifetool-heart-footer\.png"/);
  assert.match(modal, /aria-hidden="true"/);
  assert.match(modal, /registrationClosed \? \([\s\S]*<Image[\s\S]*\) : \([\s\S]*aria-label=\{t\.common\.close\}/);
  assert.match(step, /onClick=\{onDismiss\}/);
  assert.match(step, /w-full rounded-\[var\(--radius\)\]/);
  assert.match(step, /border-t border-\[#91A6C2\]/);
  assert.match(step, /d="M2\.5 8h10m-4-4 4 4-4 4"/);
  assert.match(step, /no-underline hover:text-\[#0BA4E0\] hover:no-underline/);
  assert.doesNotMatch(step, /underline-offset/);
  assert.match(text, /registrationClosedTitle: "Binnenkort beschikbaar!"/);
  assert.match(text, /registrationClosedAcknowledge: "Begrepen"/);
  assert.match(text, /registrationClosedAccountPrompt: "Heb je al een account\?"/);
  assert.match(text, /registrationClosedLoginAction: "Inloggen"/);
  assert.match(text, /registrationClosed: "We're working hard on FitLifeTool to bring you the best possible experience\."/);
  assert.match(text, /registrationClosed: "Nous travaillons activement sur FitLifeTool pour vous offrir bientôt la meilleure expérience possible\."/);
  assert.match(text, /registrationClosed: "Intensywnie pracujemy nad FitLifeTool, aby już niedługo zapewnić Ci jak najlepsze doświadczenia\."/);
  assert.match(text, /registrationClosedDetails: "Dlatego rejestracja jest obecnie niedostępna\. Zajrzyj do nas ponownie wkrótce!"/);
  for (const action of ["Inloggen", "Log in", "Se connecter", "Anmelden", "Zaloguj się"]) {
    assert.match(text, new RegExp(`registrationClosedLoginAction: "${action}"`));
  }
});

test("shared registration validation blocks password and confirmation failures", () => {
  const shortPassword = validateRegistrationFields({
    ...validRegistration,
    password: "x".repeat(PASSWORD_MIN_LENGTH - 1),
    confirmPassword: "x".repeat(PASSWORD_MIN_LENGTH - 1),
  });
  assert.equal(shortPassword.valid, false);
  if (!shortPassword.valid) {
    assert.equal(shortPassword.errors.password, "REG_PASSWORD_TOO_SHORT");
  }

  const missingConfirmation = validateRegistrationFields({
    ...validRegistration,
    confirmPassword: "",
  });
  assert.equal(missingConfirmation.valid, false);
  if (!missingConfirmation.valid) {
    assert.equal(
      missingConfirmation.errors.confirmPassword,
      "REG_CONFIRMATION_REQUIRED"
    );
  }

  const mismatch = validateRegistrationFields({
    ...validRegistration,
    confirmPassword: "different-password",
  });
  assert.equal(mismatch.valid, false);
  if (!mismatch.valid) {
    assert.equal(
      mismatch.errors.confirmPassword,
      "REG_PASSWORD_MISMATCH"
    );
  }

  assert.deepEqual(validateRegistrationFields(validRegistration), {
    valid: true,
    errors: {},
  });
});

test("RegisterStep validates before signup and maps every shared field error", async () => {
  const source = await read("app/components/auth/RegisterStep.tsx");
  const validationCall = source.indexOf("validateRegistrationFields({");
  const invalidBranch = source.indexOf("if (!validation.valid)");
  const signupCall = source.indexOf("supabase.auth.signUp");

  assert.ok(validationCall >= 0 && invalidBranch > validationCall);
  assert.ok(signupCall > invalidBranch);
  assert.match(source, /if \(!validation\.valid\) \{[\s\S]*?return;[\s\S]*?\}/);
  assert.match(source, /\.\.\.input,\s*confirmPassword/);

  const mappings = {
    REG_LANGUAGE_INVALID: "t.registrationErrors.languageInvalid",
    REG_FIRST_NAME_REQUIRED: "t.registrationErrors.firstNameRequired",
    REG_LAST_NAME_REQUIRED: "t.registrationErrors.lastNameRequired",
    REG_EMAIL_REQUIRED: "t.registrationErrors.emailRequired",
    REG_EMAIL_INVALID: "t.registrationErrors.emailInvalid",
    REG_PASSWORD_REQUIRED: "t.registrationErrors.passwordRequired",
    REG_PASSWORD_TOO_SHORT: "t.registrationErrors.passwordTooShort",
    REG_CONFIRMATION_REQUIRED: "t.registrationErrors.confirmationRequired",
    REG_PASSWORD_MISMATCH: "t.registrationErrors.passwordMismatch",
    REG_COUNTRY_INVALID: "t.registrationErrors.countryInvalid",
  } as const;

  for (const [code, textKey] of Object.entries(mappings)) {
    assert.match(
      source,
      new RegExp(`${code}: [^\\n]*${textKey.replaceAll(".", "\\.")}`)
    );
  }
});

test("registration confirmation stays local and canonical signup data stays unchanged", async () => {
  const source = await read("app/components/auth/RegisterStep.tsx");
  const inputBlock = source.match(/const input = \{([\s\S]*?)\n    \};/);
  const signUpBlock = source.match(/supabase\.auth\.signUp\(\{([\s\S]*?)\n      \}\);/);

  assert.ok(inputBlock);
  assert.doesNotMatch(inputBlock[1], /confirmPassword/);
  assert.ok(signUpBlock);
  assert.doesNotMatch(signUpBlock[1], /confirmPassword/);
  assert.match(signUpBlock[1], /data: buildRegistrationMetadata\(input\)/);
  assert.match(
    signUpBlock[1],
    /emailRedirectTo: buildEmailConfirmationRedirectUrl\(\s*window\.location\.origin,\s*selectedLanguage\s*\)/
  );
  assert.doesNotMatch(signUpBlock[1], /next|returnTo/);
});

test("registration field errors use accessible stable associations and focus order", async () => {
  const [step, country] = await Promise.all([
    read("app/components/auth/RegisterStep.tsx"),
    read("app/components/auth/CountrySelect.tsx"),
  ]);

  assert.match(step, /const formId = useId\(\)/);
  assert.match(step, /<form[^>]*noValidate/);
  assert.match(step, /<label htmlFor=\{fieldIds\.(?:language|firstName|lastName|email|password|confirmPassword)\}/g);
  assert.match(step, /aria-invalid=\{Boolean\(/);
  assert.match(step, /aria-describedby=/);
  assert.match(step, /\[passwordHelperId, passwordError/);
  assert.match(
    step,
    /const FIELD_ORDER:[\s\S]*?"language",[\s\S]*?"firstName",[\s\S]*?"lastName",[\s\S]*?"email",[\s\S]*?"password",[\s\S]*?"confirmPassword",[\s\S]*?"countryCode"/
  );
  assert.match(step, /FIELD_ORDER\.find\(\(field\) => errors\[field\]\)/);
  assert.match(step, /document\.getElementById\(fieldIds\[firstInvalidField\]\)\?\.focus\(\)/);
  assert.match(step, /role="alert"/);

  assert.match(country, /id\?: string/);
  assert.match(country, /invalid\?: boolean/);
  assert.match(country, /describedBy\?: string/);
  assert.match(country, /\[describedBy, error \? internalErrorId : null\]/);
});

test("all registration validation copy is present in every supported locale", async () => {
  const source = await read("app/lib/uiText.ts");
  const expectedKeys = [
    "confirmPassword",
    "passwordMinimum",
    "languageInvalid",
    "firstNameRequired",
    "lastNameRequired",
    "emailRequired",
    "emailInvalid",
    "passwordRequired",
    "passwordTooShort",
    "confirmationRequired",
    "passwordMismatch",
    "countryInvalid",
    "registrationStatusLoading",
    "registrationClosedTitle",
    "registrationClosed",
    "registrationClosedDetails",
    "registrationClosedAcknowledge",
    "registrationClosedAccountPrompt",
    "registrationClosedLoginAction",
  ];

  for (const key of expectedKeys) {
    assert.equal(
      [...source.matchAll(new RegExp(`${key}:`, "g"))].length,
      5,
      `${key} must exist in EN, NL, FR, DE and PL`
    );
  }
  assert.equal(
    [...source.matchAll(/passwordMinimum: "[^"]*\{\{minimum\}\}[^"]*"/g)].length,
    5
  );
  assert.equal(
    [...source.matchAll(/passwordTooShort: "[^"]*\{\{minimum\}\}[^"]*"/g)].length,
    5
  );
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
    /emailRedirectTo: buildEmailConfirmationRedirectUrl\(\s*window\.location\.origin,\s*selectedLanguage\s*\)/
  );
  assert.match(source, /setConfirmationSent\(true\)/);
  assert.doesNotMatch(source, /auth\/confirm\?next|returnTo/);
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
  assert.match(source, /onChange=\{\(nextCountryCode\) => \{ setCountryCode\(nextCountryCode\);/);
  assert.doesNotMatch(source, /setCountryCode\([^)]*nextLanguage/);
});

test("confirmation status continues to use live translated UI text", async () => {
  const source = await read("app/components/auth/RegisterStep.tsx");
  assert.match(source, /const t = uiText\[selectedLanguage \?\? "en"\]\.auth/);
  assert.match(source, /<EmailConfirmationPanel/);
  assert.match(source, /mode="registration"/);
  assert.match(source, /email=\{email\.trim\(\)\}/);
});

test("confirmation panel provides accessible resend and recovery behavior", async () => {
  const source = await read("app/components/auth/EmailConfirmationPanel.tsx");

  assert.match(source, /fetch\("\/api\/auth\/resend-confirmation"/);
  assert.match(source, /validateRegistrationEmail\(email\)/);
  assert.match(source, /aria-invalid=\{Boolean\(emailError\)\}/);
  assert.match(source, /aria-describedby=\{emailError/);
  assert.match(source, /role=\{result === "accepted" \? "status" : "alert"\}/);
  assert.match(source, /EMAIL_CONFIRMATION_COOLDOWN_SECONDS/);
  assert.match(source, /disabled=\{loading \|\| cooldownSeconds > 0\}/);
  assert.match(source, /if \(requestInFlight\.current \|\| cooldownSeconds > 0\) return/);
  assert.match(source, /setCooldownSeconds\(EMAIL_CONFIRMATION_COOLDOWN_SECONDS\)/);
  assert.doesNotMatch(source, /signUpError|\.message|localStorage|sessionStorage|console\./);
});

test("confirmation recovery page accepts only presentation state", async () => {
  const source = await read("app/auth/confirmation/page.tsx");

  assert.match(source, /resolveEmailConfirmationLanguage/);
  assert.match(source, /resolveEmailConfirmationPresentationState/);
  assert.match(source, /mode="recovery"/);
  assert.match(source, /robots: \{ index: false, follow: false \}/);
  assert.doesNotMatch(
    source,
    /token_hash|returnTo|searchParams[^\n]*(?:code|email)|searchParams[^\n]*next/
  );
});

test("all confirmation copy has five-locale parity and required interpolation", async () => {
  const source = await read("app/lib/uiText.ts");
  const keys = [
    "confirmationSpamGuidance",
    "confirmationResend",
    "confirmationResending",
    "confirmationResendSuccess",
    "confirmationResendCooldown",
    "confirmationResendFailure",
    "confirmationInvalidTitle",
    "confirmationInvalidMessage",
    "confirmationUnavailableTitle",
    "confirmationUnavailableMessage",
    "confirmationRecoveryGuidance",
    "confirmationRecoverySubmit",
    "confirmationRecoverySubmitting",
    "confirmationRecoveryNeutralResult",
  ];

  for (const key of keys) {
    assert.equal(
      [...source.matchAll(new RegExp(`${key}:`, "g"))].length,
      5,
      key
    );
  }
  assert.equal(
    [...source.matchAll(/checkEmailMessage: "[^"]*\{\{email\}\}[^"]*"/g)].length,
    5
  );
  assert.equal(
    [...source.matchAll(/confirmationResendCooldown: "[^"]*\{\{seconds\}\}[^"]*"/g)].length,
    5
  );
});

test("confirmation redirects into onboarding with signup metadata available on the auth user", async () => {
  const [confirmation, provider] = await Promise.all([
    read("app/auth/confirm/route.ts"),
    read("app/lib/LangProvider.tsx"),
  ]);
  assert.match(confirmation, /return "\/onboarding"/);
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
