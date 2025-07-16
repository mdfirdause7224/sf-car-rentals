"use client"
import { useEffect } from "react"
import { User, Mail, ImageIcon, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateProfile } from "@/app/profile/actions" // Declare the variable before using it

interface ProfileFormProps {
  initialName: string
  initialEmail: string
  initialAvatarUrl: string
}

export default function ProfileForm({ initialName, initialEmail, initialAvatarUrl }: ProfileFormProps) {
  const [state, formAction, isPending] = updateProfile({
    // Use the declared variable
    success: false,
    message: "",
  })

  // You might want to manage form inputs with useState if you need controlled components
  // For simplicity, we'll let the form handle its own state via FormData for the action.
  // However, for displaying initial values, we use defaultValue or controlled inputs.

  useEffect(() => {
    if (state.message) {
      // Optionally clear message after some time
      const timer = setTimeout(() => {
        // Directly mutate for simplicity, or use a local state for message
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state]) // Use state as the dependency

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <Alert className={`mb-4 ${state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          {state.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={`${state.success ? "text-green-800" : "text-red-800"} font-medium`}>
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-astronaut-blue-800 font-bold text-sm">
          Full Name
        </Label>
        <div className="relative">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your full name"
            defaultValue={initialName}
            required
            className={`pl-12 border-2 rounded-2xl py-6 text-base font-medium ${
              state.errors?.fullName
                ? "border-red-300 focus:border-red-400"
                : "border-astronaut-blue-200 focus:border-astronaut-blue-400"
            }`}
          />
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
        </div>
        {state.errors?.fullName && <p className="text-red-600 text-sm font-medium">{state.errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-astronaut-blue-800 font-bold text-sm">
          Email Address
        </Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@example.com"
            defaultValue={initialEmail}
            disabled // Email is typically not editable directly via profile form
            className="pl-12 border-2 border-astronaut-blue-200 rounded-2xl py-6 text-base font-medium bg-gray-100 cursor-not-allowed"
          />
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
        </div>
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Contact support for changes.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl" className="text-astronaut-blue-800 font-bold text-sm">
          Avatar URL (Optional)
        </Label>
        <div className="relative">
          <Input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            placeholder="https://example.com/your-avatar.jpg"
            defaultValue={initialAvatarUrl}
            className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
          />
          <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-2xl py-6 text-lg font-bold shadow-xl active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          <span>Update Profile</span>
        )}
      </Button>
    </form>
  )
}
