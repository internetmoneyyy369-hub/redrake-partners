import { createSupabaseAuthClient } from '@redrake/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, fullName } = body

    console.log('[ADMIN SIGNUP] Attempting signup for:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseAuthClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'admin',
        },
      },
    })

    if (error) {
      console.error('[ADMIN SIGNUP] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[ADMIN SIGNUP] Success for:', email, 'User ID:', data.user?.id)
    return NextResponse.json({ user: data.user })
  } catch (error: any) {
    console.error('[ADMIN SIGNUP] Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
