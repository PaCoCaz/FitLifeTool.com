// app/components/ui/Card.tsx

type Props = {
  title?: string
  children?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
  header?: React.ReactNode // 👈 NIEUW
}

export default function Card({ title, children, action, icon, header }: Props) {
  return (
    <div className="h-full rounded-[var(--radius)] bg-white p-4 shadow-sm flex flex-col overflow-hidden">

      {/* Custom Header (override) */}
      {header ? (
        <div className="-mt-4 -mx-4 mb-3">
          {header}
        </div>
      ) : (
        title && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && <span className="shrink-0">{icon}</span>}
              <h3 className="text-sm font-semibold text-[#191970]">
                {title}
              </h3>
            </div>

            {action && (
              <div className="text-sm font-semibold text-[#0095D3]">
                {action}
              </div>
            )}
          </div>
        )
      )}

      {/* Content */}
      <div className="flex-1">
        {children ?? (
          <div className="h-full rounded-[var(--radius)] bg-gray-50" />
        )}
      </div>

    </div>
  )
}