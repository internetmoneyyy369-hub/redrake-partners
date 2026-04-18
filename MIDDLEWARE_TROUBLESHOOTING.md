# Middleware Troubleshooting Guide

## Current Status
Still experiencing `MIDDLEWARE_INVOCATION_FAILED` errors on Vercel despite multiple fix attempts.

## Attempts Made

### Attempt 1: Synchronous auth.protect()
- Replaced `await auth()` with `auth.protect()`
- Result: Still failed

### Attempt 2: Simplified middleware (Current)
- Removed all callback logic
- Using `clerkMiddleware()` with default behavior
- Added explicit ClerkProvider configuration
- Result: Testing...

## If Current Approach Fails

### Option A: Disable Middleware Completely
Remove middleware.ts files and use page-level authentication:

```typescript
// In each protected page
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  
  // Page content
}
```

**Pros:**
- No Edge Runtime issues
- Works reliably
- Simple to implement

**Cons:**
- Need to add auth check to every protected page
- No centralized authentication logic

### Option B: Use authMiddleware (Legacy)
Try the older `authMiddleware` instead of `clerkMiddleware`:

```typescript
import { authMiddleware } from '@clerk/nextjs/server'

export default authMiddleware({
  publicRoutes: ['/sign-in', '/sign-up', '/api/webhooks'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

**Note:** This is deprecated but might work better with Edge Runtime.

### Option C: Move to Node.js Runtime
Add runtime configuration to force Node.js instead of Edge:

```typescript
// In middleware.ts
export const runtime = 'nodejs'
```

**Pros:**
- More compatible with async operations
- Fewer runtime constraints

**Cons:**
- Slower cold starts
- Higher resource usage

### Option D: Use Vercel Middleware Config
Create `vercel.json` to configure middleware behavior:

```json
{
  "functions": {
    "middleware.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## Recommended Next Steps

1. **Wait for current deployment** (Attempt 2) to complete
2. **If still failing**, try Option A (page-level auth) - most reliable
3. **If need centralized logic**, try Option B (authMiddleware)
4. **Last resort**, try Option C or D (runtime changes)

## Environment Variables Check

Ensure these are set in Vercel for all three apps:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWFnaWNhbC1zaGFkLTY1LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_StXPiP2wOEuFNW0VopaZd83bru3HBABsGe0bkqRf9Co
NEXT_PUBLIC_SUPABASE_URL=https://dwsxabdgqtmohzxhmhpn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Debugging Commands

Check Vercel logs:
```bash
vercel logs [deployment-url]
```

Test locally:
```bash
cd stakehub
pnpm dev
# Test each app on ports 3000, 3001, 3002
```

Check middleware execution:
```bash
# Add console.log in middleware.ts
console.log('Middleware executing for:', request.url)
```

## Contact Clerk Support

If all else fails, contact Clerk support with:
- Next.js version: 15.3.4
- Clerk version: 6.23.2
- Error: MIDDLEWARE_INVOCATION_FAILED on Vercel Edge Runtime
- Deployment platform: Vercel
- Runtime: Edge Runtime

## Alternative: Remove Clerk Entirely

If Clerk is causing too many issues, consider:
- NextAuth.js (more Edge Runtime compatible)
- Supabase Auth (already using Supabase)
- Custom JWT authentication

This would require significant refactoring but might be more stable.
