'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const step1Schema = z.object({
  full_name: z.string().min(2, 'Name required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid Indian mobile number required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  language: z.enum(['en', 'hi', 'te', 'ta', 'mr', 'bn']),
})

const step2Schema = z.object({
  platform: z.enum(['instagram', 'youtube', 'twitter', 'telegram', 'other']),
  handle: z.string().min(2, 'Handle required'),
  profile_url: z.string().url('Valid URL required'),
  followers: z.coerce.number().min(1000, 'Minimum 1000 followers required'),
})

type Step1 = z.infer<typeof step1Schema>
type Step2 = z.infer<typeof step2Schema>

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1 | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema) })

  const onStep1 = (data: Step1) => {
    setStep1Data(data)
    setStep(2)
  }

  const onStep2 = async (data: Step2) => {
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...step1Data, ...data }),
    })
    if (res.ok) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Application Received</h2>
          <p className="text-white/60">We&apos;ll review your application within 2–3 business days.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="text-[#ff2d2d] font-bold text-xl mb-2">RedRake Partners</div>
          <h1 className="text-3xl font-black">Apply as Promoter</h1>
          <div className="flex gap-2 mt-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#ff2d2d]' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Full Name</label>
              <input
                {...form1.register('full_name')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                placeholder="Your full name"
              />
              {form1.formState.errors.full_name && (
                <p className="text-red-400 text-xs mt-1">{form1.formState.errors.full_name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Mobile Number</label>
              <input
                {...form1.register('phone')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                placeholder="10-digit mobile number"
              />
              {form1.formState.errors.phone && (
                <p className="text-red-400 text-xs mt-1">{form1.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">City</label>
                <input
                  {...form1.register('city')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">State</label>
                <input
                  {...form1.register('state')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                  placeholder="Maharashtra"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Preferred Language</label>
              <select
                {...form1.register('language')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="te">Telugu</option>
                <option value="ta">Tamil</option>
                <option value="mr">Marathi</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#ff2d2d] text-white py-3 rounded-lg font-bold hover:bg-[#e02020] transition-colors"
            >
              Continue →
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Primary Platform</label>
              <select
                {...form2.register('platform')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
              >
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="telegram">Telegram</option>
                <option value="twitter">Twitter/X</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Handle / Username</label>
              <input
                {...form2.register('handle')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                placeholder="@yourhandle"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Profile URL</label>
              <input
                {...form2.register('profile_url')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Follower Count</label>
              <input
                {...form2.register('followers')}
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                placeholder="10000"
              />
              {form2.formState.errors.followers && (
                <p className="text-red-400 text-xs mt-1">{form2.formState.errors.followers.message}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#ff2d2d] text-white py-3 rounded-lg font-bold hover:bg-[#e02020] transition-colors"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
