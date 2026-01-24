// app/(public)/(categories)/layout.tsx

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CategoryLayout({ children }: Props) {
  return (
    <article
      className="
        handbook
        handbook-public
        bg-white
        rounded-[var(--radius)]
        shadow-sm
        p-6
        space-y-6
      "
    >
      {children}
    </article>
  );
}
