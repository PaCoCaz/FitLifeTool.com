import { NextResponse } from "next/server";
import { resolveEmailChangeCallback } from "@/lib/auth/emailChangeCallback";
export function GET(request: Request) {
  const result = resolveEmailChangeCallback(new URL(request.url));
  const destination = new URL("/auth/change-email/confirmation", request.url);
  destination.searchParams.set("lang", result.language);
  destination.searchParams.set("state", result.state);
  return new NextResponse(null, { status: 303, headers: {
    Location: destination.toString(), "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer",
  } });
}
