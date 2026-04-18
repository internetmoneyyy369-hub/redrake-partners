'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Copy, ExternalLink, BarChart2, MousePointer, Users } from 'lucide-react'

interface AffiliateLink {
  id: string
  short_code: string
  full_url: string
  source_tag: string | null
  platform_tag: string | null
  total_clicks: number
  total_leads: number
  is_active: boolean
  created_at: string
  campaigns: { name: string } | null
}

export default function LinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/links')
      .then((r) => r.json())
      .then((d) => { setLinks(d.links ?? []); setLoading(false) })
  }, [])

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Affiliate Links</h1>
          <p className="text-white/50 text-sm mt-1">Create and manage your tracking links</p>
        </div>
        <Link
          href="/links/new"
          className="flex items-center gap-2 bg-[#ff2d2d] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e02020] transition-colors"
        >
          <Plus className="w-4 h-4" /> New Link
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <MousePointer className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No links yet</p>
          <p className="text-sm mt-1">Create your first affiliate link to start tracking</p>
          <Link
            href="/links/new"
            className="inline-flex items-center gap-2 mt-6 bg-[#ff2d2d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e02020] transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Link
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-sm">
                    {link.campaigns?.name ?? 'Unknown Campaign'}
                  </span>
                  {link.source_tag && (
                    <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                      {link.source_tag}
                    </span>
                  )}
                  {link.platform_tag && (
                    <span className="bg-[#ff2d2d]/10 text-[#ff2d2d] text-xs px-2 py-0.5 rounded-full">
                      {link.platform_tag}
                    </span>
                  )}
                  {!link.is_active && (
                    <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-xs font-mono truncate">{link.full_url}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-white/60">
                    <MousePointer className="w-3 h-3" />
                    <span className="font-semibold text-white">{link.total_clicks.toLocaleString()}</span>
                  </div>
                  <div className="text-white/30 text-xs">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-white/60">
                    <Users className="w-3 h-3" />
                    <span className="font-semibold text-white">{link.total_leads.toLocaleString()}</span>
                  </div>
                  <div className="text-white/30 text-xs">Leads</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyLink(link.full_url, link.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title="Copy link"
                >
                  {copied === link.id ? (
                    <span className="text-green-400 text-xs font-semibold">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={link.full_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
