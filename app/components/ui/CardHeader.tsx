// app/components/ui/CardHeader.tsx

import Image from "next/image";

type Props = {
  icon: string;
  title: string;
  score?: number;
  scoreLabel?: string; // optioneel, default "FitLifeScore"
  scoreColor?: string; // bijv. nutritionStatus.color
  rightContent?: React.ReactNode; // override (bijv. tijd bij FitLifeScore)
};

export default function CardHeader({
  icon,
  title,
  score,
  scoreLabel = "FitLifeScore",
  scoreColor,
  rightContent,
}: Props) {
  return (
    <div className="bg-[#B8CAE0] py-2 px-3 flex items-center rounded-t-[var(--radius)]">

      {/* Left */}
      <span className="font-semibold text-[#191970] flex items-center gap-2">
        <Image src={icon} alt="" width={16} height={16} />
        {title}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right */}
      {rightContent ? (
        rightContent
      ) : score !== undefined ? (
        <div
          className={`
            rounded-[var(--radius)]
            px-3 py-1
            text-xs
            font-semibold
            whitespace-nowrap
            ${scoreColor}
          `}
        >
          {scoreLabel} {score} / 100
        </div>
      ) : null}

    </div>
  );
}