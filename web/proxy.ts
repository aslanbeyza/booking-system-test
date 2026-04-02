import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** API `AUTH_COOKIE_NAME` ile aynı (varsayılan: booking_token) */
const SESSION_COOKIE =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "booking_token";

/** Next.js 16+: `middleware` yerine `proxy` (Node runtime, aynı matcher API’si) */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE);
  if (!token?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
