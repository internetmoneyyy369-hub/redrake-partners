'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const schema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('upi'),
    amount: z.coerce.number().min(500, 'Minimum withdrawal is ₹500'),
    upi_id: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID'),
  }),
  z.object({
    method: z.literal('bank_transfer'),
    amount: z.coerce.number().min(500, 'Minimum withdrawal is ₹500'),
    bank_account: z.string().min(8, 'Account number required'),
    ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
    bank_name: z.string().min(2, 'Bank name required'),
  }),
])

type FormData = z.infer<typeof schema>

export default function WithdrawPage() {
  const [method, setMethod] = useState<'upi' | 'bank_transfer'>('upi')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { method: 'upi' } as any,
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="p-8 max-w-lg">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Withdrawal Requested</h2>
          <p className="text-white/60 text-sm">Your request is under review. Payouts are processed within 2–3 business days.</p>
          <Link href="/wallet" className="inline-block mt-6 text-[#ff2d2d] text-sm font-semibold hover:underline">
            ← Back to Wallet
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/wallet" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Withdraw Earnings</h1>
          <p className="text-white/50 text-sm mt-0.5">Minimum withdrawal: ₹500</p>
        </div>
      </div>

      {/* Method toggle */}
      <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
        {(['upi', 'bank_transfer'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              method === m ? 'bg-[#ff2d2d] text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {m === 'upi' ? 'UPI' : 'Bank Transfer'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('method')} value={method} />

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Amount (₹)</label>
          <input
            {...register('amount')}
            type="number"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
            placeholder="500"
          />
          {'amount' in (errors as any) && (
            <p className="text-red-400 text-xs mt-1">{(errors as any).amount?.message}</p>
          )}
        </div>

        {method === 'upi' ? (
          <div>
            <label className="block text-sm text-white/60 mb-1.5">UPI ID</label>
            <input
              {...register('upi_id' as any)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
              placeholder="yourname@upi"
            />
            {'upi_id' in (errors as any) && (
              <p className="text-red-400 text-xs mt-1">{(errors as any).upi_id?.message}</p>
            )}
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Account Number</label>
              <input
                {...register('bank_account' as any)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                placeholder="Account number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">IFSC Code</label>
                <input
                  {...register('ifsc_code' as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                  placeholder="SBIN0001234"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Bank Name</label>
                <input
                  {...register('bank_name' as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff2d2d]"
                  placeholder="SBI"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff2d2d] text-white py-3 rounded-lg font-bold hover:bg-[#e02020] transition-colors disabled:opacity-50 mt-2"
        >
          {loading ? 'Submitting...' : 'Request Withdrawal'}
        </button>
      </form>
    </div>
  )
}
