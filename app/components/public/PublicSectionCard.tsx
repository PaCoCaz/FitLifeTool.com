import type { ReactNode } from "react";

export default function PublicSectionCard({ children }: { children?: ReactNode }) {
  return (
    <div className="public-web-section-card">
      <div className="public-web-section-card-content">{children}</div>
    </div>
  );
}
