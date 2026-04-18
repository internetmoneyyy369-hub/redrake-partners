export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  TRACKING_SALT: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const shortCode = url.pathname.replace('/', '').trim()

    if (!shortCode) {
      return Response.redirect('https://redrake.io', 302)
    }

    // Lookup the affiliate link
    const linkRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/affiliate_links?short_code=eq.${shortCode}&select=id,affiliate_id,campaign_id,campaigns(destination_url,whatsapp_number,status)`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )
    const links = (await linkRes.json()) as any[]
    const link = links[0]

    if (!link || link.campaigns?.status !== 'active') {
      return Response.redirect('https://redrake.io', 302)
    }

    const cf = (request as any).cf ?? {}
    const ip = request.headers.get('CF-Connecting-IP') ?? ''
    const ipHash = await sha256(ip + env.TRACKING_SALT)
    const sessionId = crypto.randomUUID()
    const trackingToken = crypto.randomUUID().replace(/-/g, '').slice(0, 16)

    const ua = request.headers.get('user-agent') ?? ''
    const isMobile = /mobile|android|iphone|ipad/i.test(ua)
    const isTablet = /ipad|tablet/i.test(ua)
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

    // Store click (non-blocking)
    ctx.waitUntil(
      fetch(`${env.SUPABASE_URL}/rest/v1/clicks`, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          link_id: link.id,
          affiliate_id: link.affiliate_id,
          campaign_id: link.campaign_id,
          session_id: sessionId,
          ip_hash: ipHash,
          device_type: deviceType,
          country: cf.country ?? null,
          city: cf.city ?? null,
          state_region: cf.region ?? null,
          referrer: request.headers.get('referer') ?? null,
          utm_source: url.searchParams.get('utm_source'),
          utm_medium: url.searchParams.get('utm_medium'),
          utm_campaign: url.searchParams.get('utm_campaign'),
        }),
      })
    )

    // Store WhatsApp intent (non-blocking)
    ctx.waitUntil(
      fetch(`${env.SUPABASE_URL}/rest/v1/whatsapp_intents`, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          session_id: sessionId,
          tracking_token: trackingToken,
          campaign_id: link.campaign_id,
          affiliate_id: link.affiliate_id,
          intent_type: 'click',
        }),
      })
    )

    // Increment click count (non-blocking)
    ctx.waitUntil(
      fetch(`${env.SUPABASE_URL}/rest/v1/rpc/increment_link_clicks`, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_link_id: link.id }),
      })
    )

    // Redirect to destination with tracking params
    const dest = new URL(link.campaigns.destination_url)
    dest.searchParams.set('sid', sessionId)
    dest.searchParams.set('token', trackingToken)
    dest.searchParams.set('wa', link.campaigns.whatsapp_number)

    return Response.redirect(dest.toString(), 302)
  },
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
