import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'

type DB = SupabaseClient<Database>

export async function listLeads(
  supabase: DB,
  opts: {
    affiliateId?: string
    campaignId?: string
    status?: string
    page?: number
    limit?: number
  } = {}
) {
  const { affiliateId, campaignId, status, page = 1, limit = 20 } = opts
  let query = supabase
    .from('leads')
    .select('*, affiliate_profiles(full_name), campaigns(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (affiliateId) query = query.eq('affiliate_id', affiliateId)
  if (campaignId) query = query.eq('campaign_id', campaignId)
  if (status) query = query.eq('status', status as any)
  return query
}

export async function updateLeadStatus(
  supabase: DB,
  id: string,
  status: Database['public']['Tables']['leads']['Row']['status'],
  reason?: string
) {
  return supabase
    .from('leads')
    .update({ status, rejection_reason: reason ?? null })
    .eq('id', id)
}
