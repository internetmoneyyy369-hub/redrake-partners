import { createSupabaseServerClient } from '@redrake/db'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  under_review: 'bg-blue-500/20 text-blue-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  suspended: 'bg-orange-500/20 text-orange-400',
}

export default async function AffiliatesPage({
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
    .from('affiliate_profiles')
    .select('*, users(email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status as any)

  const { data: affiliates, count } = await query

  const statuses = ['all', 'pending', 'under_review', 'approved', 'rejected', 'suspended']

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Affiliates</h1>
          <p className="text-white/50 text-sm mt-1">{count ?? 0} total</p>
        </div>
        <Link
          href="/affiliates/applications"
          className="bg-[#ff2d2d] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e02020] transition-colors"
        >
          Review Applications
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/affiliates' : `/affiliates?status=${s}`}
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
              <th className="text-left px-5 py-3 text-white/40 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Platform</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Tier</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Leads</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Earned</th>
              <th className="text-left px-5 py-3 text-white/40 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(affiliates ?? []).map((a) => (
              <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 text-white font-medium">{a.full_name}</td>
                <td className="px-5 py-3 text-white/60 text-xs">{(a as any).users?.email ?? '—'}</td>
                <td className="px-5 py-3 text-white/60 text-xs">{a.primary_platform ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-semibold text-white/70 uppercase">{a.tier}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[a.status] ?? 'bg-white/10 text-white/50'}`}>
                    {a.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-3 text-white/70">{a.total_leads}</td>
                <td className="px-5 py-3 text-green-400 font-semibold">₹{Number(a.total_earned).toFixed(0)}</td>
                <td className="px-5 py-3">
                  <Link href={`/affiliates/${a.id}`} className="text-[#ff2d2d] text-xs hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-white/40 text-sm">{count ?? 0} affiliates</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={`/affiliates?page=${page-1}${status ? `&status=${status}` : ''}`}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm">← Prev</Link>
          )}
          {(count ?? 0) > page * limit && (
            <Link href={`/affiliates?page=${page+1}${status ? `&status=${status}` : ''}`}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm">Next →</Link>
          )}
        </div>
      </div>
    </div>
  )
}
