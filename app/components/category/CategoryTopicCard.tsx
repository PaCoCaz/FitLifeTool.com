// app/components/category/CategoryTopicCard.tsx

import React from "react";

type Props = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

export default function CategoryTopicCard({
  title,
  description,
  imageSrc,
  imageAlt,
  href,
}: Props) {
  return (
    <section className="category-card">
      <div className="category-card-content">
        
        {/* Tekstkolom */}
        <div className="category-card-text">
          <h2>{title}</h2>

          <p>{description}</p>

          <a href={href} className="category-card-link">
            <span>Lees meer</span>
            <img
                src="/arrow_right_circle.svg"
                alt=""
                className="category-card-icon"
                aria-hidden="true"
            />
          </a>

        </div>

        {/* Afbeelding */}
        <div className="category-card-image">
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}
