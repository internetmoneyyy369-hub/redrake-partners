// Script to disable email confirmation in Supabase
// Run with: node disable-email-confirmation.js

const SUPABASE_URL = 'https://dwsxabdgqtmohzxhmhpn.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3c3hhYmRncXRtb2h6eGhtaHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ5MzA0MiwiZXhwIjoyMDkyMDY5MDQyfQ.fa2bvOW6S6KNCfxBHT1O7V6TpTMecvEHaX2LJL22xDI'

async function testSignup() {
  const email = 'test@example.com'
  const password = 'Test@123'
  const fullName = 'Test User'

  console.log('Testing signup with:', email)

  try {
    // Try to sign up
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          full_name: fullName,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Signup failed:', data)
      console.error('\nPossible issues:')
      console.error('1. Email confirmation is enabled')
      console.error('2. User already exists')
      console.error('3. Password too weak')
      console.error('\n📝 To fix:')
      console.error('Go to: https://supabase.com/dashboard/project/dwsxabdgqtmohzxhmhpn/auth/settings')
      console.error('Find "Enable email confirmations" and turn it OFF')
      return
    }

    console.log('✅ Signup successful!')
    console.log('User ID:', data.user?.id)
    console.log('Email:', data.user?.email)
    console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No')

    if (!data.user?.email_confirmed_at) {
      console.log('\n⚠️  Email confirmation is required!')
      console.log('Go to Supabase Dashboard and disable email confirmations:')
      console.log('https://supabase.com/dashboard/project/dwsxabdgqtmohzxhmhpn/auth/settings')
    }

  } catch (error) {
    console.error('Error:', error.message)
  }
}

testSignup()
