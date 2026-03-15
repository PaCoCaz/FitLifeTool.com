// app/lib/stripe/handlers/handleProduct.ts

import { createSupabaseServer } from "@/lib/supabase/supabaseServer";



export async function handleProduct(
  event: any
) {
  const supabase = createSupabaseServer();

  const product = event.data.object;

  await supabase
    .from("products")
    .upsert({
      id: product.id,
      name: product.name,
      active: product.active,
      metadata: product.metadata ?? {},
    });
}