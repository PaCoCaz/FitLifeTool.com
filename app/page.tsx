import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#DBE4F0]">
      <div className="mb-6 relative h-16">
        <Image
          src="/logo_fitlifetool.png"
          alt="FitLifeTool"
          width={1500}
          height={300}
          className="h-full w-auto object-contain"
          priority
        />
      </div>

      <h1 className="mb-2 text-xl font-semibold text-[#191970]">
        Welkom bij FitLifeTool
      </h1>

      <p className="mb-6 text-sm text-gray-600 text-center max-w-sm">
        Jouw persoonlijke tool voor voeding, beweging en gezondheid.
      </p>

      <Link
        href="/login"
        className="rounded-[var(--radius)] bg-[#191970] px-6 py-2 text-white hover:bg-[#0BA4E0] transition"
      >
        Inloggen
      </Link>
    </main>
  );
}
