"use client";

export default function RegisterButton({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const handleClick = () => {
    window.dispatchEvent(new Event("open-register"));
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
