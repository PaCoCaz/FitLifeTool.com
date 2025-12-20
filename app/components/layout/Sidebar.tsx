export default function Sidebar() {
    return (
      <aside className="rounded-[var(--radius)] hidden lg:block w-[240px] bg-[#B8CAE0] h-[calc(100vh-56px)] sticky top-14">
        <nav className="p-4 space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-[#FFFFFF] hover:bg-[#0BA4E0]">
            Dashboard
          </button>
  
          <button className="w-full text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-[#FFFFFF] hover:bg-[#0BA4E0]">
            Voeding
          </button>
  
          <button className="w-full text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-[#FFFFFF] hover:bg-[#0BA4E0]">
            Activiteit
          </button>
  
          <button className="w-full text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-[#FFFFFF] hover:bg-[#0BA4E0]">
            Instellingen
          </button>
        </nav>
      </aside>
    );
  }
  