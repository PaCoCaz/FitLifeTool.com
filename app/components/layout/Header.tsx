import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#B8CAE0]">
      <div className="mx-auto max-w-[1200px] px-4 h-15 flex items-center justify-between">

        {/* Links */}
        <div className="flex items-center gap-2">
          {/* Hamburger – alleen mobiel */}
          <button
            aria-label="Open menu"
            className="group relative h-7 w-7 md:hidden rounded-[var(--radius)] p-1"
          >
            {/* Default icon */}
            <Image
              src="/menu.svg"
              alt=""
              fill
              className="object-contain transition-opacity group-hover:opacity-0"
            />

            {/* Hover icon */}
            <Image
              src="/menu_hover.svg"
              alt=""
              fill
              className="object-contain opacity-0 transition-opacity group-hover:opacity-100"
            />
          </button>

          {/* Logo desktop – links */}
          <div className="hidden md:block relative h-9 md:h-12">
            <Image
              src="/logo_fitlifetool.png"
              alt="Logo FitLifeTool"
              width={1500}
              height={300}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Logo mobiel – exact gecentreerd */}
        <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <div className="relative h-9">
            <Image
              src="/logo_fitlifetool.png"
              alt="Logo FitLifeTool"
              width={1500}
              height={300}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Rechts: avatar */}
        <button
          aria-label="Gebruikersmenu"
          className="group flex items-center gap-2 rounded-[var(--radius)] h-11 p-2 bg-[#191970] text-[#FFFFFF] hover:bg-[#0BA4E0]"
        >
          {/* Avatar */}
          <span className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src="/user.svg"
              alt=""
              fill
              className="object-contain"
            />
            <Image
              src="/user_hover.svg"
              alt=""
              fill
              className="object-contain opacity-0 transition-opacity group-hover:opacity-100"
            />
          </span>

          {/* Naam – alleen desktop */}
          <span className="hidden md:block font-medium">
            Gebruikersnaam
          </span>
        </button>

      </div>
    </header>
  );
}
