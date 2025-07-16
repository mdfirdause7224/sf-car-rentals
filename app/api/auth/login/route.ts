import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "Login successful!", user: data.user })
}
