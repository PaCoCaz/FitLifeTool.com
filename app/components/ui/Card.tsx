type Props = {
  title: string
  children?: React.ReactNode
}

export default function Card({ title, children }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        {title}
      </h3>
      {children ?? (
        <div className="h-24 rounded-lg bg-gray-50" />
      )}
    </div>
  )
}
