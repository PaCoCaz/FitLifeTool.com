import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import {
  PASSWORD_MIN_LENGTH,
  validatePassword,
  validatePasswordConfirmation,
} from "./auth/passwordPolicy.ts";

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

test("settings receives password-change availability from the server and renders a distinct card", async () => {
  const [page, grid, card] = await Promise.all([
    read("app/(app)/settings/page.tsx"),
    read("app/components/layout/SettingsGrid.tsx"),
    read("app/components/settings/PasswordChangeCard.tsx"),
  ]);
  assert.match(page, /resolvePasswordChangeAvailability/);
  assert.match(page, /passwordChangeAvailable/);
  assert.doesNotMatch(page, /"use client"/);
  assert.match(grid, /<PasswordChangeCard available=\{passwordChangeAvailable\}/);
  assert.doesNotMatch(grid, /<AccountCard[^>]*passwordChange/i);
  assert.match(card, /available: boolean/);
  assert.match(card, /disabled/);
});

test("password-change form is accessible and delegates terminal cleanup to Phase06", async () => {
  const card = await read("app/components/settings/PasswordChangeCard.tsx");
  for (const value of [
    '<form onSubmit={submit} noValidate',
    'id="password-change-current"',
    'id="password-change-new"',
    'id="password-change-confirmation"',
    'autoComplete="current-password"',
    'autoComplete="new-password"',
    'aria-invalid',
    'aria-describedby',
    'password-change-helper',
    'currentRef.current?.focus()',
    'newRef.current?.focus()',
    'confirmationRef.current?.focus()',
    'fetch("/auth/logout"',
    'notifyClientSessionEvent("logout")',
  ]) assert.match(card, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(card, /submissionGate\.current\.lockTerminal\(\)/);
  assert.match(card, /fieldProps\("newPassword", "password-change-new-error", "password-change-helper"\)/);
  assert.doesNotMatch(card, /\.message|returnTo|supabase\.auth\.signOut/);
});

type TestNode = { type: unknown; props?: Record<string, unknown> };

async function createPasswordChangeCardHarness(
  request: (url: string) => Promise<unknown>
) {
  const source = await read("app/components/settings/PasswordChangeCard.tsx");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const slots: unknown[] = [];
  const locations: string[] = [];
  const requests: string[] = [];
  let hookIndex = 0;
  const react = {
    useRef(value: unknown) {
      const index = hookIndex++;
      return slots[index] ??= { current: value };
    },
    useState(value: unknown) {
      const index = hookIndex++;
      if (!(index in slots)) slots[index] = value;
      return [slots[index], (next: unknown) => { slots[index] = next; }];
    },
  };
  const jsx = (type: unknown, props: Record<string, unknown>) => ({ type, props });
  const text = new Proxy({}, { get: (_target, property) => String(property) });
  const imports: Record<string, unknown> = {
    react,
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "next/link": { default: "link" },
    "@/components/ui/Card": { default: "card" },
    "@/components/ui/CardHeader": { default: "header" },
    "@/lib/auth/passwordPolicy": {
      PASSWORD_MIN_LENGTH,
      validatePassword,
      validatePasswordConfirmation,
    },
    "@/lib/auth/clientSessionLifecycle": { notifyClientSessionEvent() {} },
    "@/lib/uiText": { uiText: { en: { auth: text } } },
    "@/lib/useLang": { useLang: () => "en" },
  };
  const compiledModule = { exports: {} as { default?: (props: { available: boolean }) => TestNode } };
  Function("require", "module", "exports", compiled)(
    (name: string) => imports[name],
    compiledModule,
    compiledModule.exports
  );
  const component = compiledModule.exports.default;
  assert.ok(component);

  const originalFetch = globalThis.fetch;
  const originalWindow = (globalThis as { window?: unknown }).window;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    requests.push(url);
    return await request(url) as Response;
  }) as typeof fetch;
  (globalThis as { window?: unknown }).window = {
    location: { assign: (destination: string) => locations.push(destination) },
  };

  function render() {
    hookIndex = 0;
    return component({ available: true });
  }
  function descendants(value: unknown): TestNode[] {
    if (!value || typeof value !== "object") return [];
    if (Array.isArray(value)) return value.flatMap(descendants);
    const node = value as TestNode;
    return [node, ...descendants(node.props?.children)];
  }
  function fillPasswords(tree: TestNode) {
    for (const input of descendants(tree).filter((node) => node.type === "input")) {
      const id = input.props?.id;
      const value = id === "password-change-current"
        ? "current password"
        : "new password";
      (input.props?.onChange as (event: { target: { value: string } }) => void)({
        target: { value },
      });
    }
  }
  const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
  return {
    render,
    descendants,
    fillPasswords,
    requests,
    locations,
    slots,
    flush,
    restore() {
      globalThis.fetch = originalFetch;
      (globalThis as { window?: unknown }).window = originalWindow;
    },
  };
}

const appResponse = (status: number, code: string) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => ({ code }),
});

test("actual PasswordChangeCard makes ambiguous responses terminal and non-retryable", async () => {
  for (const response of [
    () => Promise.resolve({ status: 200, ok: true, json: async () => { throw new SyntaxError("malformed"); } }),
    () => Promise.reject(new TypeError("connection reset after dispatch")),
    () => Promise.resolve(appResponse(418, "UNRECOGNIZED_PASSWORD_CHANGE_OUTCOME")),
    () => Promise.resolve(appResponse(200, "PASSWORD_CHANGE_REAUTH_FAILED")),
  ]) {
    const harness = await createPasswordChangeCardHarness(async () => response());
    try {
      let tree = harness.render();
      harness.fillPasswords(tree);
      tree = harness.render();
      const submit = harness.descendants(tree).find((node) => node.type === "form")
        ?.props?.onSubmit as (event: { preventDefault(): void }) => Promise<void>;
      await submit({ preventDefault() {} });
      await submit({ preventDefault() {} });
      tree = harness.render();
      assert.deepEqual(harness.requests, ["/api/auth/change-password"]);
      assert.equal(harness.descendants(tree).some((node) => node.type === "form"), false);
      assert.equal(
        harness.descendants(tree).find((node) => node.props?.role === "alert")?.props?.children,
        "passwordChangeUnknown"
      );
      assert.equal(harness.slots.includes("current password"), false);
      assert.equal(harness.slots.includes("new password"), false);
    } finally {
      harness.restore();
    }
  }
});

test("unknown mutation certainty survives failed and successful cleanup", async () => {
  let logoutAttempt = 0;
  const harness = await createPasswordChangeCardHarness(async (url) => {
    if (url === "/api/auth/change-password") {
      return { status: 200, ok: true, json: async () => { throw new SyntaxError("malformed"); } };
    }
    logoutAttempt += 1;
    return logoutAttempt === 1
      ? appResponse(503, "LOGOUT_UNAVAILABLE")
      : appResponse(200, "LOGOUT_COMPLETED");
  });
  try {
    let tree = harness.render();
    harness.fillPasswords(tree);
    tree = harness.render();
    await (harness.descendants(tree).find((node) => node.type === "form")?.props?.onSubmit as
      (event: { preventDefault(): void }) => Promise<void>)({ preventDefault() {} });
    tree = harness.render();
    (harness.descendants(tree).find((node) => node.type === "button")?.props?.onClick as () => void)();
    await harness.flush();
    tree = harness.render();
    assert.equal(
      harness.descendants(tree).find((node) => node.props?.role === "alert")?.props?.children,
      "passwordChangeUnknown"
    );
    (harness.descendants(tree).find((node) => node.type === "button")?.props?.onClick as () => void)();
    await harness.flush();
    assert.deepEqual(harness.locations, ["/login?lang=en"]);
    assert.equal(harness.locations.some((value) => value.includes("password_changed")), false);
    assert.equal(harness.requests.filter((value) => value === "/api/auth/change-password").length, 1);
  } finally {
    harness.restore();
  }
});

test("proven success may finish cleanup without repeating password mutation", async () => {
  let logoutAttempt = 0;
  const harness = await createPasswordChangeCardHarness(async (url) => {
    if (url === "/api/auth/change-password") {
      return appResponse(200, "PASSWORD_CHANGE_COMPLETED");
    }
    logoutAttempt += 1;
    return logoutAttempt === 1
      ? appResponse(503, "LOGOUT_UNAVAILABLE")
      : appResponse(200, "LOGOUT_COMPLETED");
  });
  try {
    let tree = harness.render();
    harness.fillPasswords(tree);
    tree = harness.render();
    await (harness.descendants(tree).find((node) => node.type === "form")?.props?.onSubmit as
      (event: { preventDefault(): void }) => Promise<void>)({ preventDefault() {} });
    tree = harness.render();
    assert.equal(
      harness.descendants(tree).find((node) => node.props?.role === "alert")?.props?.children,
      "passwordChangeCleanupRequired"
    );
    (harness.descendants(tree).find((node) => node.type === "button")?.props?.onClick as () => void)();
    await harness.flush();
    assert.deepEqual(harness.locations, ["/login?lang=en&auth_notice=password_changed"]);
    assert.equal(harness.requests.filter((value) => value === "/api/auth/change-password").length, 1);
  } finally {
    harness.restore();
  }
});

test("definitive pre-mutation response permits a later manual submit", async () => {
  const harness = await createPasswordChangeCardHarness(async () =>
    appResponse(403, "PASSWORD_CHANGE_REAUTH_FAILED")
  );
  try {
    let tree = harness.render();
    harness.fillPasswords(tree);
    tree = harness.render();
    await (harness.descendants(tree).find((node) => node.type === "form")?.props?.onSubmit as
      (event: { preventDefault(): void }) => Promise<void>)({ preventDefault() {} });
    tree = harness.render();
    await (harness.descendants(tree).find((node) => node.type === "form")?.props?.onSubmit as
      (event: { preventDefault(): void }) => Promise<void>)({ preventDefault() {} });
    assert.equal(harness.requests.filter((value) => value === "/api/auth/change-password").length, 2);
  } finally {
    harness.restore();
  }
});

test("all five locales contain the exact neutral unavailable password-change copy", async () => {
  const source = await read("app/lib/uiText.ts");
  for (const text of [
    "Password change is not available for this sign-in method.",
    "Wachtwoord wijzigen is niet beschikbaar voor deze inlogmethode.",
    "La modification du mot de passe n’est pas disponible pour cette méthode de connexion.",
    "Das Ändern des Passworts ist für diese Anmeldemethode nicht verfügbar.",
    "Zmiana hasła nie jest dostępna dla tej metody logowania.",
  ]) assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((source.match(/passwordChangeUnavailableMethod:/g) ?? []).length, 5);
});
