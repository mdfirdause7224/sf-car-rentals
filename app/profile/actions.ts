"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface UpdateProfileState {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function updateProfile(prevState: UpdateProfileState, formData: FormData): Promise<UpdateProfileState> {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "User not authenticated." }
  }

  const fullName = formData.get("fullName") as string
  const avatarUrl = formData.get("avatarUrl") as string

  // Basic validation
  if (!fullName || fullName.trim().length < 3) {
    return { success: false, message: "Full Name must be at least 3 characters.", errors: { fullName: "Required" } }
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating profile:", error.message)
      return { success: false, message: `Failed to update profile: ${error.message}` }
    }

    // Revalidate the path to ensure the latest data is fetched on subsequent renders
    revalidatePath("/profile")
    revalidatePath("/") // Also revalidate home page if user menu shows name

    return { success: true, message: "Profile updated successfully!" }
  } catch (error) {
    console.error("Server action error updating profile:", error)
    return { success: false, message: "An unexpected error occurred." }
  }
}
