import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createSupabaseServerClient()

  // Update affiliate status in DB
  const { data: profile, error } = await supabase
    .from('affiliate_profiles')
    .update({ status: 'approved' })
    .eq('id', id)
    .select('*, users(email)')
    .single()

  if (error || !profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

  // Create wallet if not exists
  await supabase
    .from('wallets')
    .upsert({ affiliate_id: id }, { onConflict: 'affiliate_id' })

  return Response.json({ success: true })
}
