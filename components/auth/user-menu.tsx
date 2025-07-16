"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, LogIn, LogOut, Loader2, Settings, CalendarCheck } from "lucide-react" // Added CalendarCheck icon
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Session } from "@supabase/supabase-js" // Import Session type

interface UserMenuProps {
  initialSession: Session | null
}

export default function UserMenu({ initialSession }: UserMenuProps) {
  const [user, setUser] = useState<any>(initialSession?.user || null)
  const [isLoading, setIsLoading] = useState(false) // Set to false initially as we have initialSession
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    // If initialSession is provided, we don't need to fetch immediately.
    // We only need to listen for *changes* after the initial render.
    setIsLoading(false) // Ensure loading is false after initial render

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [supabase]) // Depend on supabase to re-subscribe if client changes (unlikely but good practice)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        setUser(null)
        router.push("/login") // Redirect to login page after logout
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Logout network error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full animate-pulse">
        <Loader2 className="h-5 w-5 text-astronaut-blue-500 animate-spin" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-astronaut-blue-200 shadow-sm hover:bg-astronaut-blue-50"
        >
          <User className="h-5 w-5 text-astronaut-blue-700" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border-astronaut-blue-100 shadow-lg rounded-xl p-2">
        {user ? (
          <>
            <DropdownMenuLabel className="font-bold text-astronaut-blue-900 px-3 py-2">
              {user.user_metadata?.full_name || user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-astronaut-blue-100" />
            <DropdownMenuItem
              asChild
              className="flex items-center space-x-2 px-3 py-2 text-astronaut-blue-700 hover:bg-astronaut-blue-50 rounded-lg cursor-pointer"
            >
              <Link href="/profile">
                <Settings className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="flex items-center space-x-2 px-3 py-2 text-astronaut-blue-700 hover:bg-astronaut-blue-50 rounded-lg cursor-pointer"
            >
              <Link href="/my-bookings">
                <CalendarCheck className="h-4 w-4" />
                <span>My Bookings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
            >
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-bold text-astronaut-blue-900 px-3 py-2">Guest User</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-astronaut-blue-100" />
            <DropdownMenuItem
              asChild
              className="flex items-center space-x-2 px-3 py-2 text-astronaut-blue-700 hover:bg-astronaut-blue-50 rounded-lg cursor-pointer"
            >
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="flex items-center space-x-2 px-3 py-2 text-astronaut-blue-700 hover:bg-astronaut-blue-50 rounded-lg cursor-pointer"
            >
              <Link href="/signup">
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
