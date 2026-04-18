import { createSupabaseServerClient } from '@redrake/db'
import { currentUser } from '@clerk/nextjs/server'

export default async function OverviewPage() {
  const user = await currentUser()
  if (!user) return null

  const supabase = createSupabaseServerClient()

  // Get affiliate profile
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', user.id)
    .single()

  const { data: profile } = dbUser
    ? await supabase
        .from('affiliate_profiles')
        .select('*, wallets(*)')
        .eq('user_id', dbUser.id)
        .single()
    : { data: null }

  const wallet = (profile as any)?.wallets

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user.firstName ?? 'Affiliate'} 👋
        </h1>
        <p className="text-white/50 text-sm mt-1">Here&apos;s your performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Balance', value: `₹${wallet?.pending_balance?.toFixed(2) ?? '0.00'}`, color: 'text-yellow-400' },
          { label: 'Approved Balance', value: `₹${wallet?.approved_balance?.toFixed(2) ?? '0.00'}`, color: 'text-green-400' },
          { label: 'On Hold', value: `₹${wallet?.on_hold_balance?.toFixed(2) ?? '0.00'}`, color: 'text-orange-400' },
          { label: 'Total Earned', value: `₹${profile?.total_earned?.toFixed(2) ?? '0.00'}`, color: 'text-[#ff2d2d]' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-white/50 text-xs mb-2">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Status banner */}
      {profile?.status === 'pending' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-400 text-sm">
          ⏳ Your application is under review. You&apos;ll be notified once approved.
        </div>
      )}
      {profile?.status === 'approved' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
          ✅ Account active — Tier: <strong>{profile.tier}</strong> · Total Clicks: {profile.total_clicks} · Total Leads: {profile.total_leads}
        </div>
      )}
    </div>
  )
}
