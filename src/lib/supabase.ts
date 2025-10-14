// src/lib/supabase.ts
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const load = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    fetch,
    cookieOptions: {
      sameSite: 'lax',
    }
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return { supabase, session }
}