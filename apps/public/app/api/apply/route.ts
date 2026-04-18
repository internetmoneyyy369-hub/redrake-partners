import { createSupabaseServerClient } from '@redrake/db'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { WelcomeEmail } from '@redrake/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createSupabaseServerClient()
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', body.email ?? '')
      .single()

    if (existingUser) {
      return Response.json({ error: 'Application already submitted' }, { status: 409 })
    }

    // Send welcome email
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
