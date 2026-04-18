import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="text-[#ff2d2d] font-bold text-xl tracking-tight">RedRake Partners</span>
        <Link
          href="/apply"
          className="bg-[#ff2d2d] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#e02020] transition-colors"
        >
          Apply as Promoter
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-[#ff2d2d]/10 border border-[#ff2d2d]/30 text-[#ff2d2d] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          India&apos;s #1 iGaming Affiliate Program
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Earn ₹25–₹50
          <br />
          <span className="text-[#ff2d2d]">Per Qualified Lead</span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
          Share your unique link. When someone clicks and messages on WhatsApp — you earn.
          No hidden conditions. Weekly payouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/apply"
            className="bg-[#ff2d2d] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#e02020] transition-colors"
          >
            Start Earning Today
          </Link>
          <Link
            href="/how-it-works"
            className="border border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/5 transition-colors"
          >
            How It Works
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { value: '₹25+', label: 'Per Lead' },
          { value: '7 Days', label: 'Payout Hold' },
          { value: '5 Tiers', label: 'Earning Levels' },
          { value: '24/7', label: 'Real-time Tracking' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-[#ff2d2d] mb-1">{stat.value}</div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </div>
        ))}
      </section>
    </main>
  )
}
