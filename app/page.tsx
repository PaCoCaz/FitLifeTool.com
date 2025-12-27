import Link from "next/link";
import Header from "./components/layout/Header";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="pt-[104px]">
        <div className="mx-auto max-w-[1200px] px-4">
          <section className="py-16 text-center">
            <h1 className="mb-4 text-3xl font-semibold text-[#191970]">
              Personal health & nutrition, tailored to you
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-gray-600">
              FitLifeTool helps you track nutrition, activity, weight and daily
              goals in one clear dashboard — built to be simple, personal and
              sustainable.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="rounded-[var(--radius)] bg-[#191970] px-6 py-3 text-white hover:bg-[#0BA4E0] transition"
              >
                Get started
              </Link>

              <Link
                href="/login"
                className="rounded-[var(--radius)] border border-[#191970] px-6 py-3 text-[#191970] hover:bg-gray-50 transition"
              >
                Log in
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
