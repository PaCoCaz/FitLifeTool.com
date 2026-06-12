// app/components/ui/CardHeader.tsx

import Image from "next/image";

type Props = {
  icon?: string;
  action?: React.ReactNode;
  title: string;
  score?: string | number;
  grade?: string;
  scoreLabel?: string;
  scoreColor?: string;
  rightContent?: React.ReactNode;
  as?: "h2" | "h3" | "div";
};

function getGradeStyles(grade: string) {
  switch (grade) {
    case "A":
      return {
        badgeBg: "#FFFFFF",
        badgeText: "#16A34A",
      };

    case "B":
      return {
        badgeBg: "#1B5E20",
        badgeText: "#C8E6C9",
      };

    case "C":
      return {
        badgeBg: "#191970",
        badgeText: "#FFF200",
      };

    case "D":
      return {
        badgeBg: "#FFFFFF",
        badgeText: "#F97316",
      };

    case "E":
      return {
        badgeBg: "#FFFFFF",
        badgeText: "#C80000",
      };

    default:
      return {
        badgeBg: "#FFFFFF",
        badgeText: "#000000",
      };
  }
}

export default function CardHeader({
  icon,
  title,
  score,
  grade,
  scoreLabel,
  scoreColor = "bg-gray-200 text-black",
  rightContent,
  as,
}: Props) {
  const Tag = as ?? "div";

  const scoreClasses =
    "rounded-[var(--radius)] px-3 py-1 text-xs font-semibold whitespace-nowrap";

  const gradeStyles = grade ? getGradeStyles(grade) : null;

  return (
    <div className="bg-[#B8CAE0] py-2 px-3 flex items-center rounded-t-[var(--radius)] min-h-[36px]">

      {/* Left */}
      <div className="flex items-center gap-2 text-[#191970] truncate">
        {icon && (
          <Image
            src={icon}
            alt=""
            width={16}
            height={16}
            className="block"
          />
        )}

        <Tag className="m-0 leading-none contents">
          <span className="truncate text-[14px] sm:text-base font-semibold text-[#191970]">
            {title}
          </span>
        </Tag>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right */}
      {rightContent ? (
        rightContent
      ) : score !== undefined ? (
        <div className={`${scoreClasses} ${scoreColor} flex items-center gap-2`}>
          <span>
            {scoreLabel && (
              <span className="mr-2">
                {scoreLabel}
              </span>
            )}

            {score} / 100
          </span>

          {grade && gradeStyles && (
            <div
              className="
                ml-1
                h-4
                w-4
                rounded-full
                flex
                items-center
                justify-center
                text-[10px]
                font-bold
                leading-none
              "
              style={{
                backgroundColor: gradeStyles.badgeBg,
                color: gradeStyles.badgeText,
              }}
            >
              {grade}
            </div>
          )}
        </div>
      ) : null}

    </div>
  );
}