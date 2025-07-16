"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, LayoutDashboard, Users, CalendarCheck, LogOut, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        router.push("/login") // Redirect to login page after logout
      } else {
        console.error("Admin logout failed")
      }
    } catch (error) {
      console.error("Admin logout network error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Car Inventory",
      href: "/dashboard/cars",
      icon: Car,
    },
    {
      title: "Bookings",
      href: "/dashboard/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-astronaut-blue-500" />
            <span className="text-lg font-bold text-sidebar-foreground group-data-[state=collapsed]/sidebar-wrapper:hidden">
              Admin Panel
            </span>
          </Link>
          <SidebarTrigger className="group-data-[state=collapsed]/sidebar-wrapper:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut />
                  <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
