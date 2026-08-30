import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../../../", import.meta.url);
const providerError = "Invalid login credentials";

test("login failures have a generic localized message in all supported languages", async () => {
  const source = await readFile(
    new URL("app/lib/uiText.ts", projectRoot),
    "utf8"
  );
  const expected = {
    en: ["Unable to log in.", "Check your details and try again."],
    nl: ["Inloggen is niet gelukt.", "Controleer je gegevens en probeer het opnieuw."],
    fr: ["La connexion a échoué.", "Vérifiez vos informations et réessayez."],
    de: ["Die Anmeldung ist fehlgeschlagen.", "Überprüfe deine Angaben und versuche es erneut."],
    pl: ["Logowanie nie powiodło się.", "Sprawdź swoje dane i spróbuj ponownie."],
  };
  const languages = Object.keys(expected) as Array<keyof typeof expected>;

  assert.equal((source.match(/\bloginFailure:\s*\{/g) ?? []).length, 5);
  for (const [index, language] of languages.entries()) {
    const start = source.indexOf(`const ${language} = {`);
    const nextLanguage = languages[index + 1];
    const end = nextLanguage
      ? source.indexOf(`const ${nextLanguage} = {`, start)
      : source.length;
    const localeSource = source.slice(start, end);
    const [title, guidance] = expected[language];

    assert.notEqual(start, -1);
    assert.equal(
      localeSource.includes(
        `loginFailure: { title: ${JSON.stringify(title)}, guidance: ${JSON.stringify(guidance)} }`
      ),
      true
    );
    assert.notEqual(`${title} ${guidance}`, providerError);
  }
  assert.doesNotMatch(source, /Invalid login credentials/);
});

test("LoginForm never renders provider error details", async () => {
  const source = await readFile(
    new URL("app/components/auth/LoginForm.tsx", projectRoot),
    "utf8"
  );

  assert.match(source, /if \(signInError\) \{\s*setLoginFailed\(true\)/);
  assert.match(source, /catch \{\s*setLoginFailed\(true\)/);
  assert.match(source, /role="alert"/);
  assert.match(source, /className="block">\{t\.loginFailure\.title\}/);
  assert.match(source, /className="block">\{t\.loginFailure\.guidance\}/);
  assert.doesNotMatch(source, /\.message/);
  assert.doesNotMatch(source, /Invalid login credentials/);
});
