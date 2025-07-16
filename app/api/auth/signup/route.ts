import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const { email, password, name } = await request.json()
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name, // Store full name in user metadata
      },
    },
  })

  if (error) {
    console.error("Signup error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Optionally, insert into a public 'profiles' table for more user data
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, full_name: name, email: data.user.email })

    if (profileError) {
      console.error("Profile creation error:", profileError.message)
      // You might want to handle this more gracefully, e.g., delete the user if profile creation fails
      return NextResponse.json({ error: "User created but profile failed to save." }, { status: 500 })
    }
  }

  return NextResponse.json({ message: "Signup successful! Please check your email for verification." })
}
