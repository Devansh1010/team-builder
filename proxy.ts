import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const session = await auth();
  console.log("session:", session);

  const { pathname } = req.nextUrl;

  // PUBLIC ROUTES
  const publicPaths = [
    "/",
    "/sign-up",
    "/sign-in",
  ];

  const isPublic = publicPaths.includes(pathname);

  if (!isPublic && !session) {
    // Protected route & not logged in
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
  }

  if (isPublic && session) {
    // Already logged in & visiting sign-in or sign-up
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
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
