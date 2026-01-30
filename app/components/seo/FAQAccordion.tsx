// app/components/seo/FAQAccordion.tsx

"use client";

import Accordion from "@/components/ui/Accordion";

type Item = {
  question: string;
  answer: string;
};

export default function FAQAccordion({ items }: { items: Item[] }) {
  return <Accordion items={items} />;
}
