import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { canAccessHandbook } from "./handbookAccess.ts";

test("normal users do not receive Handbook navigation access", () => {
  assert.equal(canAccessHandbook("user"), false);
  assert.equal(canAccessHandbook(null), false);
});

test("existing internal roles retain Handbook navigation access", () => {
  assert.equal(canAccessHandbook("owner"), true);
  assert.equal(canAccessHandbook("admin"), true);
  assert.equal(canAccessHandbook("developer"), true);
});

test("TopNavigation gates only the Handbook item with the existing role check", async () => {
  const source = await readFile(
    new URL("../../components/layout/TopNavigation.tsx", import.meta.url),
    "utf8"
  );
  assert.match(source, /getAuthNavItems\(t, canAccessHandbook\(role\)\)/);
  assert.match(source, /showHandbook \? \[\{ label: t\.nav\.handbook, href: "\/handbook" \}\] : \[\]/);
});
