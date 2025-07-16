"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsLoading(true)

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: result.message || "Signup successful! Please check your email for verification.",
        })
        // Optionally redirect after a short delay
        setTimeout(() => router.push("/login"), 3000)
      } else {
        setMessage({ type: "error", text: result.error || "Signup failed. Please try again." })
      }
    } catch (error) {
      console.error("Signup network error:", error)
      setMessage({ type: "error", text: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-scale-in">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-black text-astronaut-blue-900">Create Account</CardTitle>
          <CardDescription className="text-astronaut-blue-600 text-base">
            Join SF Car Rentals for seamless bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert
              className={`mb-4 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
            >
              {message.type === "error" ? (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription
                className={`${message.type === "error" ? "text-red-800" : "text-green-800"} font-medium`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-astronaut-blue-800 font-bold text-sm">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-astronaut-blue-800 font-bold text-sm">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-astronaut-blue-800 font-bold text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-astronaut-blue-800 font-bold text-sm">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-2xl py-6 text-lg font-bold shadow-xl active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing Up...</span>
                </div>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
          </form>
          <div className="text-center text-sm text-astronaut-blue-700">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-astronaut-blue-800 hover:underline">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
