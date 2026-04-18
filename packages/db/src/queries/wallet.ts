import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'

type DB = SupabaseClient<Database>

export async function getWallet(supabase: DB, affiliateId: string) {
  return supabase.from('wallets').select('*').eq('affiliate_id', affiliateId).single()
}

export async function getLedger(
  supabase: DB,
  affiliateId: string,
  opts: { page?: number; limit?: number; status?: string } = {}
) {
  const { page = 1, limit = 20, status } = opts
  let query = supabase
    .from('commission_ledger')
    .select('*', { count: 'exact' })
    .eq('affiliate_id', affiliateId)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status as any)
  return query
}

export async function createWithdrawalRequest(
  supabase: DB,
  data: Database['public']['Tables']['withdrawal_requests']['Insert']
) {
  return supabase.from('withdrawal_requests').insert(data).select().single()
}
