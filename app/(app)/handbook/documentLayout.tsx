// app/handbook/documentLayout.tsx

import { ReactNode } from "react";
import DocumentPager from "./documentPager";

type Props = {
  children: ReactNode;
};

export default function DocumentLayout({ children }: Props) {
  return (
    <div className="handbook space-y-12 max-w-4xl">
      <article>
        {children}
      </article>

      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
    </div>
  );
}
