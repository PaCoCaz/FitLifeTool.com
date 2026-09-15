import assert from "node:assert/strict"; import test from "node:test"; import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import vm from "node:vm";
const {
  EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT,
  resolveEmailChangeCallback,
  resolveEmailChangeFragmentEvidence,
  shouldBootstrapEmailChangeFragment,
} = createRequire(import.meta.url)("./emailChangeCallback.ts");
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

test("fragment bootstrap reproduces the provider message transport without forwarding its value", () => {
  const events: string[] = [];
  const inputs: Array<{ name: string; value: string }> = [];
  const form = {
    method: "",
    action: "",
    append(input: { name: string; value: string }) { inputs.push(input); },
    submit() { events.push("submit"); },
  };
  const fragment = "#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email&sb=";
  vm.runInNewContext(EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT, {
    URLSearchParams,
    window: {
      location: { hash: fragment, pathname: "/auth/change-email/confirm", search: "?lang=nl" },
      history: { replaceState() { events.push("scrub"); } },
    },
    document: {
      createElement(name: string) { return name === "form" ? form : { type: "", name: "", value: "" }; },
      body: { append() { events.push("append"); } },
    },
  });

  assert.deepEqual(events, ["scrub", "append", "submit"]);
  assert.equal(form.method, "post");
  assert.equal(form.action, "/auth/change-email/confirm?lang=nl");
  assert.deepEqual(Object.fromEntries(inputs.map(({ name, value }) => [name, value])), {
    transport: "fragment",
    kind: "message",
    length: "82",
    lang: "nl",
  });
  assert.equal(JSON.stringify(inputs).includes("Confirmation"), false);
});

test("normalized fragment evidence is accepted without containing provider evidence", () => {
  assert.deepEqual(resolveEmailChangeFragmentEvidence([
    ["transport", "fragment"], ["kind", "message"], ["length", "82"], ["lang", "nl"],
  ]), { state: "received", language: "nl" });
});

test("fragment transport rejects duplicate, conflicting, empty, malformed and oversized evidence", () => {
  const invalidFragments = [
    "#message=a&message=b&sb=",
    "#message=a&code=b&sb=",
    "#message=&sb=",
    "#message=%E0%A4%A&sb=",
    `#message=${"a".repeat(4097)}&sb=`,
    "#message=a&access_token=secret&sb=",
    "#message=a&sb=unexpected",
  ];

  for (const hash of invalidFragments) {
    const inputs: Array<{ name: string; value: string }> = [];
    const form = { method: "", action: "", append(input: { name: string; value: string }) { inputs.push(input); }, submit() {} };
    vm.runInNewContext(EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT, {
      URLSearchParams,
      window: { location: { hash, pathname: "/auth/change-email/confirm", search: "" }, history: { replaceState() {} } },
      document: { createElement(name: string) { return name === "form" ? form : { type: "", name: "", value: "" }; }, body: { append() {} } },
    });
    assert.equal(Object.fromEntries(inputs.map(({ name, value }) => [name, value])).kind, "invalid");
  }

  for (const entries of [
    [["transport", "fragment"], ["kind", "message"], ["length", "0"], ["lang", "nl"]],
    [["transport", "fragment"], ["kind", "message"], ["length", "4097"], ["lang", "nl"]],
    [["transport", "fragment"], ["kind", "message"], ["length", "1"], ["length", "1"], ["lang", "nl"]],
    [["transport", "fragment"], ["kind", "message"], ["length", "1"], ["lang", "nl"], ["token", "x"]],
  ] as Array<Array<[string, string]>>) {
    assert.equal(resolveEmailChangeFragmentEvidence(entries).state, "invalid");
  }
});

test("query transport remains supported while fragment-only requests bootstrap", () => {
  assert.equal(shouldBootstrapEmailChangeFragment(new URL("https://fitlifetool.com/x?lang=nl")), true);
  assert.equal(shouldBootstrapEmailChangeFragment(new URL("https://fitlifetool.com/x?code=secret&lang=nl")), false);
  assert.equal(shouldBootstrapEmailChangeFragment(new URL("https://fitlifetool.com/x?next=https://evil.test")), false);
  assert.deepEqual(resolveEmailChangeCallback(new URL("https://fitlifetool.com/x?message=accepted&lang=en")), {
    state: "received", language: "en",
  });
});

test("callback route strips credentials and never creates a session",async()=>{
  const source=await readFile(new URL("../../../app/auth/change-email/confirm/route.ts",import.meta.url),"utf8");
  assert.match(source,/\/auth\/change-email\/confirmation/);assert.match(source,/status: 303/);
  assert.match(source,/Cache-Control.*private, no-store/s);
  assert.match(source,/Referrer-Policy.*no-referrer/s);
  assert.match(source,/Content-Security-Policy/);
  assert.match(source,/<body><script nonce=/);
  assert.doesNotMatch(source,/exchangeCodeForSession|verifyOtp|setSession|console\.|localStorage|sessionStorage|searchParams\.set\("code"|searchParams\.set\("message"/);
});
