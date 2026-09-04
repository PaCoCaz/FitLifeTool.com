export const SESSION_EVENT_CHANNEL = "fitlifetool-auth-lifecycle-v1";
export const SESSION_EVENT_STORAGE_KEY = "__flt_auth_lifecycle_event";

export type ClientSessionEvent = {
  version: 1;
  type: "logout" | "session_expired";
  sender: string;
};

type LifecycleChannel = {
  postMessage(value: ClientSessionEvent): void;
  addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  removeEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  close(): void;
};

export type ClientSessionLifecycleEnvironment = {
  createBroadcastChannel: ((name: string) => LifecycleChannel) | null;
  subscribeStorage: ((listener: (event: { key: string | null; newValue: string | null }) => void) => () => void) | null;
  publishStorage: ((key: string, value: string) => void) | null;
};

export function parseClientSessionEvent(value: unknown): ClientSessionEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const event = value as Record<string, unknown>;
  return Object.keys(event).sort().join(",") === "sender,type,version" &&
    event.version === 1 && (event.type === "logout" || event.type === "session_expired") &&
    typeof event.sender === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(event.sender)
    ? { version: 1, type: event.type, sender: event.sender }
    : null;
}

export function classifyAuthResponse(status: number, body: unknown) {
  const code = body && typeof body === "object" && "code" in body
    ? (body as { code?: unknown }).code : null;
  if (code === "SESSION_EXPIRED") return "session_expired" as const;
  if (code === "AUTHENTICATION_REQUIRED") return "authentication_required" as const;
  if (code === "AUTH_STATE_UNAVAILABLE") return "unavailable" as const;
  return status >= 500 ? "unavailable" as const : "none" as const;
}

export function getClientAuthRecovery(status: number, body: unknown, language: string) {
  const classification = classifyAuthResponse(status, body);
  if (classification === "authentication_required") {
    return { kind: "navigate" as const, event: null, destination: `/login?lang=${language}` };
  }
  if (classification !== "session_expired") return { kind: classification } as const;
  const destination = body && typeof body === "object" && "destination" in body
    ? (body as { destination?: unknown }).destination : null;
  if (typeof destination !== "string") return { kind: "unavailable" as const };
  const url = new URL(destination, "https://fitlifetool.invalid");
  if (url.origin !== "https://fitlifetool.invalid" || url.pathname !== "/login" ||
      url.hash || url.searchParams.get("auth_notice") !== "session_expired" ||
      !["en", "nl", "fr", "de", "pl"].includes(url.searchParams.get("lang") ?? "") ||
      [...url.searchParams.keys()].some((key) => !["lang", "auth_notice", "returnTo"].includes(key))) {
    return { kind: "unavailable" as const };
  }
  return { kind: "navigate" as const, event: "session_expired" as const, destination };
}

function createBrowserEnvironment(): ClientSessionLifecycleEnvironment {
  return {
    createBroadcastChannel: typeof BroadcastChannel === "undefined"
      ? null
      : (name) => new BroadcastChannel(name),
    subscribeStorage: typeof window === "undefined"
      ? null
      : (listener) => {
          const handler = (event: StorageEvent) => listener(event);
          window.addEventListener("storage", handler);
          return () => window.removeEventListener("storage", handler);
        },
    publishStorage: typeof window === "undefined"
      ? null
      : (key, value) => {
          localStorage.setItem(key, value);
          localStorage.removeItem(key);
        },
  };
}

function createEphemeralSenderId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Fall through to a browser-memory-only random value.
  }
  return `tab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

export function createClientSessionLifecycle(
  sender = createEphemeralSenderId(),
  environment = createBrowserEnvironment()
) {
  let channel: LifecycleChannel | null = null;
  let usesStorageFallback = false;

  const notify = (type: ClientSessionEvent["type"]) => {
    const payload: ClientSessionEvent = { version: 1, type, sender };
    if (channel) {
      try {
        channel.postMessage(payload);
        return;
      } catch {
        try { channel.close(); } catch { /* best effort */ }
        channel = null;
      }
    }

    if (!usesStorageFallback && environment.createBroadcastChannel) {
      let publisher: LifecycleChannel | null = null;
      try {
        publisher = environment.createBroadcastChannel(SESSION_EVENT_CHANNEL);
        publisher.postMessage(payload);
        publisher.close();
        return;
      } catch {
        try { publisher?.close(); } catch { /* best effort */ }
      }
    }

    try {
      environment.publishStorage?.(SESSION_EVENT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Cross-tab delivery is best effort and never blocks local recovery.
    }
  };

  const subscribe = (listener: (event: ClientSessionEvent) => void) => {
    let active = true;
    let removeStorage: (() => void) | null = null;
    const deliver = (value: unknown) => {
      const event = parseClientSessionEvent(value);
      if (active && event && event.sender !== sender) listener(event);
    };
    const onMessage = (event: MessageEvent) => deliver(event.data);

    if (environment.createBroadcastChannel) {
      try {
        channel = environment.createBroadcastChannel(SESSION_EVENT_CHANNEL);
        channel.addEventListener("message", onMessage);
      } catch {
        try { channel?.close(); } catch { /* best effort */ }
        channel = null;
      }
    }

    if (!channel && environment.subscribeStorage) {
      try {
        removeStorage = environment.subscribeStorage((event) => {
          if (event.key !== SESSION_EVENT_STORAGE_KEY || !event.newValue) return;
          try { deliver(JSON.parse(event.newValue)); } catch { /* ignore malformed payload */ }
        });
        usesStorageFallback = true;
      } catch {
        removeStorage = null;
        usesStorageFallback = false;
      }
    }

    return () => {
      if (!active) return;
      active = false;
      try { channel?.removeEventListener("message", onMessage); } catch { /* best effort */ }
      try { channel?.close(); } catch { /* best effort */ }
      channel = null;
      try { removeStorage?.(); } catch { /* best effort */ }
      removeStorage = null;
      usesStorageFallback = false;
    };
  };

  return { notify, subscribe };
}

let defaultLifecycle: ReturnType<typeof createClientSessionLifecycle> | null = null;
const getDefaultLifecycle = () => defaultLifecycle ??= createClientSessionLifecycle();

export function notifyClientSessionEvent(type: ClientSessionEvent["type"]) {
  getDefaultLifecycle().notify(type);
}

export function subscribeToClientSessionEvents(listener: (event: ClientSessionEvent) => void) {
  try {
    return getDefaultLifecycle().subscribe(listener);
  } catch {
    return () => undefined;
  }
}
