import type Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type {
  StripeEventLease,
  SupabaseClientLike,
} from "../subscriptionPersistence";

export async function handleProduct(
  event: Stripe.Event,
  lease: StripeEventLease,
  supabase: SupabaseClientLike = createSupabaseServer()
) {
  const product = event.data.object as Stripe.Product;
  const { data, error } = await supabase.rpc(
    "apply_stripe_product_snapshot",
    {
      p_event_id: lease.eventId,
      p_generation: lease.generation,
      p_lease_token: lease.leaseToken,
      p_stripe_event_created_at: lease.stripeCreatedAt,
      p_product_id: product.id,
      p_name: product.name,
      p_active: product.active,
    }
  );
  if (error || !["applied", "stale_ignored"].includes(data as string)) {
    throw error ?? new Error("STRIPE_PRODUCT_APPLY_REJECTED");
  }
}
