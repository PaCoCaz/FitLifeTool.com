import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CategoryLayout({ children }: Props) {
  return <div className="public-content">{children}</div>;
}
