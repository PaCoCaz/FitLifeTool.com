export default function Header() {
    return (
      <header className="h-14 border-b bg-white flex items-center justify-between px-4">
        <div className="font-bold">FitLifeTool</div>
  
        <div className="text-sm font-medium">
          Dashboard
        </div>
  
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <span className="hidden sm:block">Paul</span>
        </div>
      </header>
    );
  }
  