// app/lib/stripe/handlers/handleInvoice.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";



export async function handleInvoice(
  event: any
) {
  const supabase = createSupabaseServer();

  const invoice = event.data.object;

  const subscriptionId =
    invoice.subscription;

  if (!subscriptionId) {
    return;
  }



  // -------------------------
  // Decide status
  // -------------------------

  let status: string | null = null;


  if (event.type === "invoice.paid") {
    status = "active";
  }

  if (
    event.type ===
    "invoice.payment_failed"
  ) {
    status = "past_due";
  }

  if (!status) {
    return;
  }



  // -------------------------
  // Update subscription
  // -------------------------

  await supabase
    .from("subscriptions")
    .update({
      status,
    })
    .eq("id", subscriptionId);
}