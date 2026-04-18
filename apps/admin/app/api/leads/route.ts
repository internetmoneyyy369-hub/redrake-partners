import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@redrake/db'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const affiliateId = url.searchParams.get('affiliate')
  const page = parseInt(url.searchParams.get('page') ?? '1')
  const limit = 25

  const supabase = createSupabaseServerClient()
  let query = supabase
    .from('leads')
    .select('*, affiliate_profiles(full_name), campaigns(name, payout_per_lead)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status as any)
  if (affiliateId) query = query.eq('affiliate_id', affiliateId)

  const { data: leads, count } = await query
  return Response.json({ leads: leads ?? [], total: count ?? 0 })
}
