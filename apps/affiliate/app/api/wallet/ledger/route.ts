import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export async function GET(req: Request) {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') ?? '1')
  const limit = 20

  const supabase = createSupabaseServerClient()
  const { data: dbUser } = await supabase.from('users').select('id').eq('id', user.id).single()
  if (!dbUser) return Response.json({ entries: [], total: 0 })

  const { data: profile } = await supabase
    .from('affiliate_profiles').select('id').eq('user_id', dbUser.id).single()
  if (!profile) return Response.json({ entries: [], total: 0 })

  const { data: entries, count } = await supabase
    .from('commission_ledger')
    .select('*', { count: 'exact' })
    .eq('affiliate_id', profile.id)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  return Response.json({ entries: entries ?? [], total: count ?? 0 })
}
