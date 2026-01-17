// app/handbook/documentLayout.tsx

import { ReactNode } from "react";
import DocumentPager from "./documentPager";

type Props = {
  children: ReactNode;
};

export default function DocumentLayout({ children }: Props) {
  return (
    <div className="handbook max-w-4xl">
      <article className="handbook-article">
        {children}
      </article>

      {/* ───────────────── Navigatie ───────────────── */}
      <DocumentPager />
    </div>
  );
}
