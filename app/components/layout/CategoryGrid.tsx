// app/(app)/components/layout/CategoryGrid.tsx

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CategoryGrid({ children }: Props) {
  return (
    <section className="grid grid-cols-12 auto-rows-auto gap-4 items-start">
      {children}
    </section>
  );
}
