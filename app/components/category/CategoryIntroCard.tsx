// app/components/category/CategoryIntroCard.tsx

import React from "react";

type Props = {
  categoryLabel: string;
  title: string;
  description: string;
};

export default function CategoryIntroCard({
  categoryLabel,
  title,
  description,
}: Props) {
  return (
    <section className="category-card category-intro-card">
      <div className="category-label">{categoryLabel}</div>

      <header>
        <h1>{title}</h1>
      </header>

      <p>{description}</p>
    </section>
  );
}
