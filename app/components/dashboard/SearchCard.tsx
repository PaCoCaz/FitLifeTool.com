// app/components/dashboard/SearchCard.tsx

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import GradeBadge, {
  type Grade,
} from "@/components/ui/GradeBadge";
import Image from "next/image";
import { useLang } from "@/lib/useLang";
import { uiText } from "@/lib/uiText";

const GRADES: Grade[] = ["A", "B", "C", "D", "E"];

type Props = {
  title: string;
  search: string;
  setSearch: (value: string) => void;
  results: {
    product_key: string;
    name: string;
    is_basic: boolean;
    grade?: Grade | null;
  }[];
  onSelect: (key: string) => void;
  onToggleFavorite: (key: string) => void;
  features: {
    has_full_food_database: boolean;
  };
  favorites: {
    product_key: string;
  }[];
  filtersEnabled: boolean;
  filterPanelOpen: boolean;
  activeFilterCount: number;
  selectedGrades: Grade[];
  selectedCategoryKeys: string[];
  categoryOptions: {
    key: string;
    label: string;
  }[];
  hasSearched: boolean;
  onFilterClick: () => void;
  onToggleGrade: (grade: Grade) => void;
  onToggleCategory: (key: string) => void;
  onResetFilters: () => void;
};

export default function SearchCard({
  title,
  search,
  setSearch,
  results,
  onSelect,
  onToggleFavorite,
  features,
  favorites,
  filtersEnabled,
  filterPanelOpen,
  activeFilterCount,
  selectedGrades,
  selectedCategoryKeys,
  categoryOptions,
  hasSearched,
  onFilterClick,
  onToggleGrade,
  onToggleCategory,
  onResetFilters,
}: Props) {
  const langCode = useLang();
  const t = uiText[langCode];

  return (
    <Card header={<CardHeader icon="/search.svg" title={title} />}>
      {/* INPUT FULL WIDTH */}
      <div className="-mx-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.nutrition.searchProduct}
          className="
            w-full px-4 py-2
            border-t border-b border-[#DBE4F0]
            focus:outline-none
            focus:ring-0
          "
        />
      </div>

      <div className="-mx-4 border-b border-[#DBE4F0] px-4 py-2">
  <div className="flex flex-wrap items-center gap-2">
    <button
      type="button"
      onClick={onFilterClick}
      className={`
        app-action-button
        h-[40px]
        px-3
        py-0
        text-sm
        ${!filtersEnabled
          ? "app-action-button--locked"
          : filterPanelOpen
          ? "app-action-button--active"
          : ""
        }
      `}
    >
      <span>
        {t.common.filters}
        {activeFilterCount > 0
          ? ` (${activeFilterCount})`
          : ""}
      </span>

      {!filtersEnabled && (
        <Image
          src="/lock.svg"
          alt=""
          width={14}
          height={14}
        />
      )}
    </button>

    {activeFilterCount > 0 && (
      <button
        type="button"
        onClick={onResetFilters}
        className="
          text-sm
          font-medium
          text-[#191970]
          hover:text-[#0BA4E0]
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-[#0BA4E0]
        "
      >
        {t.common.resetFilters}
      </button>
    )}
  </div>

  {filterPanelOpen && filtersEnabled && (
    <div className="mt-3 space-y-3">

      {/* GRADES */}
      <div>
        <div className="mb-2 text-[14px] font-semibold tracking-wide text-[#64748B]">
          {t.common.grade}
        </div>

        <div className="flex flex-wrap gap-2">
          {GRADES.map((grade) => {
            const selected =
              selectedGrades.includes(grade);

            return (
              <button
                key={grade}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleGrade(grade)}
                className={`
                  inline-flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-md
                  border
                  p-0
                  transition-colors
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-[#0BA4E0]
                  ${
                    selected
                      ? "border-[#191970] bg-[#F3F4F6]"
                      : "border-[#DBE4F0] bg-white hover:border-[#0BA4E0] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                <GradeBadge
                  grade={grade}
                  size="xs"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* CATEGORIES */}
      {categoryOptions.length > 0 && (
        <div>
          <div className="mb-2 text-[14px] font-semibold tracking-wide text-[#64748B]">
            {t.common.category}
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const selected =
                selectedCategoryKeys.includes(
                  category.key
                );

              return (
                <button
                  key={category.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    onToggleCategory(category.key)
                  }
                  className={`
                    rounded-md
                    border
                    px-3
                    py-1.5
                    text-sm
                    transition-colors
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#0BA4E0]
                    ${
                      selected
                        ? "border-[#191970] bg-[#191970] text-white"
                        : "border-[#DBE4F0] bg-white text-[#191970] hover:border-[#0BA4E0] hover:bg-[#F8FAFC]"
                    }
                  `}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  )}
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
                <span className="min-w-0 flex-1 truncate pr-3">
                  {product.name}
                </span>

                <div className="flex items-center gap-2">
                  {/* LOCK */}
                  {isLocked ? (
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

                  {/* FAVORITE */}
                  {!isLocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product.product_key);
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

      {hasSearched && results.length === 0 && (
        <div className="-mx-4 px-4 py-4 text-sm text-[#64748B]">
          {t.common.noProductsForFilters}
        </div>
      )}
    </Card>
  );
}
