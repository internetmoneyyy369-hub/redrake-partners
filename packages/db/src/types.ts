// Auto-generated from Supabase CLI:
// supabase gen types typescript --project-id dwsxabdgqtmohzxhmhpn > packages/db/src/types.ts
// Run this after applying migrations to keep types in sync.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          role: 'affiliate' | 'admin' | 'super_admin' | 'finance' | 'ops'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          role?: 'affiliate' | 'admin' | 'super_admin' | 'finance' | 'ops'
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      affiliate_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string | null
          city: string | null
          state: string | null
          language: string | null
          tier: 'new' | 'bronze' | 'silver' | 'gold' | 'platinum'
          status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended'
          rejection_reason: string | null
          assigned_manager_id: string | null
          follower_count: number | null
          primary_platform: 'instagram' | 'youtube' | 'twitter' | 'telegram' | 'other' | null
          content_category: string | null
          fraud_score: number
          payout_hold_days: number
          total_clicks: number
          total_leads: number
          total_earned: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['affiliate_profiles']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['affiliate_profiles']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          destination_url: string
          whatsapp_number: string
          whatsapp_template: string | null
          status: 'active' | 'paused' | 'ended'
          geo_allowlist: string[] | null
          geo_blocklist: string[] | null
          daily_lead_cap: number | null
          total_lead_cap: number | null
          payout_per_lead: number
          content_payout_min: number | null
          content_payout_max: number | null
          starts_at: string | null
          ends_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      affiliate_links: {
        Row: {
          id: string
          affiliate_id: string
          campaign_id: string
          short_code: string
          full_url: string
          source_tag: string | null
          platform_tag: string | null
          city_tag: string | null
          language_tag: string | null
          is_active: boolean
          total_clicks: number
          total_leads: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['affiliate_links']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['affiliate_links']['Insert']>
      }
      leads: {
        Row: {
          id: string
          affiliate_id: string
          campaign_id: string
          click_id: string | null
          wa_message_id: string | null
          phone_hash: string
          phone_last4: string | null
          status: 'captured' | 'wa_clicked' | 'message_received' | 'duplicate_check' | 'qualified' | 'hold' | 'rejected' | 'payable' | 'paid'
          fraud_score: number
          is_duplicate: boolean
          duplicate_of: string | null
          geo_eligible: boolean
          rejection_reason: string | null
          qualified_at: string | null
          payable_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      wallets: {
        Row: {
          id: string
          affiliate_id: string
          pending_balance: number
          approved_balance: number
          on_hold_balance: number
          withdrawn_total: number
          reversed_total: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['wallets']['Row'], 'id' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['wallets']['Insert']>
      }
      commission_ledger: {
        Row: {
          id: string
          affiliate_id: string
          lead_id: string | null
          campaign_id: string | null
          entry_type: 'lead_bonus' | 'content_bonus' | 'milestone_bonus' | 'contest_bonus' | 'manual_credit' | 'reversal' | 'hold' | 'release'
          amount: number
          status: 'pending' | 'approved' | 'on_hold' | 'reversed' | 'paid'
          hold_until: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['commission_ledger']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['commission_ledger']['Insert']>
      }
      withdrawal_requests: {
        Row: {
          id: string
          affiliate_id: string
          amount: number
          method: 'upi' | 'bank_transfer'
          upi_id: string | null
          bank_account: string | null
          ifsc_code: string | null
          bank_name: string | null
          status: 'pending' | 'approved' | 'processing' | 'paid' | 'failed' | 'cancelled'
          razorpayx_payout_id: string | null
          failure_reason: string | null
          approved_by: string | null
          approved_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['withdrawal_requests']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['withdrawal_requests']['Insert']>
      }
      clicks: {
        Row: {
          id: string
          link_id: string
          affiliate_id: string
          campaign_id: string
          session_id: string
          ip_hash: string | null
          device_type: string | null
          os: string | null
          browser: string | null
          country: string | null
          state_region: string | null
          city: string | null
          referrer: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          landing_variant: string | null
          fingerprint_hash: string | null
          is_duplicate: boolean
          is_vpn: boolean
          is_bot: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clicks']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['clicks']['Insert']>
      }
    }
    Functions: {
      increment_wallet_pending: {
        Args: { p_affiliate_id: string; p_amount: number }
        Returns: void
      }
      increment_link_clicks: {
        Args: { p_link_id: string }
        Returns: void
      }
      release_held_commissions: {
        Args: Record<string, never>
        Returns: void
      }
      auth_user_id: {
        Args: Record<string, never>
        Returns: string
      }
      auth_user_role: {
        Args: Record<string, never>
        Returns: string
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}
