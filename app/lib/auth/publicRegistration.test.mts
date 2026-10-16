import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  applyRegistrationAction,
  authorizeRegistrationAdministrator,
  canManagePublicRegistration,
  parseAdminRegistrationState,
  parsePublicRegistrationState,
  parseRegistrationAction,
  readPublicRegistrationState,
  type RegistrationClient,
} from "./publicRegistration.ts";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");

function client(options: {
  role?: unknown;
  userId?: unknown;
  authError?: unknown;
  profileError?: unknown;
  rpcData?: unknown;
  rpcError?: unknown;
} = {}): RegistrationClient {
  const query = {
    select() { return query; },
    eq() { return query; },
    async maybeSingle() {
      return { data: options.role === undefined ? null : { role: options.role }, error: options.profileError ?? null };
    },
  };
  return {
    auth: { async getUser() { return { data: { user: options.userId === undefined ? { id: "user-1" } : options.userId === null ? null : { id: options.userId } }, error: options.authError ?? null }; } },
    from() { return query; },
    async rpc() { return { data: options.rpcData ?? null, error: options.rpcError ?? null }; },
  };
}

test("only canonical owner and admin roles may manage registration", async () => {
  assert.equal(canManagePublicRegistration("owner"), true);
  assert.equal(canManagePublicRegistration("admin"), true);
  for (const role of ["developer", "user", "authenticated", null, undefined]) {
    assert.equal(canManagePublicRegistration(role), false);
    assert.deepEqual(await authorizeRegistrationAdministrator(client({ role })), role === undefined
      ? { ok: false, status: 503 }
      : { ok: false, status: 403 });
  }
  assert.deepEqual(await authorizeRegistrationAdministrator(client({ role: "admin" })), { ok: true, userId: "user-1" });
  assert.deepEqual(await authorizeRegistrationAdministrator(client({ role: "owner" })), { ok: true, userId: "user-1" });
  assert.deepEqual(await authorizeRegistrationAdministrator(client({ role: "admin", userId: null })), { ok: false, status: 401 });
});

test("temporary durations accept every integer from 1 through 60 and reject everything else", () => {
  for (let durationMinutes = 1; durationMinutes <= 60; durationMinutes += 1) {
    assert.deepEqual(parseRegistrationAction({ action: "open_temporary", durationMinutes }), { action: "open_temporary", durationMinutes });
  }
  for (const durationMinutes of [-1, 0, 1.5, 61, "10", null, undefined]) {
    assert.equal(parseRegistrationAction({ action: "open_temporary", durationMinutes }), null);
  }
  assert.deepEqual(parseRegistrationAction({ action: "open_indefinite" }), { action: "open_indefinite" });
  assert.deepEqual(parseRegistrationAction({ action: "close" }), { action: "close" });
  assert.equal(parseRegistrationAction({ action: "close", durationMinutes: 10 }), null);
  assert.equal(parseRegistrationAction({ action: "open_indefinite", durationMinutes: 10 }), null);
});

test("status parsing is strict and public reads fail closed", async () => {
  assert.deepEqual(parsePublicRegistrationState([{ is_open: true }]), { open: true });
  assert.equal(parsePublicRegistrationState([{ open: true }]), null);
  assert.deepEqual(await readPublicRegistrationState(client({ rpcData: [{ is_open: true }] })), { open: true });
  assert.deepEqual(await readPublicRegistrationState(client({ rpcError: new Error("private") })), { open: false });
  assert.deepEqual(await readPublicRegistrationState(client({ rpcData: [{ is_open: "yes" }] })), { open: false });
});

test("admin state and updates reject malformed provider responses", async () => {
  const valid = [{ is_open: true, open_until: null, server_now: "2026-10-16T12:00:00Z", version: 2 }];
  assert.deepEqual(parseAdminRegistrationState(valid), { open: true, openUntil: null, serverNow: "2026-10-16T12:00:00Z", version: 2 });
  assert.equal(parseAdminRegistrationState([{ ...valid[0], version: 0 }]), null);
  assert.equal(parseAdminRegistrationState([{ ...valid[0], server_now: "invalid" }]), null);
  assert.deepEqual(await applyRegistrationAction(client({ rpcData: valid }), { action: "close" }), { open: true, openUntil: null, serverNow: "2026-10-16T12:00:00Z", version: 2 });
  assert.equal(await applyRegistrationAction(client({ rpcData: [{ is_open: true }] }), { action: "close" }), null);
});

test("admin and public boundaries retain server-side authority and no-cache responses", async () => {
  const [adminRoute, publicRoute, page, panel, nav, robots] = await Promise.all([
    read("app/api/admin/registration-control/route.ts"),
    read("app/api/auth/registration-status/route.ts"),
    read("app/(app)/admin/registration/page.tsx"),
    read("app/components/admin/RegistrationControlPanel.tsx"),
    read("app/components/layout/TopNavigation.tsx"),
    read("app/robots.ts"),
  ]);
  assert.match(adminRoute, /authorizeRegistrationAdministrator/);
  assert.match(adminRoute, /origin !== new URL\(request\.url\)\.origin/);
  assert.match(adminRoute, /MAX_BODY_BYTES = 256/);
  assert.match(publicRoute, /readPublicRegistrationState/);
  assert.match(publicRoute, /dynamic = "force-dynamic"/);
  assert.match(page, /canManagePublicRegistration\(profile\?\.role\)/);
  assert.match(nav, /canManagePublicRegistration\(role\)/);
  assert.match(panel, /Array\.from\(\{ length: 60 \}/);
  assert.match(panel, /useState\(10\)/);
  assert.match(panel, /inviteRestriction/);
  assert.match(robots, /"\/admin"/);
});

test("all five locales document closed registration and invite behavior", async () => {
  const text = await read("app/lib/uiText.ts");
  for (const key of ["registrationStatusLoading", "registrationClosed", "inviteRestriction"]) {
    assert.equal([...text.matchAll(new RegExp(`${key}:`, "g"))].length, 5, key);
  }
  assert.equal([...text.matchAll(/registrationControl:/g)].length, 10);
});
