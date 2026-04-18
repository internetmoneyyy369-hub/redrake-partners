import { getUser } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'
import { nanoid } from 'nanoid'

const TRACKING_BASE = process.env.NEXT_PUBLIC_TRACKING_BASE_URL ?? 'https://go.redrake.io'

export async function GET() {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServerClient()
  const { data: dbUser } = await supabase.from('users').select('id').eq('id', user.id).single()
  if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('affiliate_profiles').select('id').eq('user_id', dbUser.id).single()
  if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

  const { data: links } = await supabase
    .from('affiliate_links')
    .select('*, campaigns(name, payout_per_lead)')
    .eq('affiliate_id', profile.id)
    .order('created_at', { ascending: false })

  return Response.json({ links: links ?? [] })
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createSupabaseServerClient()

  const { data: dbUser } = await supabase.from('users').select('id').eq('id', user.id).single()
  if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('affiliate_profiles').select('id').eq('user_id', dbUser.id).single()
  if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

  const shortCode = nanoid(6)
  const fullUrl = `${TRACKING_BASE}/${shortCode}`

  const { data: link, error } = await supabase
    .from('affiliate_links')
    .insert({
      affiliate_id: profile.id,
      campaign_id: body.campaign_id,
      short_code: shortCode,
      full_url: fullUrl,
      source_tag: body.source_tag ?? null,
      platform_tag: body.platform_tag ?? null,
      city_tag: body.city_tag ?? null,
      language_tag: body.language_tag ?? null,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 400 })
  return Response.json({ link })
}
