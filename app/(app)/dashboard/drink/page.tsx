//  app/(app)/dashboard/drink/page.tsx

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/dashboard/drink/search");
}