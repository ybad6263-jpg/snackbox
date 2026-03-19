import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // 1. Await the cookies() promise to fix the "Property 'get' does not exist" error
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // 2. Exchange the code for a real Session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 3. Success! Your PostgreSQL Trigger will now fire and create the Profile row.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback if something fails
  return NextResponse.redirect(`${origin}/`)
}