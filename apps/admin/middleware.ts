import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId, sessionClaims } = auth.protect()

    const role = (sessionClaims?.metadata as any)?.role
    if (!role || !['admin', 'super_admin', 'finance', 'ops'].includes(role)) {
      // Allow access but pages will handle role check
      // Don't block here to avoid redirect loops during setup
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
