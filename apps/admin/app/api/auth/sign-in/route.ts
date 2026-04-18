import { createSupabaseAuthClient } from '@redrake/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('[SIGNIN] Attempting sign-in for:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseAuthClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[SIGNIN] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[SIGNIN] Success for:', email, 'User ID:', data.user?.id)
    return NextResponse.json({ user: data.user })
  } catch (error: any) {
    console.error('[SIGNIN] Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Sign in failed' },
      { status: 500 }
    )
  }
}
