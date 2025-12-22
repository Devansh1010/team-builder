import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function proxy(req: NextRequest) {
  const session = await auth() // Admin Session
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')?.value // Member Token

  const { pathname } = req.nextUrl

  // 1. Handle the Root Path (/)
  if (pathname === '/') {
    if (session) return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    if (token) return NextResponse.redirect(new URL('/member/dashboard', req.url))
    // Default fallback if no one is logged in
    return NextResponse.redirect(new URL('/member/auth/sign-in', req.url))
  }

  // 2. Define Route Categories
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminAuthPage = pathname.startsWith('/auth/sign-in') || pathname.startsWith('/auth/sign-up')
  
  const isMemberRoute = pathname.startsWith('/member')
  const isMemberAuthPage = pathname.startsWith('/member/auth')

  // 3. Admin Access Control
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }
  if (isAdminAuthPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  // 4. Member Access Control
  if (isMemberRoute && !isMemberAuthPage && !token) {
    return NextResponse.redirect(new URL('/member/auth/sign-in', req.url))
  }
  if (isMemberAuthPage && token) {
    return NextResponse.redirect(new URL('/member/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Use a more inclusive matcher to catch all protected paths
  matcher: [
    '/',
    '/admin/:path*',
    '/member/:path*',
    '/auth/:path*',
    '/profile'
  ],
}