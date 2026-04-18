import { authMiddleware } from '@clerk/nextjs'

// Using legacy authMiddleware - more stable with Edge Runtime
export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-in/(.*)', '/sign-up', '/sign-up/(.*)', '/api/webhooks(.*)'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
