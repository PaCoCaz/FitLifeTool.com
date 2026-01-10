import { Suspense } from "react";
import ResetPasswordClient from "@/reset-password/ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordClient />
    </Suspense>
  );
}
