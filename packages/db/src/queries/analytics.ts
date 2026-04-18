import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'

type DB = SupabaseClient<Database>

export async function getAffiliateFunnel(
  supabase: DB,
  affiliateId: string,
  from: Date,
  to: Date
) {
  const fromISO = from.toISOString()
  const toISO = to.toISOString()

  const [clicks, intents, messages, qualified] = await Promise.all([
    supabase
      .from('clicks')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId)
      .gte('created_at', fromISO)
      .lte('created_at', toISO),
    supabase
      .from('whatsapp_intents')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId)
      .gte('created_at', fromISO)
      .lte('created_at', toISO),
    supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId)
      .gte('received_at', fromISO)
      .lte('received_at', toISO),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId)
      .eq('status', 'qualified')
      .gte('created_at', fromISO)
      .lte('created_at', toISO),
  ])

  return {
    clicks: clicks.count ?? 0,
    wa_clicked: intents.count ?? 0,
    message_received: messages.count ?? 0,
    qualified: qualified.count ?? 0,
  }
}

export async function getDailyStats(supabase: DB, affiliateId: string, days = 7) {
  const from = new Date(Date.now() - days * 86400 * 1000).toISOString()
  return supabase
    .from('clicks')
    .select('created_at')
    .eq('affiliate_id', affiliateId)
    .gte('created_at', from)
    .order('created_at', { ascending: true })
}
