import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@redrake/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single()
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('affiliate_profiles').select('id').eq('user_id', user.id).single()
  if (!profile) return Response.json({ wallet: null })

  const { data: wallet } = await supabase
    .from('wallets').select('*').eq('affiliate_id', profile.id).single()

  return Response.json({ wallet })
}
