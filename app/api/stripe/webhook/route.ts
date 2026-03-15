// app/api/stripe/webhook/route.ts

import {
    verifyStripeEvent,
    handleStripeEvent,
  } from "@/lib/stripe/webhook";
  
  
  
  export async function POST(
    req: Request
  ) {
    const body = await req.text();
  
    const signature =
      req.headers.get("stripe-signature");
  
    if (!signature) {
      return new Response(
        "Missing signature",
        { status: 400 }
      );
    }
  
    let event;
  
    try {
      event = verifyStripeEvent(
        body,
        signature
      );
    } catch (err) {
      console.error(
        "Stripe signature error",
        err
      );
  
      return new Response(
        "Invalid signature",
        { status: 400 }
      );
    }
  
    try {
      await handleStripeEvent(event);
    } catch (err) {
      console.error(
        "Stripe webhook error",
        err
      );
  
      return new Response(
        "Webhook error",
        { status: 500 }
      );
    }
  
    return new Response("ok");
  }