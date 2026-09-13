import assert from "node:assert/strict"; import test from "node:test"; import { readFile } from "node:fs/promises";
import { createEmailChangeSubmissionGate, parseEmailChangeResponse, parseLocalCleanup } from "./emailChangeClient.ts";
test("submission gate is one shot", () => {
  const gate = createEmailChangeSubmissionGate(); assert.equal(gate.begin(), true); gate.lock(); gate.finish(); assert.equal(gate.begin(), false);
});
test("cleanup destination is closed and locale correct", () => {
  assert.equal(parseLocalCleanup(200, { code: "LOGOUT_COMPLETED", destination: "/nl" }, "nl"), "/nl");
  assert.equal(parseLocalCleanup(200, { code: "LOGOUT_COMPLETED", destination: "https://evil.test" }, "nl"), null);
  assert.equal(parseLocalCleanup(200, { code: "LOGOUT_COMPLETED", destination: "/en" }, "en"), null);
  assert.equal(parseEmailChangeResponse(202, { code: "EMAIL_CHANGE_REQUEST_ACCEPTED" }), "EMAIL_CHANGE_REQUEST_ACCEPTED");
});
test("settings cleanup retry cannot invoke the provider mutation again", async () => {
  const source=await readFile(new URL("../../../app/components/settings/EmailChangeCard.tsx",import.meta.url),"utf8");
  const cleanup=source.slice(source.indexOf("async function cleanup"),source.indexOf("async function submit"));
  assert.match(cleanup,/fetch\("\/auth\/logout"/);assert.match(cleanup,/notifyClientSessionEvent\("logout"\)/);assert.match(cleanup,/window\.location\.assign\(destination\)/);
  assert.doesNotMatch(cleanup,/change-email|updateUser|currentPassword|newEmail/);
});
