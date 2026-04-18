import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'

type DB = SupabaseClient<Database>

export async function getAffiliateByUserId(supabase: DB, userId: string) {
  return supabase
    .from('affiliate_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
}

export async function getAffiliateById(supabase: DB, id: string) {
  return supabase
    .from('affiliate_profiles')
    .select('*, users(*), social_accounts(*), kyc_records(*)')
    .eq('id', id)
    .single()
}

export async function listAffiliates(
  supabase: DB,
  opts: { status?: string; page?: number; limit?: number } = {}
) {
  const { status, page = 1, limit = 20 } = opts
  let query = supabase
    .from('affiliate_profiles')
    .select('*, users(email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status as any)
  return query
}

export async function updateAffiliateStatus(
  supabase: DB,
  id: string,
  status: Database['public']['Tables']['affiliate_profiles']['Row']['status'],
  rejectionReason?: string
) {
  return supabase
    .from('affiliate_profiles')
    .update({ status, rejection_reason: rejectionReason ?? null })
    .eq('id', id)
}
