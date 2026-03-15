// app/lib/stripe/handlers/handlePrice.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";



export async function handlePrice(
  event: any
) {
  const supabase = createSupabaseServer();

  const price = event.data.object;

  await supabase
    .from("prices")
    .upsert({
      id: price.id,

      product_id:
        typeof price.product === "string"
          ? price.product
          : price.product.id,

      unit_amount: price.unit_amount,

      currency: price.currency,

      interval:
        price.recurring?.interval ?? null,

      interval_count:
        price.recurring?.interval_count ?? null,

      active: price.active,

      metadata: price.metadata ?? {},
    });
}