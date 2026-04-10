// app/components/dashboard/FavoritesCard.tsx

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Image from "next/image";

type Props = {
  title: string;
  items: {
    product_key: string;
    name: string;
  }[];
  onSelect: (key: string) => void;
  onToggleFavorite: (key: string) => void; // 🔥 nieuw
};

export default function FavoritesCard({
  title,
  items,
  onSelect,
  onToggleFavorite,
}: Props) {
  if (items.length === 0) return null;

  return (
    <Card
      header={<CardHeader icon="/heart.svg" title={title} />}
      headerSpacing="compact"
    >
      <div className="-mx-4">
        {items.map((product) => (
          <div
            key={product.product_key}
            onClick={() => onSelect(product.product_key)}
            className="
              w-full px-4 py-2
              flex items-center justify-between
              border-b border-[#DBE4F0]
              leading-tight
              cursor-pointer
              hover:bg-gray-50
            "
          >
            <span>{product.name}</span>

            <button
              onClick={(e) => {
                e.stopPropagation(); // 🔥 voorkomt navigatie
                onToggleFavorite(product.product_key);
              }}
              className="flex items-center"
            >
              <Image
                src="/favorite-active.svg"
                alt="Verwijder favoriet"
                width={18}
                height={18}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}