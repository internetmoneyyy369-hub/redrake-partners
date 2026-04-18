import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { lead_id } = await req.json()

  const { data: lead } = await supabase
    .from('leads')
    .select('*, campaigns(*), affiliate_profiles(tier, payout_hold_days)')
    .eq('id', lead_id)
    .single()

  if (!lead || lead.status !== 'qualified') {
    return new Response(JSON.stringify({ error: 'Lead not qualified' }), { status: 400 })
  }

  const { data: rules } = await supabase
    .from('commission_rules')
    .select('*')
    .eq('campaign_id', lead.campaign_id)
    .eq('is_active', true)
    .order('min_leads', { ascending: false })

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())

  const { count: weeklyLeads } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('affiliate_id', lead.affiliate_id)
    .eq('campaign_id', lead.campaign_id)
    .eq('status', 'qualified')
    .gte('created_at', weekStart.toISOString())

  let amount = lead.campaigns.payout_per_lead
  let description = 'Lead bonus (base rate)'

  for (const rule of (rules ?? [])) {
    if ((weeklyLeads ?? 0) >= rule.min_leads) {
      amount = rule.payout_amount
      description = rule.description ?? `Tiered rate at ${rule.min_leads}+ leads`
      break
    }
  }

  const holdDays = lead.affiliate_profiles.payout_hold_days ?? 7
  const holdUntil = new Date(Date.now() + holdDays * 86400 * 1000)

  await supabase.from('commission_ledger').insert({
    affiliate_id: lead.affiliate_id,
    lead_id: lead.id,
    campaign_id: lead.campaign_id,
    entry_type: 'lead_bonus',
    amount,
    status: holdDays > 0 ? 'on_hold' : 'approved',
    hold_until: holdDays > 0 ? holdUntil.toISOString() : null,
    description,
  })

  await supabase.rpc('increment_wallet_pending', {
    p_affiliate_id: lead.affiliate_id,
    p_amount: amount,
  })

  await supabase
    .from('leads')
    .update({ status: 'payable', payable_at: new Date().toISOString() })
    .eq('id', lead_id)

  return new Response(JSON.stringify({ amount, description, hold_until: holdUntil }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
