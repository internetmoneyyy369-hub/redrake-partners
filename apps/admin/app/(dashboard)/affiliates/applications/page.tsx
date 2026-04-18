'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface Application {
  id: string
  full_name: string
  phone: string | null
  city: string | null
  state: string | null
  primary_platform: string | null
  follower_count: number | null
  status: string
  created_at: string
  users: { email: string } | null
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/affiliates?status=pending&limit=50')
      .then((r) => r.json())
      .then((d) => { setApplications(d.affiliates ?? []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const approve = async (id: string) => {
    setActionLoading(id)
    await fetch(`/api/affiliates/${id}/approve`, { method: 'PATCH' })
    setActionLoading(null)
    load()
  }

  const reject = async (id: string) => {
    if (!rejectReason.trim()) return
    setActionLoading(id)
    await fetch(`/api/affiliates/${id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReason }),
    })
    setActionLoading(null)
    setRejectTarget(null)
    setRejectReason('')
    load()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Pending Applications</h1>
        <p className="text-white/50 text-sm mt-1">{applications.length} awaiting review</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white/5 rounded-xl h-24 animate-pulse" />)}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No pending applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-semibold">{app.full_name}</span>
                    <span className="text-white/40 text-xs">{app.users?.email}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-white/50">
                    {app.primary_platform && <span>📱 {app.primary_platform}</span>}
                    {app.follower_count && <span>👥 {app.follower_count.toLocaleString()} followers</span>}
                    {app.city && <span>📍 {app.city}, {app.state}</span>}
                    {app.phone && <span>📞 {app.phone}</span>}
                    <span>🕐 {new Date(app.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rejectTarget === app.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Rejection reason..."
                        className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs w-48 focus:outline-none focus:border-red-500"
                      />
                      <button
                        onClick={() => reject(app.id)}
                        disabled={!rejectReason.trim() || actionLoading === app.id}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => { setRejectTarget(null); setRejectReason('') }}
                        className="text-white/40 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => approve(app.id)}
                        disabled={actionLoading === app.id}
                        className="flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-500/30 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectTarget(app.id)}
                        className="flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
