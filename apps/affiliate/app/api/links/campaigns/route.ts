import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export async function GET() {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, name, payout_per_lead, description')
    .eq('status', 'active')
    .order('name')

  return Response.json({ campaigns: campaigns ?? [] })
}
