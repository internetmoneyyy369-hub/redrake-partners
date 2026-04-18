'use client'

import { useEffect, useState } from 'react'

const STATUS_COLORS: Record<string, string> = {
  captured: 'bg-gray-500/20 text-gray-400',
  wa_clicked: 'bg-blue-500/20 text-blue-400',
  message_received: 'bg-cyan-500/20 text-cyan-400',
  qualified: 'bg-green-500/20 text-green-400',
  hold: 'bg-yellow-500/20 text-yellow-400',
  rejected: 'bg-red-500/20 text-red-400',
  payable: 'bg-emerald-500/20 text-emerald-400',
  paid: 'bg-purple-500/20 text-purple-400',
}

interface Lead {
  id: string
  phone_last4: string | null
  status: string
  fraud_score: number
  is_duplicate: boolean
  created_at: string
  campaigns: { name: string; payout_per_lead: number } | null
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (statusFilter !== 'all') params.set('status', statusFilter)
    fetch(`/api/leads?${params}`)
      .then((r) => r.json())
      .then((d) => { setLeads(d.leads ?? []); setTotal(d.total ?? 0); setLoading(false) })
  }, [page, statusFilter])

  const statuses = ['all', 'captured', 'message_received', 'qualified', 'hold', 'rejected', 'payable', 'paid']

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-white/50 text-sm mt-1">{total} total leads</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === s
                ? 'bg-[#ff2d2d] text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="bg-white/5 rounded-xl h-14 animate-pulse" />)}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <p className="text-lg font-medium">No leads found</p>
        </div>
      ) : (
        <>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-white/40 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 text-white/40 font-medium">Campaign</th>
                  <th className="text-left px-5 py-3 text-white/40 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-white/40 font-medium">Payout</th>
                  <th className="text-left px-5 py-3 text-white/40 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white font-mono">
                      ****{lead.phone_last4 ?? '????'}
                      {lead.is_duplicate && (
                        <span className="ml-2 text-xs text-orange-400">(dup)</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-white/70">{lead.campaigns?.name ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status] ?? 'bg-white/10 text-white/50'}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/70">
                      {lead.status === 'payable' || lead.status === 'paid'
                        ? `₹${lead.campaigns?.payout_per_lead ?? 0}`
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs">
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-white/40 text-sm">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 text-sm"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * 20 >= total}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
