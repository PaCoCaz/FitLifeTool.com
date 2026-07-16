// app/components/ui/GradeBadge.tsx

export type Grade =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E";

type Props = {
  grade: Grade;
  size?: "xs" | "sm" | "md";
  className?: string;
};

const gradeStyles: Record<Grade, string> = {
  A: "bg-green-600 text-white",
  B: "bg-green-200 text-green-800",
  C: "bg-yellow-300 text-[#191970]",
  D: "bg-orange-500 text-white",
  E: "bg-[#C80000] text-white",
};

const sizes = {
  xs: "h-[16px] w-[16px] text-[10px]",
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
};

export default function GradeBadge({
  grade,
  size = "sm",
  className = "",
}: Props) {
  return (
    <span
      className={`
        ${sizes[size]}
        ${gradeStyles[grade]}
        inline-flex
        shrink-0
        items-center
        justify-center
        rounded-full
        font-bold
        leading-none
        ${className}
      `}
      aria-label={`Productscore ${grade}`}
      title={`Productscore ${grade}`}
    >
      {grade}
    </span>
  );
}