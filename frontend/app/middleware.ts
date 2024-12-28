import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/", "/login", "/register", "/categories"];
const protectedRoutes = ["/articles/new", "/categories/new"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName:
      process.env.ENV === "stage" || process.env.ENV === "prod"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  const isAuthenticated = !!token;

  const { pathname } = req.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow /articles/<uuid> but not /articles/new
  if (pathname.match(/^\/articles\/(?!new$)[a-f0-9-]+$/i)) {
    return NextResponse.next();
  }

  // Allow /categories/<uuid> but not /categories/new
  if (pathname.match(/^\/categories\/(?!new$)[a-f0-9-]+$/i)) {
    return NextResponse.next();
  }

  // Check if the route is protected
  if (protectedRoutes.includes(pathname) || !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
