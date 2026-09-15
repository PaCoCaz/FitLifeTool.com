import { NextResponse } from "next/server";
import {
  EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT,
  resolveEmailChangeCallback,
  resolveEmailChangeFragmentEvidence,
  shouldBootstrapEmailChangeFragment,
} from "@/lib/auth/emailChangeCallback";

function confirmationResponse(request: Request, result: ReturnType<typeof resolveEmailChangeCallback>) {
  const destination = new URL("/auth/change-email/confirmation", request.url);
  destination.searchParams.set("lang", result.language);
  destination.searchParams.set("state", result.state);
  return new NextResponse(null, { status: 303, headers: {
    Location: destination.toString(), "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer",
  } });
}

export function GET(request: Request) {
  const url = new URL(request.url);
  if (!shouldBootstrapEmailChangeFragment(url)) {
    return confirmationResponse(request, resolveEmailChangeCallback(url));
  }

  const nonce = crypto.randomUUID().replaceAll("-", "");
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"></head><body><script nonce="${nonce}">${EMAIL_CHANGE_FRAGMENT_BOOTSTRAP_SCRIPT}</script></body></html>`;
  return new NextResponse(html, { status: 200, headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "private, no-store",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
    "X-Content-Type-Options": "nosniff",
  } });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (!contentType.startsWith("application/x-www-form-urlencoded") || contentLength > 512) {
    return confirmationResponse(request, resolveEmailChangeFragmentEvidence([]));
  }

  try {
    const form = await request.formData();
    const entries: Array<[string, string]> = [];
    for (const [key, value] of form.entries()) {
      if (typeof value !== "string") return confirmationResponse(request, resolveEmailChangeFragmentEvidence([]));
      entries.push([key, value]);
    }
    return confirmationResponse(request, resolveEmailChangeFragmentEvidence(entries));
  } catch {
    return confirmationResponse(request, resolveEmailChangeFragmentEvidence([]));
  }
}
