// app/components/dashboard/FavoritesCard.tsx

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import GradeBadge, {
  type Grade,
} from "@/components/ui/GradeBadge";
import Image from "next/image";

type Props = {
  title: string;
  items: {
    product_key: string;
    name: string;
    grade?: Grade | null;
    locked?: boolean;
  }[];
  limit: number | null;
  lockedMessage: string | null;
  onSelect: (key: string) => void;
  onLockedSelect: () => void;
  onToggleFavorite: (key: string) => void;
};

export function FavoritesCardSkeleton({
  title,
}: {
  title: string;
}) {
  return (
    <Card
      header={<CardHeader icon="/heart.svg" title={title} />}
      headerSpacing="compact"
    >
      <div
        className="-mx-4"
        aria-hidden="true"
      >
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="
              w-full px-4 py-2
              flex items-center justify-between
              border-b border-[#DBE4F0]
              leading-tight
            "
          >
            <div
              className={`
                h-4 rounded bg-[#DBE4F0] animate-pulse
                ${row === 1 ? "w-2/5" : "w-3/5"}
              `}
            />

            <div className="flex items-center gap-2">
              <div className="h-[18px] w-[18px] rounded-full bg-[#DBE4F0] animate-pulse" />
              <div className="h-[18px] w-[18px] rounded bg-[#DBE4F0] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function FavoritesCard({
  title,
  items,
  lockedMessage,
  onSelect,
  onLockedSelect,
  onToggleFavorite,
}: Props) {
  if (items.length === 0) return null;

  return (
    <Card
      header={<CardHeader icon="/heart.svg" title={title} />}
      headerSpacing="compact"
    >
      {lockedMessage && (
        <div className="mb-3 text-sm text-gray-600">
          {lockedMessage}
        </div>
      )}

      <div className="-mx-4">
        {items.map((product) => (
          <div
            key={product.product_key}
            onClick={() => {
              if (product.locked) {
                onLockedSelect();
                return;
              }

              onSelect(product.product_key);
            }}
            className={`
              w-full px-4 py-2
              flex items-center justify-between
              border-b border-[#DBE4F0]
              leading-tight
              cursor-pointer
              ${
                product.locked
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }
            `}
          >
            <span className="min-w-0 flex-1 truncate pr-3">
              {product.name}
            </span>

            <div className="flex items-center gap-2">
              {product.locked ? (
                <Image
                  src="/lock.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              ) : product.grade ? (
                <GradeBadge
                  grade={product.grade}
                  size="xs"
                />
              ) : null}

              <button
                onClick={(e) => {
                  e.stopPropagation();
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
          </div>
        ))}
      </div>
    </Card>
  );
}
