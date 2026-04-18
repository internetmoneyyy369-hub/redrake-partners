import { auth, clerkClient } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@redrake/db'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { reason } = await req.json()
  const supabase = createSupabaseServerClient()

  const { data: profile, error } = await supabase
    .from('affiliate_profiles')
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', id)
    .select('*, users(clerk_id)')
    .single()

  if (error || !profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

  const clerkId = (profile as any).users?.clerk_id
  if (clerkId) {
    const clerk = await clerkClient()
    await clerk.users.updateUserMetadata(clerkId, {
      publicMetadata: { role: 'affiliate', affiliate_status: 'rejected' },
    })
  }

  return Response.json({ success: true })
}
