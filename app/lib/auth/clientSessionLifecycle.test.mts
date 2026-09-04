import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyAuthResponse,
  createClientSessionLifecycle,
  getClientAuthRecovery,
  parseClientSessionEvent,
  SESSION_EVENT_CHANNEL,
  SESSION_EVENT_STORAGE_KEY,
  type ClientSessionEvent,
  type ClientSessionLifecycleEnvironment,
} from "./clientSessionLifecycle.ts";

type MessageListener = (event: MessageEvent) => void;
type StorageListener = (event: { key: string | null; newValue: string | null }) => void;

function transportBus(options: { broadcastFails?: boolean; registrationFails?: boolean } = {}) {
  const channelListeners = new Set<MessageListener>();
  const storageListeners = new Set<StorageListener>();
  const published: ClientSessionEvent[] = [];
  let storageSubscriptions = 0;

  const environment: ClientSessionLifecycleEnvironment = {
    createBroadcastChannel: (name) => {
      assert.equal(name, SESSION_EVENT_CHANNEL);
      if (options.broadcastFails) throw new Error("broadcast blocked");
      return {
        postMessage(value) {
          published.push(value);
          for (const listener of channelListeners) listener({ data: value } as MessageEvent);
        },
        addEventListener(_type, listener) {
          if (options.registrationFails) throw new Error("registration blocked");
          channelListeners.add(listener);
        },
        removeEventListener(_type, listener) { channelListeners.delete(listener); },
        close() {},
      };
    },
    subscribeStorage(listener) {
      storageSubscriptions += 1;
      storageListeners.add(listener);
      return () => storageListeners.delete(listener);
    },
    publishStorage(key, value) {
      for (const listener of storageListeners) listener({ key, newValue: value });
    },
  };

  return {
    environment,
    published,
    storageSubscriptions: () => storageSubscriptions,
    emitRaw(value: unknown) {
      for (const listener of channelListeners) listener({ data: value } as MessageEvent);
    },
  };
}

test("only fixed non-sensitive lifecycle events are accepted", () => {
  assert.deepEqual(parseClientSessionEvent({ version: 1, type: "logout", sender: "tab_a" }), { version: 1, type: "logout", sender: "tab_a" });
  assert.deepEqual(parseClientSessionEvent({ version: 1, type: "session_expired", sender: "tab_b" }), { version: 1, type: "session_expired", sender: "tab_b" });
  assert.equal(parseClientSessionEvent({ version: 1, type: "logout", sender: "tab_a", userId: "secret" }), null);
  assert.equal(parseClientSessionEvent({ version: 2, type: "logout", sender: "tab_a" }), null);
  assert.equal(parseClientSessionEvent({ version: 1, type: "logout", sender: "invalid sender" }), null);
});

test("auth response classification never maps arbitrary failures to expiry", () => {
  assert.equal(classifyAuthResponse(401, { code: "SESSION_EXPIRED" }), "session_expired");
  assert.equal(classifyAuthResponse(401, { code: "AUTHENTICATION_REQUIRED" }), "authentication_required");
  assert.equal(classifyAuthResponse(503, { code: "AUTH_STATE_UNAVAILABLE" }), "unavailable");
  assert.equal(classifyAuthResponse(401, { error: "unknown" }), "none");
  assert.equal(classifyAuthResponse(403, { code: "BUSINESS" }), "none");
  assert.equal(classifyAuthResponse(409, { code: "BUSINESS" }), "none");
  assert.equal(classifyAuthResponse(422, { code: "BUSINESS" }), "none");
});

test("client accepts only canonical recovery destinations", () => {
  assert.deepEqual(getClientAuthRecovery(401, { code: "AUTHENTICATION_REQUIRED" }, "nl"), { kind: "navigate", event: null, destination: "/login?lang=nl" });
  assert.equal(getClientAuthRecovery(401, { code: "SESSION_EXPIRED", destination: "https://evil.test" }, "en").kind, "unavailable");
  assert.deepEqual(getClientAuthRecovery(401, { code: "SESSION_EXPIRED", destination: "/login?lang=fr&auth_notice=session_expired" }, "fr"), { kind: "navigate", event: "session_expired", destination: "/login?lang=fr&auth_notice=session_expired" });
});

test("the sending tab suppresses its own logout and expiry events", () => {
  const bus = transportBus();
  const tab = createClientSessionLifecycle("tab_a", bus.environment);
  const received: ClientSessionEvent[] = [];
  const unsubscribe = tab.subscribe((event) => received.push(event));

  tab.notify("logout");
  tab.notify("session_expired");

  assert.deepEqual(received, []);
  assert.deepEqual(bus.published, [
    { version: 1, type: "logout", sender: "tab_a" },
    { version: 1, type: "session_expired", sender: "tab_a" },
  ]);
  for (const payload of bus.published) {
    assert.deepEqual(Object.keys(payload).sort(), ["sender", "type", "version"]);
    assert.doesNotMatch(payload.sender, /user|email|token|session|role|profile/i);
  }
  unsubscribe();
  unsubscribe();
});

test("a genuine second tab receives valid events exactly once", () => {
  const bus = transportBus();
  const tabA = createClientSessionLifecycle("tab_a", bus.environment);
  const tabB = createClientSessionLifecycle("tab_b", bus.environment);
  const receivedA: ClientSessionEvent[] = [];
  const receivedB: ClientSessionEvent[] = [];
  const stopA = tabA.subscribe((event) => receivedA.push(event));
  const stopB = tabB.subscribe((event) => receivedB.push(event));

  tabA.notify("logout");
  bus.emitRaw({ version: 2, type: "logout", sender: "attacker" });
  bus.emitRaw({ version: 1, type: "unknown", sender: "attacker" });

  assert.deepEqual(receivedA, []);
  assert.deepEqual(receivedB, [{ version: 1, type: "logout", sender: "tab_a" }]);
  stopA();
  stopB();
});

test("BroadcastChannel setup failure falls back to storage safely", () => {
  for (const options of [{ broadcastFails: true }, { registrationFails: true }]) {
    const bus = transportBus(options);
    const tabA = createClientSessionLifecycle("tab_a", bus.environment);
    const tabB = createClientSessionLifecycle("tab_b", bus.environment);
    const received: ClientSessionEvent[] = [];
    const stopA = tabA.subscribe(() => assert.fail("same-tab event"));
    const stopB = tabB.subscribe((event) => received.push(event));
    assert.equal(bus.storageSubscriptions(), 2);
    assert.doesNotThrow(() => tabA.notify("session_expired"));
    assert.deepEqual(received, [{ version: 1, type: "session_expired", sender: "tab_a" }]);
    stopA();
    stopB();
  }
});

test("storage failure degrades to an idempotent no-op subscription", () => {
  const environment: ClientSessionLifecycleEnvironment = {
    createBroadcastChannel: null,
    subscribeStorage() { throw new Error("storage listener blocked"); },
    publishStorage() { throw new Error("storage write blocked"); },
  };
  const lifecycle = createClientSessionLifecycle("tab_a", environment);
  let called = 0;
  let unsubscribe = () => undefined;
  assert.doesNotThrow(() => { unsubscribe = lifecycle.subscribe(() => { called += 1; }); });
  assert.doesNotThrow(() => lifecycle.notify("logout"));
  assert.doesNotThrow(unsubscribe);
  assert.doesNotThrow(unsubscribe);
  assert.equal(called, 0);
  assert.equal(SESSION_EVENT_STORAGE_KEY, "__flt_auth_lifecycle_event");
});
