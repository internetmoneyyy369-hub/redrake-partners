import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'

type DB = SupabaseClient<Database>

export async function listCampaigns(supabase: DB, status?: string) {
  let query = supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status as any)
  return query
}

export async function getCampaignBySlug(supabase: DB, slug: string) {
  return supabase.from('campaigns').select('*').eq('slug', slug).single()
}

export async function createCampaign(
  supabase: DB,
  data: Database['public']['Tables']['campaigns']['Insert']
) {
  return supabase.from('campaigns').insert(data).select().single()
}
