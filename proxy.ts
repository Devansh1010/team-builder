import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function proxy(req: NextRequest) {
  const session = await auth(); // ADMIN LOGIN
  const token = (await cookies()).get("authToken")?.value; // MEMBER LOGIN

  const { pathname } = req.nextUrl;

  // ADMIN ROUTES
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminAuthPage = pathname === "/auth/sign-in" || pathname === "/auth/sign-up";

  // MEMBER ROUTES
  const isMemberRoute = pathname.startsWith("/member");
  const isMemberAuthPage = pathname.startsWith("/member/auth");


  // ADMIN LOGIC

  if (isAdminRoute) {
    // 1. If admin is NOT logged in → allow only admin login page
    if (!session && !isAdminAuthPage) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    // 2. If admin IS logged in → block login page
    if (session && isAdminAuthPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // MEMBER LOGIC

  if (isMemberRoute) {
    // 1. If member is NOT logged in → allow only member auth pages
    if (!token && !isMemberAuthPage) {
      return NextResponse.redirect(new URL("/member/auth/sign-in", req.url));
    }

    // 2. If member IS logged in → block member login page
    if (token && isMemberAuthPage) {
      return NextResponse.redirect(new URL("/member/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/sign-up",
    "/profile",
    "/admin/:path*",
    "/",
    '/member/:path*'
  ],
};
