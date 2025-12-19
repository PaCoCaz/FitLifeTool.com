import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#B8CAE0]">
      <div className="relative max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

        {/* Links */}
        <div className="flex items-center gap-2">
          {/* Hamburger – alleen mobiel */}
          <button
            aria-label="Open menu"
            className="relative h-7 w-7 md:hidden"
          >
            <Image src="/menu.svg" alt="" fill className="object-contain" />
          </button>

          {/* Logo desktop – links */}
          <div className="hidden md:block relative h-9 md:h-11">
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
          <div className="relative h-8">
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
          className="relative h-7 w-7 md:h-11 rounded-full overflow-hidden"
        >
          <Image src="/user.svg" alt="" fill className="object-contain" />
        </button>

      </div>
    </header>
  );
}
