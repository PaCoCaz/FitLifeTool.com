export default function Sidebar() {
  return (
    <aside
      className="fixed top-20 w-[220px] lg:w-[240px] h-[calc(100vh-60px)] bg-[#B8CAE0] rounded-[var(--radius)]">
      <nav className="p-4 space-y-2">
        <button className="w-full flex items-center text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-white hover:bg-[#0BA4E0]">
          Dashboard
        </button>
        <button className="w-full flex items-center text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-white hover:bg-[#0BA4E0]">
          Voeding
        </button>
        <button className="w-full flex items-center text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-white hover:bg-[#0BA4E0]">
          Activiteit
        </button>
        <button className="w-full flex items-center text-left px-3 py-2 rounded-[var(--radius)] bg-[#191970] text-white hover:bg-[#0BA4E0]">
          Instellingen
        </button>
      </nav>
    </aside>
  );
}
