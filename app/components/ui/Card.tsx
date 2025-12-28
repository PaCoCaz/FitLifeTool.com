type Props = {
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
}

export default function Card({ title, children, action, icon }: Props) {
  return (
    <div className="h-full rounded-[var(--radius)] bg-white p-4 shadow-sm flex flex-col">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="shrink-0">
              {icon}
            </span>
          )}
          <h3 className="text-sm font-semibold text-gray-700">
            {title}
          </h3>
        </div>

        {action && (
          <div className="text-sm font-semibold text-[#0095D3]">
            {action}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {children ?? (
          <div className="h-full rounded-[var(--radius)] bg-gray-50" />
        )}
      </div>

    </div>
  );
}
