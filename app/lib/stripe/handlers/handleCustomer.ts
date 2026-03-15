// app/lib/stripe/handlers/handleCustomer.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";



export async function handleCustomer(
  event: any
) {
  const supabase = createSupabaseServer();

  const customer = event.data.object;

  await supabase
    .from("customers")
    .upsert({
      stripe_customer_id: customer.id,

      email: customer.email ?? null,
    });
}