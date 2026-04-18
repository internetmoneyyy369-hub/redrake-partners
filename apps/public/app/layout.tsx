import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'RedRake Partners — Earn by Promoting iGaming',
  description:
    'Join India\'s fastest-growing iGaming affiliate program. Earn ₹25–₹50 per qualified lead.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
