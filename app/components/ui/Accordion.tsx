// app/components/ui/Accordion.tsx

"use client";

import { useState } from "react";

type Item = {
  question: string;
  answer: string;
};

export default function Accordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-accordion">
      {items.map((item, index) => (
        <div key={index} className="faq-item">
          <button
            className="faq-question"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            {item.question}
            <span className={`faq-icon ${openIndex === index ? "open" : ""}`}>
              +
            </span>
          </button>

          <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
