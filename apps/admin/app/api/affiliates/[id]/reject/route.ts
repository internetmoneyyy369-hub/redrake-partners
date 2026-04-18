import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { reason } = await req.json()
  const supabase = createSupabaseServerClient()

  const { data: profile, error } = await supabase
    .from('affiliate_profiles')
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', id)
    .select('*')
    .single()

  if (error || !profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

  return Response.json({ success: true })
}
