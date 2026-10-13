// app/lib/stripe/handlers/handlePrice.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";



export async function handlePrice(
  event: Stripe.Event
) {
  const supabase = createSupabaseServer();

  const price = event.data.object as Stripe.Price;

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
