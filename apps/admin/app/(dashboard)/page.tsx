import { requireAuth } from '@redrake/db'
import { createSupabaseServerClient } from '@redrake/db'

export default async function AdminDashboard() {
  await requireAuth()

  const supabase = createSupabaseServerClient()

  const [affiliatesRes, leadsRes, pendingPayoutsRes] = await Promise.all([
    supabase.from('affiliate_profiles').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'qualified'),
    supabase.from('withdrawal_requests').select('amount').eq('status', 'pending'),
  ])

  const pendingPayout = (pendingPayoutsRes.data ?? []).reduce((sum, r) => sum + Number(r.amount), 0)

  const kpis = [
    { label: 'Active Affiliates', value: affiliatesRes.count ?? 0, color: 'text-green-400' },
    { label: 'Qualified Leads', value: leadsRes.count ?? 0, color: 'text-blue-400' },
    { label: 'Payout Liability', value: `₹${pendingPayout.toFixed(2)}`, color: 'text-[#ff2d2d]' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Master Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-white/50 text-sm mb-2">{kpi.label}</div>
            <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
