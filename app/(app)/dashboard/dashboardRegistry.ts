// app/(app)/dashboard/dashboardRegistry.ts

export const dashboardRoutes = [
    {
      path: "/dashboard",
      label: "Dashboard",
    },
  
    {
      path: "/dashboard/drink/search",
      label: "Search",
      parent: "/dashboard",
      parentLabel: "Drink",
    },
  
    {
      path: "/dashboard/food/search",
      label: "Search",
      parent: "/dashboard",
      parentLabel: "Food",
    },
  
    {
      path: "/dashboard/activity",
      label: "Activity",
      parent: "/dashboard",
    },
  
    {
      path: "/dashboard/weight",
      label: "Weight",
      parent: "/dashboard",
    },
  ];