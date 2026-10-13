// app/lib/stripe/handlers/handleProduct.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type Stripe from "stripe";



export async function handleProduct(
  event: Stripe.Event
) {
  const supabase = createSupabaseServer();

  const product = event.data.object as Stripe.Product;

  await supabase
    .from("products")
    .upsert({
      id: product.id,
      name: product.name,
      active: product.active,
      metadata: product.metadata ?? {},
    });
}
