"use client"

import { Wifi, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-black text-astronaut-blue-900">You're Offline</CardTitle>
          <CardDescription className="text-astronaut-blue-600 text-base">
            No internet connection detected. Please check your connection and try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-astronaut-blue-50 p-4 rounded-2xl">
            <h3 className="font-bold text-astronaut-blue-900 mb-2">What you can do:</h3>
            <ul className="space-y-2 text-sm text-astronaut-blue-700">
              <li>• Check your WiFi or mobile data connection</li>
              <li>• Try refreshing the page</li>
              <li>• Move to an area with better signal</li>
              <li>• Contact your network provider if issues persist</li>
            </ul>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-2xl py-6 font-bold active:scale-95 transition-transform duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-2 border-astronaut-blue-300 text-astronaut-blue-700 rounded-2xl py-6 font-bold active:scale-95 transition-transform duration-200 bg-transparent"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
