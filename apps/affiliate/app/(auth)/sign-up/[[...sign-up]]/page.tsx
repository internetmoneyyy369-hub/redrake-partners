import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-[#111] border border-white/10 shadow-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-white/50',
            socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
            formFieldLabel: 'text-white/60',
            formFieldInput: 'bg-white/5 border-white/10 text-white',
            footerActionLink: 'text-[#ff2d2d]',
            formButtonPrimary: 'bg-[#ff2d2d] hover:bg-[#e02020]',
          },
        }}
      />
    </div>
  )
}
