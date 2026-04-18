'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  campaign_id: z.string().min(1, 'Select a campaign'),
  source_tag: z.enum(['reel', 'bio', 'story', 'video', 'dm', 'other']),
  platform_tag: z.enum(['instagram', 'youtube', 'telegram', 'twitter', 'other']),
  city_tag: z.string().optional(),
  language_tag: z.enum(['en', 'hi', 'te', 'ta', 'mr', 'bn']),
})

type FormData = z.infer<typeof schema>

interface Campaign {
  id: string
  name: string
  payout_per_lead: number
}

export default function NewLinkPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { source_tag: 'reel', platform_tag: 'instagram', language_tag: 'en' },
  })

  useEffect(() => {
    fetch('/api/links/campaigns')
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns ?? []))
  }, [])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.link?.full_url) {
      setCreatedLink(result.link.full_url)
    }
    setLoading(false)
  }

  const copyLink = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (createdLink) {
    return (
      <div className="p-8 max-w-lg">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
          <div className="text-green-400 font-bold text-lg mb-2">✅ Link Created!</div>
          <p className="text-white/60 text-sm">Your tracking link is ready to share.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3">
            <code className="flex-1 text-white/80 text-sm font-mono break-all">{createdLink}</code>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 bg-[#ff2d2d] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#e02020] transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl">
            <QRCodeSVG value={createdLink} size={180} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCreatedLink(null)}
            className="flex-1 border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors"
          >
            Create Another
          </button>
          <Link
            href="/links"
            className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors text-center"
          >
            View All Links
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/links" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Link</h1>
          <p className="text-white/50 text-sm mt-0.5">Tag your link for better analytics</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm text-white/60 mb-1.5">Campaign *</label>
          <select
            {...register('campaign_id')}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
          >
            <option value="">Select a campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — ₹{c.payout_per_lead}/lead
              </option>
            ))}
          </select>
          {errors.campaign_id && <p className="text-red-400 text-xs mt-1">{errors.campaign_id.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Source</label>
            <select
              {...register('source_tag')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
            >
              {['reel', 'bio', 'story', 'video', 'dm', 'other'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Platform</label>
            <select
              {...register('platform_tag')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
            >
              {['instagram', 'youtube', 'telegram', 'twitter', 'other'].map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">City (optional)</label>
            <input
              {...register('city_tag')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
              placeholder="Mumbai"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Language</label>
            <select
              {...register('language_tag')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
            >
              {[['en','English'],['hi','Hindi'],['te','Telugu'],['ta','Tamil'],['mr','Marathi'],['bn','Bengali']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff2d2d] text-white py-3 rounded-lg font-bold hover:bg-[#e02020] transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Generate Link'}
        </button>
      </form>
    </div>
  )
}
