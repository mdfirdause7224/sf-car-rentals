"use client"

import { useState, useEffect, useCallback } from "react"
import { Download, X, Smartphone, Loader2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPromptUI, setShowPromptUI] = useState(false) // Controls visibility of the entire prompt card
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false) // For Android: when prompt is shown
  const [isInstalled, setIsInstalled] = useState(false) // When app is successfully installed

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Check if app is already installed (standalone mode)
    const isStandalone = typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches
    if (isStandalone) {
      setIsInstalled(true) // App is already installed
      setShowPromptUI(false) // No need to show prompt
      return
    }

    // For iOS, if not in standalone mode, always show instructions
    if (isIOSDevice) {
      setShowPromptUI(true)
    }

    // Listen for the beforeinstallprompt event for Android/desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPromptUI(true) // Show prompt for Android/desktop
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log("PWA was installed")
      setIsInstalled(true)
      setShowPromptUI(false) // Hide the prompt after successful installation
      if (typeof window !== "undefined") {
        localStorage.setItem("installPromptDismissed", "true") // Mark as dismissed to prevent future prompts
      }
    }
    window.addEventListener("appinstalled", handleAppInstalled)

    // Check if user previously dismissed the prompt
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("installPromptDismissed")
      if (dismissed === "true") {
        setShowPromptUI(false)
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      setIsInstalling(true) // Show installing state
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setIsInstalling(false) // Hide installing state
      setDeferredPrompt(null) // Clear prompt
      if (outcome === "accepted") {
        // The appinstalled event will handle setting isInstalled and hiding the UI
      } else {
        setShowPromptUI(false) // User dismissed the prompt
        if (typeof window !== "undefined") {
          localStorage.setItem("installPromptDismissed", "true")
        }
      }
    }
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setShowPromptUI(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("installPromptDismissed", "true")
    }
  }, [])

  if (!showPromptUI) return null

  // If already installed, don't show anything
  if (isInstalled) return null

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
              {isIOS ? (
                <p className="text-xs text-astronaut-blue-600">
                  Tap <Share2 className="inline-block h-3 w-3 mx-0.5" /> then 'Add to Home Screen'
                </p>
              ) : (
                <p className="text-xs text-astronaut-blue-600">Install our app for faster booking and offline access</p>
              )}
            </div>
            <div className="flex space-x-2">
              {isInstalling ? (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-xl px-4 py-2 text-xs font-bold"
                  disabled
                >
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Installing...
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
