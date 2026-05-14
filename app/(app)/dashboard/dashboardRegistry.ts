// app/(app)/dashboard/dashboardRegistry.ts

type RouteConfig = {
  labelKey: string;
  parent?: string;
};

function normalizePath(path: string) {
  if (path.includes("/add/")) {
    return path.split("/add/")[0] + "/add";
  }
  return path;
}

export const dashboardRouteMap: Record<string, RouteConfig> = {
  "/dashboard": {
    labelKey: "nav.dashboard",
  },

  "/dashboard/hydration": {
    labelKey: "nav.hydration",
    parent: "/dashboard",
  },

  "/dashboard/drink": {
    labelKey: "nav.drink",
    parent: "/dashboard",
  },

  "/dashboard/drink/search": {
    labelKey: "common.search",
    parent: "/dashboard/drink",
  },

  "/dashboard/drink/add": {
    labelKey: "nav.drink",
    parent: "/dashboard/drink",
  },

  "/dashboard/food": {
    labelKey: "nav.nutrition",
    parent: "/dashboard",
  },

  "/dashboard/food/search": {
    labelKey: "common.search",
    parent: "/dashboard/food",
  },

  "/dashboard/food/add": {
    labelKey: "nav.nutrition",
    parent: "/dashboard/food",
  },

  "/dashboard/activity": {
    labelKey: "nav.activity",
    parent: "/dashboard",
  },

  "/dashboard/weight": {
    labelKey: "nav.weight",
    parent: "/dashboard",
  },
};

export function resolveLabel(t: any, key: string) {
  const value = key
    .split(".")
    .reduce((obj, k) => obj?.[k], t);

  return value ?? key; // fallback = key tonen
}

export function buildBreadcrumbs(path: string, t: any) {
  const crumbs: {
    path: string;
    label: string;
  }[] = [];

  let current: string | undefined = path;

  while (current) {
    const normalized = normalizePath(current);

    const route: RouteConfig | undefined =
      dashboardRouteMap[normalized];

    if (!route) break;

    crumbs.unshift({
      path: current,
      label: resolveLabel(t, route.labelKey),
    });

    current = route.parent;
  }

  return crumbs;
}