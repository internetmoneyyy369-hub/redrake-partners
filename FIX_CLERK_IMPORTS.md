# Quick Fix for Clerk Imports

## Files that need updating:

Replace `import { auth } from '@clerk/nextjs/server'` with `import { getUser } from '@redrake/db'`

And replace:
```typescript
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

With:
```typescript
const user = await getUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

## Files to fix:

### Admin App:
- apps/admin/app/api/affiliates/route.ts
- apps/admin/app/api/affiliates/[id]/approve/route.ts
- apps/admin/app/api/affiliates/[id]/reject/route.ts
- apps/admin/app/api/leads/route.ts
- apps/admin/app/api/leads/[id]/qualify/route.ts
- apps/admin/app/api/leads/[id]/reject/route.ts
- apps/admin/app/(auth)/sign-in/[[...sign-in]]/page.tsx (DELETE THIS FILE)
- apps/admin/app/(dashboard)/layout.tsx (Remove UserButton)

### Affiliate App:
- apps/affiliate/app/api/wallet/route.ts
- apps/affiliate/app/api/wallet/ledger/route.ts
- apps/affiliate/app/api/withdraw/route.ts
- apps/affiliate/app/api/links/route.ts
- apps/affiliate/app/api/links/campaigns/route.ts
- apps/affiliate/app/api/leads/route.ts
- apps/affiliate/app/(auth)/sign-in/[[...sign-in]]/page.tsx (DELETE THIS FILE)
- apps/affiliate/app/(auth)/sign-up/[[...sign-up]]/page.tsx (DELETE THIS FILE)
- apps/affiliate/app/(dashboard)/layout.tsx (Remove UserButton)

## Quick fix command:

Run this in stakehub directory to delete old Clerk auth pages:
```bash
rm -rf apps/admin/app/\(auth\)
rm -rf apps/affiliate/app/\(auth\)
```
