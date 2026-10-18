import type Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type {
  StripeEventLease,
  SupabaseClientLike,
} from "../subscriptionPersistence";

export async function handleCheckoutSession(
  event: Stripe.Event,
  lease: StripeEventLease,
  supabase: SupabaseClientLike = createSupabaseServer()
) {
  const session = event.data.object as Stripe.Checkout.Session;
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const userId = session.client_reference_id;

  if (!stripeCustomerId || !userId) {
    throw new Error("STRIPE_CHECKOUT_MAPPING_MISSING");
  }

  const { data, error } = await supabase.rpc(
    "apply_stripe_checkout_mapping",
    {
      p_event_id: lease.eventId,
      p_generation: lease.generation,
      p_lease_token: lease.leaseToken,
      p_user_id: userId,
      p_stripe_customer_id: stripeCustomerId,
    }
  );
  if (error || !["established", "existing"].includes(data as string)) {
    throw error ?? new Error("STRIPE_CHECKOUT_MAPPING_REJECTED");
  }
}
