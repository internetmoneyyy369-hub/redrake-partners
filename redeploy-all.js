// Script to redeploy all Vercel projects
// Run with: node redeploy-all.js

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'YOUR_VERCEL_TOKEN_HERE'

const PROJECTS = [
  { name: 'redrake-admin', id: 'prj_7Sp0zxCjpqmaL16rCu3Jf5wFMKeM' },
  { name: 'redrake-affiliate', id: 'prj_VMynBNsixdNBCXPCBaI0FBhoOTCG' },
  { name: 'redrake-public', id: 'prj_gMEWxnEdTVo19RH34xh8m14f6DBb' },
]

async function redeployProject(project) {
  console.log(`\n🚀 Redeploying ${project.name}...`)
  
  try {
    const response = await fetch(`https://api.vercel.com/v13/deployments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: project.name,
        gitSource: {
          type: 'github',
          ref: 'master',
          repoId: 'internetmoneyyy369-hub/redrake-partners',
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`   ❌ Error:`, data.error?.message || data)
      return false
    }

    console.log(`   ✅ Deployment started!`)
    console.log(`   URL: https://${data.url}`)
    console.log(`   Status: ${data.readyState}`)
    return true

  } catch (error) {
    console.error(`   ❌ Error:`, error.message)
    return false
  }
}

async function redeployAll() {
  console.log('🔄 Redeploying all RedRake projects...\n')
  
  for (const project of PROJECTS) {
    await redeployProject(project)
    // Wait 2 seconds between deployments
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log('\n✅ All deployments triggered!')
  console.log('\n📊 Check deployment status:')
  console.log('https://vercel.com/dashboard')
  console.log('\n⏱️  Deployments usually take 2-3 minutes to complete.')
}

redeployAll()
