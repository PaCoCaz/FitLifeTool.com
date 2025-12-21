type Props = {
  title: string
  children?: React.ReactNode
}

export default function Card({ title, children }: Props) {
  return (
    <div className="rounded-[var(--radius)] bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        {title}
      </h3>
      {children ?? (
        <div className="min-h-[6rem] rounded-[var(--radius)] bg-gray-50" />
      )}
    </div>
  )
}
