import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export async function GET(req: Request) {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const page = parseInt(url.searchParams.get('page') ?? '1')
  const limit = parseInt(url.searchParams.get('limit') ?? '25')

  const supabase = createSupabaseServerClient()
  let query = supabase
    .from('affiliate_profiles')
    .select('*, users(email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status as any)

  const { data: affiliates, count } = await query
  return Response.json({ affiliates: affiliates ?? [], total: count ?? 0 })
}
