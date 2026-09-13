import assert from "node:assert/strict"; import test from "node:test"; import { readFile } from "node:fs/promises";
import { resolveEmailChangeCallback } from "./emailChangeCallback.ts";
test("callback accepts one credential without returning it", () => {
  const result = resolveEmailChangeCallback(new URL("https://fitlifetool.com/x?code=secret&lang=nl"));
  assert.deepEqual(result, { state: "received", language: "nl" });
  assert.equal(JSON.stringify(result).includes("secret"), false);
});
test("callback rejects conflicting or unsafe shapes", () => {
  for (const query of ["code=a&message=b", "code=a&code=b", "code=a&next=https://evil.test", "code="]) {
    assert.equal(resolveEmailChangeCallback(new URL("https://fitlifetool.com/x?" + query)).state, "invalid");
  }
});
test("callback route strips credentials and never creates a session",async()=>{
  const source=await readFile(new URL("../../../app/auth/change-email/confirm/route.ts",import.meta.url),"utf8");
  assert.match(source,/\/auth\/change-email\/confirmation/);assert.match(source,/status: 303/);
  assert.doesNotMatch(source,/exchangeCodeForSession|verifyOtp|setSession|console\.|searchParams\.set\("code"|searchParams\.set\("message"/);
});
