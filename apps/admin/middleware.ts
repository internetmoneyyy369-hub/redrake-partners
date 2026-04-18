import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (auth, request) => {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role

  const isSignIn = request.nextUrl.pathname.startsWith('/sign-in')
  if (isSignIn) return NextResponse.next()

  if (!role || !['admin', 'super_admin', 'finance', 'ops'].includes(role)) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
