import { createClient } from "@supabase/supabase-js"

// This is a client-side Supabase client (singleton pattern)
// The instance is stored in a module-scoped variable, ensuring it's created only once
// when the module is first imported on the client side.
let supabaseClient: ReturnType<typeof createClient> | null = null

export const createBrowserClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return supabaseClient
}
