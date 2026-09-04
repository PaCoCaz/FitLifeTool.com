import assert from "node:assert/strict";
import test from "node:test";
import { AUTH_CONTEXT_COOKIE, AUTH_CONTEXT_COOKIE_OPTIONS, buildSessionExpiredLoginPath, classifyIdentityResult, getLocalizedPublicHome, parseAuthContextMarker, serializeAuthContextMarker } from "./sessionLifecycle.ts";

test("marker is strict, bounded and contains only lifecycle presentation state", () => {
  const value = serializeAuthContextMarker("complete", "nl");
  assert.deepEqual(parseAuthContextMarker(value), { version: 1, onboarding: "complete", locale: "nl" });
  for (const invalid of ["", "%", encodeURIComponent('{"version":2,"onboarding":"complete","locale":"en"}'), encodeURIComponent('{"version":1,"onboarding":"complete","locale":"en","userId":"secret"}'), encodeURIComponent('{"version":1,"onboarding":"other","locale":"en"}'), encodeURIComponent('{"version":1,"onboarding":"complete","locale":"es"}')]) assert.equal(parseAuthContextMarker(invalid), null);
  assert.equal(AUTH_CONTEXT_COOKIE, "__Host-flt-auth-context");
  assert.deepEqual(AUTH_CONTEXT_COOKIE_OPTIONS, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
  assert.doesNotMatch(JSON.stringify(AUTH_CONTEXT_COOKIE_OPTIONS), /domain|maxAge|expires/i);
});

test("expiry routing distinguishes complete and incomplete context", () => {
  const complete = parseAuthContextMarker(serializeAuthContextMarker("complete", "fr"))!;
  const incomplete = parseAuthContextMarker(serializeAuthContextMarker("incomplete", "de"))!;
  assert.equal(buildSessionExpiredLoginPath(complete, "/dashboard?tab=food"), "/login?lang=fr&auth_notice=session_expired&returnTo=%2Fdashboard%3Ftab%3Dfood");
  assert.equal(buildSessionExpiredLoginPath(complete, "https://evil.test"), "/login?lang=fr&auth_notice=session_expired");
  assert.equal(buildSessionExpiredLoginPath(incomplete, "/dashboard"), "/login?lang=de&auth_notice=session_expired");
});

test("public destinations and identity classification are closed", () => {
  assert.deepEqual(["en","nl","fr","de","pl"].map(getLocalizedPublicHome), ["/","/nl","/fr","/de","/pl"]);
  assert.equal(classifyIdentityResult(null, { id: "user" }, undefined), "AUTHENTICATED");
  assert.equal(classifyIdentityResult(null, null, undefined), "AUTHENTICATION_REQUIRED");
  assert.equal(classifyIdentityResult(null, null, serializeAuthContextMarker("complete", "en")), "SESSION_EXPIRED");
  assert.equal(classifyIdentityResult(new Error("network"), null, serializeAuthContextMarker("complete", "en")), "AUTH_STATE_UNAVAILABLE");
  assert.equal(classifyIdentityResult(new Error("network"), { id: "stale" }, serializeAuthContextMarker("complete", "en")), "AUTH_STATE_UNAVAILABLE");
});
