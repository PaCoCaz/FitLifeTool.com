import type Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase/supabaseServer";
import type {
  StripeEventLease,
  SupabaseClientLike,
} from "../subscriptionPersistence";

export async function handleCustomer(
  event: Stripe.Event,
  lease: StripeEventLease,
  supabase: SupabaseClientLike = createSupabaseServer()
) {
  const customer = event.data.object as Stripe.Customer;
  const { data, error } = await supabase.rpc(
    "apply_stripe_customer_snapshot",
    {
      p_event_id: lease.eventId,
      p_generation: lease.generation,
      p_lease_token: lease.leaseToken,
      p_stripe_customer_id: customer.id,
    }
  );
  if (error || data !== "applied") {
    throw error ?? new Error("STRIPE_CUSTOMER_APPLY_REJECTED");
  }
}
