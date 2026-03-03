// app/(app)/dashboard/Providers.tsx

"use client";

import { LangProvider } from "@/lib/LangProvider";
import { GoalProvider } from "@/lib/GoalProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LangProvider>
      <GoalProvider>
        {children}
      </GoalProvider>
    </LangProvider>
  );
}