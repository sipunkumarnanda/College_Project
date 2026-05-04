
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // ❌ Not logged in
  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=unauthorized", req.url)
    );
  }

  // ✅ Do NOT verify JWT here
  return NextResponse.next();
}

export const config = {
  matcher: ["/store/:path*"],
};