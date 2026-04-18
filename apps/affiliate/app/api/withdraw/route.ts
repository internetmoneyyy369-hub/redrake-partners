import { auth } from '@clerk/nextjs/server'
import { createSupabaseServerClient } from '@redrake/db'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createSupabaseServerClient()

  const { data: user } = await supabase.from('users').select('id').eq('clerk_id', userId).single()
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('affiliate_profiles').select('id').eq('user_id', user.id).single()
  if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

  // Check wallet balance
  const { data: wallet } = await supabase
    .from('wallets').select('approved_balance').eq('affiliate_id', profile.id).single()

  if (!wallet || wallet.approved_balance < body.amount) {
    return Response.json({ error: 'Insufficient approved balance' }, { status: 400 })
  }

  if (body.amount < 500) {
    return Response.json({ error: 'Minimum withdrawal is ₹500' }, { status: 400 })
  }

  const { data: request, error } = await supabase
    .from('withdrawal_requests')
    .insert({
      affiliate_id: profile.id,
      amount: body.amount,
      method: body.method,
      upi_id: body.upi_id ?? null,
      bank_account: body.bank_account ?? null,
      ifsc_code: body.ifsc_code ?? null,
      bank_name: body.bank_name ?? null,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ request })
}
