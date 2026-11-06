import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "awa_admin";

/**
 * Vérification optimiste (Next.js 16 : Middleware s'appelle maintenant Proxy).
 * La vraie vérification de session reste côté serveur, dans les layouts et
 * les server actions.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // La page /admin affiche elle-même le formulaire de connexion.
  if (pathname === "/admin") return NextResponse.next();

  const hasSession = Boolean(request.cookies.get(COOKIE_NAME)?.value);
  if (hasSession) return NextResponse.next();

  return NextResponse.redirect(new URL("/admin", request.url));
}

export const config = {
  matcher: "/admin/:path*",
};
