import type Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type {
  StripeEventLease,
  SupabaseClientLike,
} from "../subscriptionPersistence";

export async function handlePrice(
  event: Stripe.Event,
  lease: StripeEventLease,
  supabase: SupabaseClientLike = createSupabaseServer()
) {
  const price = event.data.object as Stripe.Price;
  const productId =
    typeof price.product === "string"
      ? price.product
      : price.product.id;
  const { data, error } = await supabase.rpc(
    "apply_stripe_price_snapshot",
    {
      p_event_id: lease.eventId,
      p_generation: lease.generation,
      p_lease_token: lease.leaseToken,
      p_stripe_event_created_at: lease.stripeCreatedAt,
      p_price_id: price.id,
      p_product_id: productId,
      p_unit_amount: price.unit_amount,
      p_currency: price.currency,
      p_interval: price.recurring?.interval ?? null,
      p_interval_count: price.recurring?.interval_count ?? null,
      p_active: price.active,
    }
  );
  if (error || !["applied", "stale_ignored"].includes(data as string)) {
    throw error ?? new Error("STRIPE_PRICE_APPLY_REJECTED");
  }
}
