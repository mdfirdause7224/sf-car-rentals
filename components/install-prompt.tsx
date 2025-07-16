"use client"

import { useState, useEffect } from "react"
import { Download, X, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if app is already installed
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallPrompt(false)
    }

    // Show iOS install prompt if on iOS and not in standalone mode
    if (typeof window !== "undefined" && isIOSDevice && !(window.navigator as any).standalone) {
      setShowInstallPrompt(true)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("installPromptDismissed", "true")
    }
  }

  // Don't show if user previously dismissed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("installPromptDismissed")
      if (dismissed) {
        setShowInstallPrompt(false)
      }
    }
  }, [])

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-astronaut-blue-900 text-sm">Install SF Car Rentals</h3>
              <p className="text-xs text-astronaut-blue-600">
                {isIOS ? "Tap Share → Add to Home Screen" : "Install our app for faster booking"}
              </p>
            </div>
            <div className="flex space-x-2">
              {!isIOS && (
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-xl px-4 py-2 text-xs font-bold active:scale-95 transition-transform duration-200"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Install
                </Button>
              )}
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="rounded-xl p-2 active:scale-95 transition-transform duration-200"
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
