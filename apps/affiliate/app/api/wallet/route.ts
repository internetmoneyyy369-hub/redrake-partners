import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export async function GET() {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: dbUser } = await supabase.from('users').select('id').eq('id', user.id).single()
  if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('affiliate_profiles').select('id').eq('user_id', dbUser.id).single()
  if (!profile) return Response.json({ wallet: null })

  const { data: wallet } = await supabase
    .from('wallets').select('*').eq('affiliate_id', profile.id).single()

  return Response.json({ wallet })
}
