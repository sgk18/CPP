import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "cpp_admin_session";

async function verifySessionTokenInEdge(sessionValue: string, adminPasswordHash: string): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(adminPasswordHash),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode("cpp-authenticated-session")
    );
    const hashArray = Array.from(new Uint8Array(signature));
    const expected = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return sessionValue === expected;
  } catch (e) {
    console.error("Proxy signature validation error:", e);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowercasePath = pathname.toLowerCase();

  // Redirect case-insensitive /admin routes to lowercase /admin
  if (lowercasePath.startsWith("/admin")) {
    if (pathname !== lowercasePath) {
      const newUrl = new URL(lowercasePath + request.nextUrl.search, request.url);
      return NextResponse.redirect(newUrl);
    }
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get(COOKIE_NAME)?.value;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "240be518abb0227c412f719e729a177259174846110fbc2db484fa5cf8d73b22";

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const isValid = await verifySessionTokenInEdge(session, adminPasswordHash);
    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  // Redirect logged in users away from /admin/login
  if (pathname === "/admin/login") {
    const session = request.cookies.get(COOKIE_NAME)?.value;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "240be518abb0227c412f719e729a177259174846110fbc2db484fa5cf8d73b22";
    if (session) {
      const isValid = await verifySessionTokenInEdge(session, adminPasswordHash);
      if (isValid) {
        return NextResponse.redirect(new URL("/admin/collections/events", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
