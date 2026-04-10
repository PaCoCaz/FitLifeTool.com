// app/components/ui/CardHeader.tsx

import Image from "next/image";

type Props = {
  icon?: string;
  title: string;
  score?: number;
  scoreLabel?: string;
  scoreColor?: string;
  rightContent?: React.ReactNode;
};

export default function CardHeader({
  icon,
  title,
  score,
  scoreLabel,
  scoreColor = "bg-gray-200 text-black",
  rightContent,
}: Props) {
  const scoreClasses =
    "rounded-[var(--radius)] px-3 py-1 text-xs font-semibold whitespace-nowrap";

  return (
    <div className="bg-[#B8CAE0] py-2 px-3 flex items-center rounded-t-[var(--radius)] min-h-[36px]">

      {/* Left */}
      <div className="flex items-center gap-2 text-[#191970] font-semibold truncate">
        {icon && (
          <Image src={icon} alt="" width={16} height={16} />
        )}
        <span className="truncate">{title}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right */}
      {rightContent ? (
        rightContent
      ) : score !== undefined ? (
        <div className={`${scoreClasses} ${scoreColor}`}>
          {scoreLabel ? `${scoreLabel} ` : ""}
          {score} / 100
        </div>
      ) : null}

    </div>
  );
}