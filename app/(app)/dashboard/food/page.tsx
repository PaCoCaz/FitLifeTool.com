//  app/(app)/dashboard/food/page.tsx

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/dashboard/food/search");
}