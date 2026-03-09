// app/(app)/dashboard/weight/layout.tsx

import { TimeProvider } from "@/lib/TimeProvider";

export default function WeightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimeProvider>
      {children}
    </TimeProvider>
  );
}