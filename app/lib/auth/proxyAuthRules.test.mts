import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  isOnboardingRoute,
  isProtectedAppRoute,
  skipsProxyAuth,
} from "./proxyAuthRules.ts";

const projectRoot = new URL("../../../", import.meta.url);
const favoritesRouteSource = await readFile(
  new URL("app/api/favorites/route.ts", projectRoot),
  "utf8"
);
const favoritesServerSource = await readFile(
  new URL("app/lib/favorites/favoritesServer.ts", projectRoot),
  "utf8"
);

function routeHandlerSource(
  method: "GET" | "POST" | "DELETE"
) {
  const startMarker = `export async function ${method}`;
  const start = favoritesRouteSource.indexOf(startMarker);
  const nextHandler = favoritesRouteSource.indexOf(
    "export async function ",
    start + startMarker.length
  );

  assert.notEqual(start, -1, `${method} handler ontbreekt`);

  return favoritesRouteSource.slice(
    start,
    nextHandler === -1
      ? favoritesRouteSource.length
      : nextHandler
  );
}

test("alleen exact /api/favorites slaat proxy-auth over", () => {
  assert.equal(skipsProxyAuth("/api/favorites"), true);

  for (const pathname of [
    "/api/favorites/",
    "/api/favorites/access",
    "/api/favorites-extra",
    "/api/profile/subscription",
    "/dashboard",
    "/settings",
    "/handbook",
  ]) {
    assert.equal(
      skipsProxyAuth(pathname),
      false,
      `${pathname} mag proxy-auth niet overslaan`
    );
  }
});

test("queryparameters veranderen de exacte pathname-uitsluiting niet", () => {
  const url = new URL(
    "/api/favorites?type=food&lang=nl&goal=LOSE",
    "http://localhost"
  );

  assert.equal(url.pathname, "/api/favorites");
  assert.equal(skipsProxyAuth(url.pathname), true);
});

test("protected en onboarding routes blijven expliciet onderscheiden", () => {
  assert.equal(isProtectedAppRoute("/dashboard"), true);
  assert.equal(isProtectedAppRoute("/settings/profile"), true);
  assert.equal(isProtectedAppRoute("/handbook"), true);
  assert.equal(isProtectedAppRoute("/onboarding"), false);
  assert.equal(isOnboardingRoute("/onboarding"), true);
  assert.equal(isOnboardingRoute("/onboarding/step"), true);
  assert.equal(isOnboardingRoute("/dashboard"), false);
  assert.equal(isOnboardingRoute("/auth/confirm"), false);
});

test("GET en mutaties behouden route-level auth en 401", () => {
  for (const method of ["GET", "POST", "DELETE"] as const) {
    const source = routeHandlerSource(method);

    assert.match(source, /const user = await getRequestUser\(\)/);
    assert.match(source, /if \(!user\)/);
    assert.match(source, /status: 401/);
  }

  assert.match(
    favoritesRouteSource,
    /supabaseUser\.auth\.getUser\(\)/
  );
});

test("ingelogde handlers en entitlementketen blijven aangesloten", () => {
  assert.match(routeHandlerSource("GET"), /listFavoriteDetails\(/);
  assert.match(routeHandlerSource("POST"), /addFavorite\(/);
  assert.match(routeHandlerSource("DELETE"), /removeFavorite\(/);
  assert.match(
    favoritesServerSource,
    /\.rpc\(\s*"get_user_plan_features"/
  );
  assert.match(
    favoritesServerSource,
    /Promise\.all\(\[\s*getFavoriteLimit\([\s\S]*loadFavoriteRows\(/
  );
});
