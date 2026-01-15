// app/handbook/hoofdstuk/chapterLayout.tsx

export default function ChapterLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <article className="handbook">
        {children}
      </article>
    );
  }
  