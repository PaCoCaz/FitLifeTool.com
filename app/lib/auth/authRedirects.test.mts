import assert from "node:assert/strict";
import test from "node:test";
import {
  asAuthLocale,
  asAuthNotice,
  getSafeProtectedReturnTo,
} from "./authRedirects.ts";

test("protected returnTo accepts only the three canonical protected roots", () => {
  for (const value of [
    "/dashboard",
    "/dashboard?tab=x",
    "/settings",
    "/settings/profile",
    "/handbook",
    "/handbook/safe-subpath",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), value);
  }
});

test("public, auth, onboarding, API, asset, and unknown roots are rejected", () => {
  for (const value of [
    "/",
    "/nl",
    "/fr",
    "/de",
    "/pl",
    "/en",
    "/login",
    "/register",
    "/onboarding",
    "/api/test",
    "/_next/static/file.js",
    "/images/logo.png",
    "/unknown",
    "/dashboard-evil",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), null);
  }
});

test("external, protocol-relative, credential, and backslash redirects are rejected", () => {
  for (const value of [
    "http://evil.example",
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/dashboard\\evil",
    "/dashboard?next=https://evil.example",
    "/dashboard?next=//evil.example",
    "/dashboard?next=javascript:alert(1)",
    "/dashboard?next=mailto:user@example.com",
    "/dashboard?next=javascript%3Aalert(1)",
    " /dashboard",
    "/dashboard ",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), null);
  }
});

test("schemes remain rejected behind punctuation and across encoded layers", () => {
  for (const value of [
    "/dashboard?next='javascript:alert(1)",
    '/dashboard?next="javascript:alert(1)',
    "/dashboard?next=(javascript:alert(1))",
    "/dashboard?next=[javascript:alert(1)]",
    "/dashboard?next=x,javascript:alert(1)",
    "/dashboard?next='JAVASCRIPT:alert(1)",
    "/dashboard?next=(http:evil)",
    "/dashboard?next=[https:evil]",
    "/dashboard?next='ftp:evil",
    "/dashboard?next=(data:text/plain,test)",
    "/dashboard?next=[vbscript:msgbox(1)]",
    "/dashboard?next=%27javascript%3Aalert(1)",
    "/dashboard?next=%28javascript%3Aalert(1)%29",
    "/dashboard?next=%2527javascript%253Aalert(1)",
    "/dashboard?next=x%2Cjavascript%3Aalert(1)",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), null);
  }
});

test("encoded, double-encoded, malformed, and structural confusion is rejected", () => {
  for (const value of [
    "/%2fevil.example",
    "/%2Fevil.example",
    "/%5cevil.example",
    "/%252fevil.example",
    "/dashboard%2fadmin",
    "/dashboard%252fadmin",
    "/dashboard%25252fadmin",
    "/dashboard/%2e%2e/settings",
    "/dashboard/%252e%252e/settings",
    "/dashboard/%25252e%25252e/settings",
    "/dashboard?next=%2f%2fevil.example",
    "/dashboard?next=%252f%252fevil.example",
    "/dashboard?next=%25252f%25252fevil.example",
    "/dashboard?bad=%E0%A4%A",
    "/dashboard%",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), null);
  }
});

test("fragments and control characters are rejected", () => {
  for (const value of [
    "/dashboard#section",
    "/dashboard%23section",
    "/dashboard\n/settings",
    "/dashboard?tab=x\r\nLocation:https://evil.example",
    "/dashboard?tab=%00x",
    "/dashboard?tab=\u0080x",
    "/dashboard?tab=\u0085x",
    "/dashboard?tab=\u009fx",
    "/dashboard?tab=%C2%80x",
    "/dashboard?tab=%C2%85x",
    "/dashboard?tab=%C2%9Fx",
    "/dashboard?tab=%25C2%2585x",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), null);
  }
});

test("root boundaries, case, slash lookalikes, and non-string input fail closed", () => {
  for (const value of [
    "///evil.example",
    "/dashboardevil",
    "/settingsx",
    "/handbook-public",
    "/Dashboard",
    "/SETTINGS",
    "/Handbook",
    "/dashboard\u2044evil",
    "/dashboard/\u2215evil",
    "/settings/\uff0fevil",
    "/handbook/\uff3cevil",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), null);
  }
  for (const value of [null, undefined, 0, false, {}, []]) {
    assert.equal(getSafeProtectedReturnTo(value), null);
  }
});

test("safe ordinary and encoded query values are preserved exactly", () => {
  for (const value of [
    "/dashboard?tab=nutrition",
    "/dashboard?page=2",
    "/settings/profile?section=privacy",
    "/dashboard?filter=nutrition%2Bhydration&page=2",
    "/handbook/safe-subpath?topic=auth%3Dsecurity",
    "/dashboard?time=12:30",
  ]) {
    assert.equal(getSafeProtectedReturnTo(value), value);
  }
});

test("auth notices use a closed allowlist", () => {
  for (const value of [
    "confirmation_failed",
    "session_expired",
    "password_reset",
  ]) {
    assert.equal(asAuthNotice(value), value);
  }
  for (const value of ["", "unknown", "rate_limited", null, 1]) {
    assert.equal(asAuthNotice(value), null);
  }
});

test("auth locale delegates to the canonical application locale allowlist", () => {
  for (const value of ["en", "nl", "fr", "de", "pl"]) {
    assert.equal(asAuthLocale(value), value);
  }
  for (const value of ["EN", "es", "", null, 1]) {
    assert.equal(asAuthLocale(value), null);
  }
});
