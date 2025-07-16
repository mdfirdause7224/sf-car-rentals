import type React from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Basic authentication check: redirect if no user is logged in
  // For a real admin dashboard, you'd also check user roles/permissions here.
  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {" "}
      {/* Sidebar is open by default */}
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/90 backdrop-blur-xl shadow-sm">
          {/* Mobile trigger for sidebar */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <h1 className="text-xl font-bold text-astronaut-blue-900">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-astronaut-blue-50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
