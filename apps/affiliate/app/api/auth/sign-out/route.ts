import { createSupabaseAuthClient } from '@redrake/db'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createSupabaseAuthClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'))
}
