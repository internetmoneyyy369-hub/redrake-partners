// Script to create admin user in Supabase
// Run with: node create-admin-user.js

const SUPABASE_URL = 'https://dwsxabdgqtmohzxhmhpn.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3c3hhYmRncXRtb2h6eGhtaHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ5MzA0MiwiZXhwIjoyMDkyMDY5MDQyfQ.fa2bvOW6S6KNCfxBHT1O7V6TpTMecvEHaX2LJL22xDI'

async function createAdminUser() {
  const email = 'sjdfreakdeals@gmail.com'
  const password = 'Admin@123' // Change this to a secure password
  const fullName = 'Admin User'

  console.log('Creating admin user:', email)

  try {
    // Create user in Supabase Auth
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: fullName,
          role: 'admin',
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Error creating user:', data)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('User ID:', data.id)
    console.log('Email:', data.email)
    console.log('\nYou can now sign in at:')
    console.log('https://redrake-admin.vercel.app/sign-in')
    console.log('\nCredentials:')
    console.log('Email:', email)
    console.log('Password:', password)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

createAdminUser()
