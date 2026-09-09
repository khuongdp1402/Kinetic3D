import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Strict protection for /admin routes
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("kinetic3d_token")?.value || 
                       request.cookies.get("auth_token")?.value;

    // If no auth token is present, redirect to home page
    if (!authCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("blocked", "admin");
      return NextResponse.redirect(url);
    }
  }

  // Only keep strict protection for /admin routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin request paths
     */
    "/admin/:path*",
  ],
};
