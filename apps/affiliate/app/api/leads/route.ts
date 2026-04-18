import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export async function GET(req: Request) {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') ?? '1')
  const limit = parseInt(url.searchParams.get('limit') ?? '20')
  const status = url.searchParams.get('status')

  const supabase = createSupabaseServerClient()
  const { data: dbUser } = await supabase.from('users').select('id').eq('id', user.id).single()
  if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('affiliate_profiles').select('id').eq('user_id', dbUser.id).single()
  if (!profile) return Response.json({ leads: [], total: 0 })

  let query = supabase
    .from('leads')
    .select('*, campaigns(name, payout_per_lead)', { count: 'exact' })
    .eq('affiliate_id', profile.id)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status as any)

  const { data: leads, count } = await query
  return Response.json({ leads: leads ?? [], total: count ?? 0 })
}
