// Script to set environment variables on Vercel
// Run with: node set-vercel-env.js

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'YOUR_VERCEL_TOKEN_HERE'
const VERCEL_PROJECT_ID = 'prj_placeholder' // We'll get this from API

const ENV_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://dwsxabdgqtmohzxhmhpn.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3c3hhYmRncXRtb2h6eGhtaHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTMwNDIsImV4cCI6MjA5MjA2OTA0Mn0.64f_LdbdUFlq-FBT8A-_7tZvVQW7YxO-XJph5HoOvRY',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3c3hhYmRncXRtb2h6eGhtaHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ5MzA0MiwiZXhwIjoyMDkyMDY5MDQyfQ.fa2bvOW6S6KNCfxBHT1O7V6TpTMecvEHaX2LJL22xDI',
}

async function getProjects() {
  console.log('Fetching Vercel projects...\n')
  
  try {
    const response = await fetch('https://api.vercel.com/v9/projects', {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Error fetching projects:', data)
      return
    }

    console.log('📦 Your Vercel Projects:\n')
    data.projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name}`)
      console.log(`   ID: ${project.id}`)
      console.log(`   URL: https://${project.name}.vercel.app`)
      console.log('')
    })

    // Find redrake projects
    const redrakeProjects = data.projects.filter(p => 
      p.name.includes('redrake') || p.name.includes('admin') || p.name.includes('affiliate')
    )

    if (redrakeProjects.length > 0) {
      console.log('\n🎯 RedRake Projects Found:')
      redrakeProjects.forEach(project => {
        console.log(`\n📌 ${project.name}`)
        console.log(`   Project ID: ${project.id}`)
        console.log(`   \nTo set env vars for this project, run:`)
        console.log(`   node set-vercel-env.js ${project.id}`)
      })
    }

  } catch (error) {
    console.error('Error:', error.message)
  }
}

async function setEnvVars(projectId) {
  console.log(`Setting environment variables for project: ${projectId}\n`)

  for (const [key, value] of Object.entries(ENV_VARS)) {
    try {
      console.log(`Setting ${key}...`)
      
      const response = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          type: 'encrypted',
          target: ['production', 'preview', 'development'],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error?.code === 'ENV_ALREADY_EXISTS') {
          console.log(`   ⚠️  Already exists, skipping...`)
        } else {
          console.error(`   ❌ Error:`, data.error?.message || data)
        }
      } else {
        console.log(`   ✅ Set successfully`)
      }

    } catch (error) {
      console.error(`   ❌ Error:`, error.message)
    }
  }

  console.log('\n✅ Done! Redeploy your project for changes to take effect.')
  console.log('Go to: https://vercel.com/dashboard')
}

// Main
const projectId = process.argv[2]

if (!projectId) {
  getProjects()
} else {
  setEnvVars(projectId)
}
