'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Clock, CheckCircle, Lock } from 'lucide-react'

interface Wallet {
  pending_balance: number
  approved_balance: number
  on_hold_balance: number
  withdrawn_total: number
}

interface LedgerEntry {
  id: string
  entry_type: string
  amount: number
  status: string
  description: string | null
  hold_until: string | null
  created_at: string
}

const ENTRY_COLORS: Record<string, string> = {
  lead_bonus: 'text-green-400',
  content_bonus: 'text-blue-400',
  milestone_bonus: 'text-purple-400',
  manual_credit: 'text-cyan-400',
  reversal: 'text-red-400',
  hold: 'text-yellow-400',
  release: 'text-emerald-400',
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [ledger, setLedger] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('/api/wallet').then((r) => r.json()),
      fetch(`/api/wallet/ledger?page=${page}`).then((r) => r.json()),
    ]).then(([walletData, ledgerData]) => {
      setWallet(walletData.wallet)
      setLedger(ledgerData.entries ?? [])
      setTotal(ledgerData.total ?? 0)
      setLoading(false)
    })
  }, [page])

  const MIN_WITHDRAWAL = 500

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet</h1>
          <p className="text-white/50 text-sm mt-1">Your earnings and transaction history</p>
        </div>
        {wallet && wallet.approved_balance >= MIN_WITHDRAWAL && (
          <Link
            href="/wallet/withdraw"
            className="flex items-center gap-2 bg-[#ff2d2d] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e02020] transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </Link>
        )}
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Approved', value: wallet?.approved_balance ?? 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Pending', value: wallet?.pending_balance ?? 0, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'On Hold', value: wallet?.on_hold_balance ?? 0, icon: Lock, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
          { label: 'Withdrawn', value: wallet?.withdrawn_total ?? 0, icon: ArrowUpRight, color: 'text-white/60', bg: 'bg-white/5 border-white/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`border rounded-xl p-5 ${bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-white/50 text-xs font-medium">{label}</span>
            </div>
            <div className={`text-2xl font-black ${color}`}>₹{value.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {wallet && wallet.approved_balance < MIN_WITHDRAWAL && wallet.approved_balance > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 text-yellow-400 text-sm">
          ₹{(MIN_WITHDRAWAL - wallet.approved_balance).toFixed(2)} more needed to unlock withdrawal (min ₹{MIN_WITHDRAWAL})
        </div>
      )}

      {/* Ledger */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Transaction History</h2>
        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map(i => <div key={i} className="bg-white/5 rounded-xl h-14 animate-pulse" />)}
          </div>
        ) : ledger.length === 0 ? (
          <div className="text-center py-12 text-white/40">No transactions yet</div>
        ) : (
          <>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Type</th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Description</th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Status</th>
                    <th className="text-right px-5 py-3 text-white/40 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold ${ENTRY_COLORS[entry.entry_type] ?? 'text-white/60'}`}>
                          {entry.entry_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-white/60 text-xs">{entry.description ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-white/50">{entry.status}</span>
                      </td>
                      <td className={`px-5 py-3 text-right font-bold ${entry.entry_type === 'reversal' ? 'text-red-400' : 'text-green-400'}`}>
                        {entry.entry_type === 'reversal' ? '-' : '+'}₹{Math.abs(entry.amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-white/40 text-xs">
                        {new Date(entry.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-white/40 text-sm">{total} total entries</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 text-sm">← Prev</button>
                <button onClick={() => setPage(p => p+1)} disabled={page*20>=total} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 text-sm">Next →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
