import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// This is a server-side Supabase client
export const createServerClient = () => {
  const cookieStore = cookies()

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server-side
    {
      auth: {
        // This is important for server-side rendering with Supabase Auth
        // It ensures that the session is read from and written to cookies
        // allowing Next.js server components to access the user session.
        storage: {
          getItem: (key) => cookieStore.get(key)?.value,
          setItem: (key, value) => cookieStore.set(key, value),
          removeItem: (key) => cookieStore.delete(key),
        },
      },
    },
  )
}
