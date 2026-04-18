import { SignIn } from '@clerk/nextjs'

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-[#ff2d2d] font-bold text-2xl">RedRake Admin</span>
          <p className="text-white/40 text-sm mt-1">Admin access only</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-[#111] border border-white/10 shadow-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/50',
              formFieldLabel: 'text-white/60',
              formFieldInput: 'bg-white/5 border-white/10 text-white',
              footerActionLink: 'text-[#ff2d2d]',
              formButtonPrimary: 'bg-[#ff2d2d] hover:bg-[#e02020]',
            },
          }}
        />
      </div>
    </div>
  )
}
