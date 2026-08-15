import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

test("RegionCard reuses the green saved-state pattern from the other settings cards", async () => {
  const [region, account, body, lifestyle, goal] = await Promise.all([
    read("app/components/settings/RegionCard.tsx"),
    read("app/components/settings/AccountCard.tsx"),
    read("app/components/settings/BodyCard.tsx"),
    read("app/components/settings/LifestyleCard.tsx"),
    read("app/components/settings/GoalCard.tsx"),
  ]);
  const savedClass = "border-green-500 text-green-600";
  assert.match(region, new RegExp(savedClass));
  for (const source of [account, body, lifestyle, goal]) {
    assert.match(source, new RegExp(savedClass));
  }
});

test("settings breadcrumb uses the shared language architecture instead of hardcoded labels", async () => {
  const [breadcrumb, registry] = await Promise.all([
    read("app/(app)/settings/breadcrumb.tsx"),
    read("app/(app)/settings/settingsRegistry.ts"),
  ]);
  assert.match(breadcrumb, /const lang = useLang\(\)/);
  assert.match(breadcrumb, /uiText\[lang\]/);
  assert.match(breadcrumb, /t\.profile\.title/);
  assert.match(breadcrumb, /t\.settings\.title/);
  assert.doesNotMatch(registry, /label:\s*"Settings"|parentLabel:\s*"Profile"/);
});

test("settings breadcrumb reuses the application breadcrumb typography and alignment", async () => {
  const [settings, dashboard] = await Promise.all([
    read("app/(app)/settings/breadcrumb.tsx"),
    read("app/(app)/dashboard/breadcrumb.tsx"),
  ]);
  for (const className of [
    "text-sm w-full overflow-hidden relative",
    "flex items-center text-white/80 overflow-hidden whitespace-nowrap w-full",
    "mx-1 text-white/60 shrink-0 select-none",
    "text-white font-medium truncate block",
  ]) {
    assert.match(settings, new RegExp(className.replaceAll("/", "\\/")));
    assert.match(dashboard, new RegExp(className.replaceAll("/", "\\/")));
  }
  assert.doesNotMatch(settings, /text-white font-medium flex gap-2/);
});

test("profile breadcrumb name exists in all five supported languages", async () => {
  const source = await read("app/lib/uiText.ts");
  for (const translation of ["Profile", "Profiel", "Profil"]) {
    assert.match(source, new RegExp(`title: "${translation}"`));
  }
  assert.equal((source.match(/title: "Profil"/g) ?? []).length >= 3, true);
});
