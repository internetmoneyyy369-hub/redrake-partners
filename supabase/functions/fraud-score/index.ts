import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface FraudInput {
  click_id?: string
  ip_hash?: string
  fingerprint_hash?: string
  affiliate_id: string
  phone_hash?: string
  country?: string
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const input: FraudInput = await req.json()
  let score = 0
  const flags: string[] = []

  // 1. IP cluster: 5+ clicks from same IP + affiliate in 24h
  if (input.ip_hash) {
    const { count: ipCount } = await supabase
      .from('clicks')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', input.ip_hash)
      .eq('affiliate_id', input.affiliate_id)
      .gte('created_at', new Date(Date.now() - 86400000).toISOString())

    if ((ipCount ?? 0) > 5) { score += 25; flags.push('ip_cluster') }
  }

  // 2. Cross-affiliate fingerprint in 6h
  if (input.fingerprint_hash) {
    const { count: fpCount } = await supabase
      .from('clicks')
      .select('id', { count: 'exact', head: true })
      .eq('fingerprint_hash', input.fingerprint_hash)
      .neq('affiliate_id', input.affiliate_id)
      .gte('created_at', new Date(Date.now() - 3600000 * 6).toISOString())

    if ((fpCount ?? 0) > 0) { score += 40; flags.push('cross_affiliate') }
  }

  // 3. Blacklisted phone
  if (input.phone_hash) {
    const { data: blacklisted } = await supabase
      .from('blacklisted_phones')
      .select('id')
      .eq('phone_hash', input.phone_hash)
      .single()

    if (blacklisted) { score += 100; flags.push('blacklisted_phone') }
  }

  // 4. Non-IN geo
  if (input.country && input.country !== 'IN') {
    score += 30; flags.push('non_in_geo')
  }

  // Insert fraud flags
  if (flags.length > 0 && input.click_id) {
    await supabase.from('fraud_flags').insert(
      flags.map((f) => ({
        entity_type: 'click',
        entity_id: input.click_id,
        flag_type: f,
        severity: score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low',
        auto_actioned: score >= 100,
      }))
    )
  }

  return new Response(
    JSON.stringify({ score, flags, auto_reject: score >= 100 }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
