// app/register/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterModal from "@/components/auth/RegisterModal";

export default function RegisterPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <>
      <RegisterModal
        open={open}
        onClose={() => {
          setOpen(false);
          router.replace("/");
        }}
      />
    </>
  );
}
