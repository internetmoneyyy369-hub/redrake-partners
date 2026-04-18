import { createSupabaseServerClient } from '@redrake/db'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  captured: 'bg-gray-500/20 text-gray-400',
  message_received: 'bg-cyan-500/20 text-cyan-400',
  qualified: 'bg-green-500/20 text-green-400',
  hold: 'bg-yellow-500/20 text-yellow-400',
  rejected: 'bg-red-500/20 text-red-400',
  payable: 'bg-emerald-500/20 text-emerald-400',
  paid: 'bg-purple-500/20 text-purple-400',
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status
  const page = parseInt(params.page ?? '1')
  const limit = 25

  const supabase = createSupabaseServerClient()
  let query = supabase
    .from('leads')
    .select('*, affiliate_profiles(full_name), campaigns(name, payout_per_lead)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status as any)

  const { data: leads, count } = await query

  const statuses = ['all', 'message_received', 'qualified', 'hold', 'rejected', 'payable', 'paid']

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Lead Center</h1>
        <p className="text-white/50 text-sm mt-1">{count ?? 0} total leads</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/leads' : `/leads?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              (s === 'all' && !status) || s === status
                ? 'bg-[#ff2d2d] text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-white/40 font-medium">Phone</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Affiliate</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Campaign</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Fraud</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Payout</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Date</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead) => (
              <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 text-white font-mono text-xs">
                  ****{lead.phone_last4 ?? '????'}
                  {lead.is_duplicate && <span className="ml-1 text-orange-400">(dup)</span>}
                </td>
                <td className="px-5 py-3 text-white/70 text-xs">{(lead as any).affiliate_profiles?.full_name ?? '—'}</td>
                <td className="px-5 py-3 text-white/70 text-xs">{(lead as any).campaigns?.name ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status] ?? 'bg-white/10 text-white/50'}`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold ${lead.fraud_score >= 60 ? 'text-red-400' : lead.fraud_score >= 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {lead.fraud_score}
                  </span>
                </td>
                <td className="px-5 py-3 text-white/70 text-xs">
                  {['payable','paid'].includes(lead.status) ? `₹${(lead as any).campaigns?.payout_per_lead ?? 0}` : '—'}
                </td>
                <td className="px-5 py-3 text-white/40 text-xs">
                  {new Date(lead.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-5 py-3">
                  <Link href={`/leads/${lead.id}`} className="text-[#ff2d2d] text-xs hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
