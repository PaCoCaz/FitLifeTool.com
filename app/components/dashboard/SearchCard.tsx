// app/components/dashboard/SearchCard.tsx

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Image from "next/image";

type Props = {
  title: string;
  search: string;
  setSearch: (value: string) => void;
  results: {
    product_key: string;
    name: string;
    is_basic: boolean;
  }[];
  onSelect: (key: string) => void;
  onToggleFavorite: (key: string) => void; // ✅ NIEUW
  features: {
    has_full_food_database: boolean;
  };
  favorites: {
    product_key: string;
  }[];
};

export default function SearchCard({
  title,
  search,
  setSearch,
  results,
  onSelect,
  onToggleFavorite, // ✅ NIEUW
  features,
  favorites,
}: Props) {
  return (
    <Card header={<CardHeader icon="/search.svg" title={title} />}>

      {/* INPUT FULL WIDTH */}
      <div className="-mx-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek product..."
          className="
            w-full px-4 py-2
            border-t border-b border-[#DBE4F0]
            focus:outline-none
            focus:ring-0
          "
        />
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="-mx-4 max-h-[400px] overflow-y-auto">
          {results.map((product) => {
            const isLocked =
              !features.has_full_food_database &&
              !product.is_basic;

            const isFavorite = favorites.some(
              (f) => f.product_key === product.product_key
            );

            return (
              <div
                key={product.product_key}
                onClick={() => {
                  if (!isLocked) onSelect(product.product_key);
                }}
                className={`
                  w-full text-left px-4 py-2
                  flex items-center justify-between
                  border-b border-[#DBE4F0]
                  leading-tight
                  ${isLocked
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <span>{product.name}</span>

                <div className="flex items-center gap-3">

                  {/* LOCK */}
                  {isLocked && (
                    <Image
                      src="/lock.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  )}

                  {/* FAVORITE */}
                  {!isLocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ voorkomt row click
                        onToggleFavorite(product.product_key); // ✅ toggle
                      }}
                      className="flex items-center"
                    >
                      <Image
                        src={
                          isFavorite
                            ? "/favorite-active.svg"
                            : "/favorite-not-active.svg"
                        }
                        alt=""
                        width={18}
                        height={18}
                      />
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </Card>
  );
}