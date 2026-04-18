import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

serve(async (req) => {
  // Handle GET verification challenge from Meta
  if (req.method === 'GET') {
    const url = new URL(req.url)
    if (url.searchParams.get('hub.verify_token') === Deno.env.get('WHATSAPP_VERIFY_TOKEN')) {
      return new Response(url.searchParams.get('hub.challenge') ?? '', { status: 200 })
    }
    return new Response('Forbidden', { status: 403 })
  }

  // Verify Meta webhook signature
  const signature = req.headers.get('x-hub-signature-256') ?? ''
  const body = await req.text()
  const expected = await computeHmac(body, Deno.env.get('WHATSAPP_APP_SECRET')!)
  if (`sha256=${expected}` !== signature) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const payload = JSON.parse(body)
  const messages = payload.entry?.[0]?.changes?.[0]?.value?.messages ?? []

  for (const msg of messages) {
    if (msg.type !== 'text') continue

    const phoneRaw = msg.from
    const phoneHash = await sha256(phoneRaw)
    const phoneLast4 = phoneRaw.slice(-4)
    const msgText: string = msg.text?.body ?? ''

    const tokenMatch = msgText.match(/\[TOKEN:([a-zA-Z0-9_-]+)\]/)
    const trackingToken = tokenMatch?.[1]

    let intentId: string | null = null
    let affiliateId: string | null = null
    let campaignId: string | null = null

    if (trackingToken) {
      const { data: intent } = await supabase
        .from('whatsapp_intents')
        .select('*')
        .eq('tracking_token', trackingToken)
        .single()

      if (intent) {
        intentId = intent.id
        affiliateId = intent.affiliate_id
        campaignId = intent.campaign_id
      }
    }

    // Check blacklist
    const { data: blacklisted } = await supabase
      .from('blacklisted_phones')
      .select('id')
      .eq('phone_hash', phoneHash)
      .single()

    if (blacklisted) continue

    // Check duplicate
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('phone_hash', phoneHash)
      .eq('campaign_id', campaignId)
      .neq('status', 'rejected')
      .single()

    // Store WA message
    const { data: waMsg } = await supabase
      .from('whatsapp_messages')
      .insert({
        intent_id: intentId,
        tracking_token: trackingToken,
        wa_message_id: msg.id,
        phone_hash: phoneHash,
        phone_last4: phoneLast4,
        affiliate_id: affiliateId,
        campaign_id: campaignId,
        raw_payload: msg,
      })
      .select()
      .single()

    if (!affiliateId || !campaignId) continue

    const isDuplicate = !!existingLead

    const { data: lead } = await supabase
      .from('leads')
      .insert({
        affiliate_id: affiliateId,
        campaign_id: campaignId,
        wa_message_id: waMsg?.id,
        phone_hash: phoneHash,
        phone_last4: phoneLast4,
        status: isDuplicate ? 'rejected' : 'message_received',
        is_duplicate: isDuplicate,
        duplicate_of: existingLead?.id ?? null,
        rejection_reason: isDuplicate ? 'duplicate_phone' : null,
      })
      .select()
      .single()

    if (!isDuplicate && lead) {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/fraud-score`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` },
        body: JSON.stringify({ lead_id: lead.id, phone_hash: phoneHash, affiliate_id: affiliateId }),
      })
    }
  }

  return new Response('OK', { status: 200 })
})

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function computeHmac(body: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
