import { Webhook } from 'svix'
import { createSupabaseServerClient } from '@redrake/db'

export async function POST(req: Request) {
  const body = await req.text()
  const headers = Object.fromEntries(req.headers.entries())

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? '')
  let event: any

  try {
    event = wh.verify(body, headers)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  const supabase = createSupabaseServerClient()

  if (event.type === 'user.created') {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = event.data

    // Create user record
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        clerk_id: clerkId,
        email: email_addresses[0]?.email_address ?? '',
        role: 'affiliate',
      })
      .select()
      .single()

    if (error) {
      console.error('[clerk-webhook] user insert error:', error)
      return new Response('Error', { status: 500 })
    }

    // Create affiliate profile
    await supabase.from('affiliate_profiles').insert({
      user_id: user.id,
      full_name: `${first_name ?? ''} ${last_name ?? ''}`.trim() || 'New Affiliate',
      status: 'pending',
    })
  }

  return new Response('OK', { status: 200 })
}
