import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function proxy(req: NextRequest) {
  const session = await auth();
   const token = (await cookies()).get("authToken")?.value;

  const { pathname } = req.nextUrl;

  // PUBLIC ROUTES
  const adminPublicPaths = [
    "/admin",
  ];

  const memberPublicPath = [
    '/member/auth/sign-in',
    '/member/auth/sign-up',
  ]

  const isAdminPublic = adminPublicPaths.includes(pathname);
  const isMemberPublic = memberPublicPath.includes(pathname);

  if (!isAdminPublic && !session) {
    // Protected route & not logged in
    return NextResponse.redirect(new URL("/member/auth/sign-in", req.nextUrl.origin));
  }

   if (!isMemberPublic && !token) {
    // Protected route & not logged in
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  if (isAdminPublic && session) {
    // Already logged in & visiting sign-in or sign-up
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
  }
  if (isMemberPublic && token) {
    // Already logged in & visiting sign-in or sign-up
    return NextResponse.redirect(new URL("/member/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/sign-up",
    "/profile",
    "/admin/:path*",
    "/"
  ],
};
