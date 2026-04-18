// Check if environment variables are set
console.log('Checking environment variables...\n')

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

const missing = []

required.forEach(key => {
  if (process.env[key]) {
    console.log(`✅ ${key}: ${process.env[key].substring(0, 30)}...`)
  } else {
    console.log(`❌ ${key}: NOT SET`)
    missing.push(key)
  }
})

if (missing.length > 0) {
  console.log('\n⚠️  Missing environment variables!')
  console.log('\nAdd these to Vercel:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://dwsxabdgqtmohzxhmhpn.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3c3hhYmRncXRtb2h6eGhtaHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTMwNDIsImV4cCI6MjA5MjA2OTA0Mn0.64f_LdbdUFlq-FBT8A-_7tZvVQW7YxO-XJph5HoOvRY')
} else {
  console.log('\n✅ All environment variables are set!')
}
