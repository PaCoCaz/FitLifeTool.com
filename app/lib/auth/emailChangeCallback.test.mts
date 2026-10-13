import assert from "node:assert/strict"; import test from "node:test"; import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import vm from "node:vm";
const {
  EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT,
  observeEmailChangeQuery,
  parseEmailChangeCallbackObservation,
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
  const submitted = Object.fromEntries(inputs.map(({ name, value }) => [name, value]));
  const observation = JSON.parse(submitted.observation);
  assert.deepEqual({ ...submitted, observation: undefined }, {
    transport: "fragment",
    kind: "message",
    length: "82",
    lang: "nl",
    observation: undefined,
  });
  assert.deepEqual(observation, {
    source: "fragment",
    totalLength: 94,
    fieldCount: 2,
    fields: [
      { name: "message", count: 1, duplicate: false, occurrences: [{ empty: false, length: 82 }] },
      { name: "sb", count: 1, duplicate: false, occurrences: [{ empty: true, length: 0 }] },
    ],
    parserResult: "received",
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

test("observation boundary retains structure but cannot forward callback values", () => {
  const secrets = [
    "synthetic-access-token-value",
    "synthetic-refresh-token-value",
    "synthetic-authorization-code",
    "synthetic-provider-message",
    "synthetic-secret-as-field-name",
  ];
  const fragment = `#access_token=${secrets[0]}&refresh_token=${secrets[1]}&code=${secrets[2]}&message=${secrets[3]}&synthetic-secret-as-field-name=value&type=email_change`;
  const inputs: Array<{ name: string; value: string }> = [];
  const form = { method: "", action: "", append(input: { name: string; value: string }) { inputs.push(input); }, submit() {} };
  vm.runInNewContext(EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT, {
    URLSearchParams,
    window: { location: { hash: fragment, pathname: "/auth/change-email/confirm", search: "?lang=nl" }, history: { replaceState() {} } },
    document: { createElement(name: string) { return name === "form" ? form : { type: "", name: "", value: "" }; }, body: { append() {} } },
  });

  const serializedTransport = JSON.stringify(inputs);
  for (const secret of secrets) assert.equal(serializedTransport.includes(secret), false);
  const submitted = Object.fromEntries(inputs.map(({ name, value }) => [name, value]));
  const observation = parseEmailChangeCallbackObservation(submitted.observation);
  assert.ok(observation);
  assert.equal(observation.parserResult, "invalid");
  assert.deepEqual(observation.fields.map((field: { name: string }) => field.name), [
    "access_token", "refresh_token", "code", "message", "__unknown__", "type",
  ]);
  assert.deepEqual(observation.fields.map((field: { occurrences: Array<{ length: number }> }) => field.occurrences[0].length), [
    28, 29, 28, 26, 5, 12,
  ]);
  assert.doesNotMatch(EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT, /console\.|localStorage|sessionStorage|indexedDB/);
});

test("observation reports duplicate structure without retaining duplicate values", () => {
  const inputs: Array<{ name: string; value: string }> = [];
  const form = { method: "", action: "", append(input: { name: string; value: string }) { inputs.push(input); }, submit() {} };
  vm.runInNewContext(EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT, {
    URLSearchParams,
    window: { location: { hash: "#message=first-secret&message=second-secret", pathname: "/auth/change-email/confirm", search: "" }, history: { replaceState() {} } },
    document: { createElement(name: string) { return name === "form" ? form : { type: "", name: "", value: "" }; }, body: { append() {} } },
  });
  const submitted = Object.fromEntries(inputs.map(({ name, value }) => [name, value]));
  const observation = JSON.parse(submitted.observation);
  assert.deepEqual(observation.fields, [{
    name: "message", count: 2, duplicate: true,
    occurrences: [{ empty: false, length: 12 }, { empty: false, length: 13 }],
  }]);
  assert.equal(JSON.stringify(inputs).includes("first-secret"), false);
  assert.equal(JSON.stringify(inputs).includes("second-secret"), false);
});

test("query observation never repeats callback values and masks unknown field names", () => {
  const url = new URL("https://fitlifetool.com/x?code=synthetic-code-secret&lang=nl&synthetic-secret-name=value");
  const observation = observeEmailChangeQuery(url, "invalid");
  const serialized = JSON.stringify(observation);
  assert.equal(serialized.includes("synthetic-code-secret"), false);
  assert.equal(serialized.includes("synthetic-secret-name"), false);
  assert.deepEqual(observation.fields.map((field: { name: string }) => field.name), ["code", "lang", "__unknown__"]);
  assert.equal(observation.totalLength, url.search.length - 1);
});

test("server accepts only bounded canonical structural observations", () => {
  const valid = {
    source: "fragment", totalLength: 24, fieldCount: 1, parserResult: "invalid",
    fields: [{ name: "access_token", count: 1, duplicate: false, occurrences: [{ empty: false, length: 10 }] }],
  };
  assert.deepEqual(parseEmailChangeCallbackObservation(JSON.stringify(valid)), valid);
  assert.equal(parseEmailChangeCallbackObservation(JSON.stringify({ ...valid, raw: "secret" })), null);
  assert.equal(parseEmailChangeCallbackObservation(JSON.stringify({ ...valid, fields: [{ ...valid.fields[0], name: "secret-value" }] })), null);
  assert.equal(parseEmailChangeCallbackObservation(JSON.stringify({ ...valid, fields: [{ ...valid.fields[0], occurrences: [{ empty: true, length: 10 }] }] })), null);
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
  assert.match(source,/X-FitLifeTool-AJ09-Callback-Observation/);
  assert.match(source,/<body><script nonce=/);
  assert.doesNotMatch(source,/destination\.searchParams\.set\("observation"/);
  assert.doesNotMatch(source,/exchangeCodeForSession|verifyOtp|setSession|console\.|localStorage|sessionStorage|searchParams\.set\("code"|searchParams\.set\("message"|rawFragment|rawPayload/);
});
