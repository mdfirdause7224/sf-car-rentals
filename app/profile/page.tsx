import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import ProfileForm from "@/components/profile/profile-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User } from "lucide-react"

export default async function ProfilePage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login") // Redirect to login if no user is logged in
  }

  // Fetch profile data from the 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("Error fetching profile:", profileError.message)
    // Handle error, maybe show a generic message or redirect
    return (
      <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-black text-astronaut-blue-900">Profile Error</CardTitle>
            <CardDescription className="text-astronaut-blue-600 text-base">
              Could not load profile data. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-scale-in">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black text-astronaut-blue-900">My Profile</CardTitle>
          <CardDescription className="text-astronaut-blue-600 text-base">
            View and update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileForm
            initialName={profile?.full_name || ""}
            initialEmail={user.email || ""}
            initialAvatarUrl={profile?.avatar_url || ""}
          />
        </CardContent>
      </Card>
    </div>
  )
}
