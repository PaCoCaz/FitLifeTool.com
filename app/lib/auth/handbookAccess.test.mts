import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { canAccessHandbook } from "./handbookAccess.ts";

test("normal users do not receive Handbook navigation access", () => {
  assert.equal(canAccessHandbook("user"), false);
  assert.equal(canAccessHandbook(null), false);
  assert.equal(canAccessHandbook(undefined), false);
});

test("existing internal roles retain Handbook navigation access", () => {
  assert.equal(canAccessHandbook("owner"), true);
  assert.equal(canAccessHandbook("admin"), true);
  assert.equal(canAccessHandbook("developer"), true);
});

test("unknown, differently cased, and padded roles fail closed", () => {
  for (const role of [
    "superadmin",
    "OWNER",
    "Admin",
    " developer",
    "developer ",
    "",
    1,
    {},
  ]) {
    assert.equal(canAccessHandbook(role), false);
  }
});

test("TopNavigation gates only the Handbook item with the existing role check", async () => {
  const source = await readFile(
    new URL("../../components/layout/TopNavigation.tsx", import.meta.url),
    "utf8"
  );
  assert.match(source, /getAuthNavItems\(t, canAccessHandbook\(role\)\)/);
  assert.match(source, /showHandbook \? \[\{ label: t\.nav\.handbook, href: "\/handbook" \}\] : \[\]/);
});

test("proxy and server layout use the same helper as independent boundaries", async () => {
  const [proxySource, layoutSource] = await Promise.all([
    readFile(new URL("../../../proxy.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../../(app)/handbook/layout.tsx", import.meta.url),
      "utf8"
    ),
  ]);

  for (const source of [proxySource, layoutSource]) {
    assert.match(source, /import \{ canAccessHandbook \}/);
    assert.match(source, /canAccessHandbook\(profile\.role\)/);
    assert.doesNotMatch(
      source,
      /\["owner", "admin", "developer"\]\.includes/
    );
    assert.match(source, /\.from\("profiles"\)[\s\S]*?\.select\("role"\)/);
  }

  assert.match(proxySource, /NextResponse\.redirect/);
  assert.match(layoutSource, /if \(!user\) redirect\("\/login"\)/);
  assert.match(layoutSource, /redirect\("\/"\)/);
});
