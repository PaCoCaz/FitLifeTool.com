import {
  getStripePayloadSha256,
  handleStripeEvent,
  recoverOneStripeWebhookEvent,
  verifyStripeEvent,
} from "@/lib/stripe/webhook";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event;
  try {
    event = verifyStripeEvent(body, signature);
  } catch {
    console.error("STRIPE_WEBHOOK_SIGNATURE_INVALID");
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    await handleStripeEvent(event, getStripePayloadSha256(body));
  } catch {
    console.error("STRIPE_WEBHOOK_PROCESSING_FAILED");
    return new Response("Webhook error", { status: 500 });
  }

  try {
    await recoverOneStripeWebhookEvent();
  } catch {
    console.error("STRIPE_WEBHOOK_RECOVERY_FAILED");
  }

  return new Response("ok");
}
