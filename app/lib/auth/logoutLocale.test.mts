import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../../../", import.meta.url);

test("logout uses the canonical locale homepage registry", async () => {
  const [avatarMenu, publicWeb] = await Promise.all([
    readFile(
      new URL("app/components/layout/AvatarMenu.tsx", projectRoot),
      "utf8"
    ),
    readFile(new URL("app/lib/publicWeb.ts", projectRoot), "utf8"),
  ]);

  for (const mapping of [
    /en: "\/"/,
    /nl: "\/nl"/,
    /fr: "\/fr"/,
    /de: "\/de"/,
    /pl: "\/pl"/,
  ]) {
    assert.match(publicWeb, mapping);
  }

  assert.match(
    publicWeb,
    /const safeLocale = asPublicLocale\(locale\) \?\? PUBLIC_DEFAULT_LOCALE/
  );
  assert.match(publicWeb, /return getPublicPagePath\("home", safeLocale\)/);
  assert.match(avatarMenu, /const lang = useLang\(\)/);
  assert.match(
    avatarMenu,
    /await fetch\("\/auth\/logout", \{\s*method: "POST",\s*cache: "no-store",\s*credentials: "include"/
  );
  assert.match(
    avatarMenu,
    /window\.location\.assign\(getPublicHomePath\(lang\)\)/
  );
  assert.doesNotMatch(avatarMenu, /window\.location\.assign\("\/"\)/);
  assert.doesNotMatch(avatarMenu, /redirect|returnTo|next=/);
});
