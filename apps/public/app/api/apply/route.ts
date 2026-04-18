import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { WelcomeEmail } from '@redrake/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const resend = new Resend(process.env.RESEND_API_KEY)

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', body.email ?? '')
      .single()

    if (existingUser) {
      return Response.json({ error: 'Application already submitted' }, { status: 409 })
    }

    // 2. Create affiliate_profile (user will be created via Clerk webhook on signup)
    // For now, store application data — user creation happens post-Clerk signup
    // This route is called after Clerk signup completes

    // 3. Send welcome email
    if (body.email) {
      await resend.emails.send({
        from: 'RedRake Partners <no-reply@redrake.io>',
        to: body.email,
        subject: 'Application received — RedRake Partners',
        html: await render(WelcomeEmail({ name: body.full_name })),
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('[apply]', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
