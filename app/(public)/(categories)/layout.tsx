// app/(public)/(categories)/layout.tsx

import "@/styles/category.css";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}
