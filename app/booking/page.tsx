"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { ArrowLeft, Calendar, MapPin, User, Phone, Mail, Car, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import PaymentForm from "@/components/payment-form"

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingData {
  name: string
  email: string
  phone: string
  carType: string
  pickupDate: string
  returnDate: string
  pickupLocation: string
  dropLocation: string
  specialRequests: string
  agreeTerms: boolean
}

interface BookingResponse {
  success: boolean
  booking?: {
    id: string
    totalAmount: number
    days: number
    dailyRate: number
    status: string
  }
  error?: string
  message?: string
}

export default function BookingPage() {
  const [formData, setFormData] = useState<BookingData>({
    name: "",
    email: "",
    phone: "",
    carType: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    dropLocation: "",
    specialRequests: "",
    agreeTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Function to calculate days and weekend status for payment intent
  const calculateBookingDetails = useCallback(() => {
    if (!formData.pickupDate || !formData.returnDate) return null

    const pickup = new Date(formData.pickupDate)
    const returnDate = new Date(formData.returnDate)

    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const isWeekend =
      pickup.getDay() === 0 || pickup.getDay() === 6 || returnDate.getDay() === 0 || returnDate.getDay() === 6

    return { days: diffDays, isWeekend }
  }, [formData.pickupDate, formData.returnDate])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Full Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^(\+91|91)?[6789]\d{9}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Invalid Indian phone number"
    }

    if (!formData.carType) newErrors.carType = "Please select a car type"
    if (!formData.pickupDate) newErrors.pickupDate = "Pickup date is required"
    if (!formData.returnDate) newErrors.returnDate = "Return date is required"
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = "Pickup location is required"
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to terms and conditions"

    // Date validation
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate)
      const returnDate = new Date(formData.returnDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (pickup < today) newErrors.pickupDate = "Pickup date cannot be in the past"
      if (returnDate <= pickup) newErrors.returnDate = "Return date must be after pickup date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBookingFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})
    setPaymentError(null)

    const bookingDetails = calculateBookingDetails()
    if (!bookingDetails) {
      setErrors({ general: "Invalid dates for booking calculation." })
      setIsSubmitting(false)
      return
    }

    try {
      // Step 1: Create Payment Intent
      const paymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carType: formData.carType,
          days: bookingDetails.days,
          isWeekend: bookingDetails.isWeekend,
          // distance is optional for payment intent creation, can be 0
          distance: 0,
        }),
      })

      const paymentIntentResult = await paymentIntentResponse.json()

      if (paymentIntentResult.clientSecret) {
        setClientSecret(paymentIntentResult.clientSecret)
        setShowPaymentForm(true) // Move to payment step
      } else {
        setErrors({ general: paymentIntentResult.error || "Failed to initiate payment." })
      }
    } catch (error) {
      console.error("Error initiating payment:", error)
      setErrors({ general: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsSubmitting(true)
    setPaymentError(null)
    setErrors({})

    try {
      // Step 2: Submit Booking after successful payment
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, paymentIntentId, paymentStatus: "succeeded" }),
      })

      const result: BookingResponse = await response.json()
      setBookingResult(result)

      if (!result.success && result.error) {
        setErrors({ general: result.error })
      }
    } catch (error) {
      console.error("Booking submission error after payment:", error)
      setErrors({ general: "Network error. Booking might not be confirmed. Please contact support." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentError = (message: string) => {
    setPaymentError(message)
    setShowPaymentForm(false) // Go back to booking form or show error on payment form
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof BookingData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Success screen
  if (bookingResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-scale-in">
          <CardContent className="text-center p-8 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-astronaut-blue-900 mb-2">Booking Confirmed!</h2>
              <p className="text-astronaut-blue-600 text-lg">
                Booking ID: <span className="font-bold text-astronaut-blue-800">{bookingResult.booking?.id}</span>
              </p>
            </div>
            <div className="bg-astronaut-blue-50 p-4 rounded-2xl space-y-2">
              <p className="text-sm text-astronaut-blue-700">
                <span className="font-bold">Total Amount:</span> ₹{bookingResult.booking?.totalAmount?.toLocaleString()}
              </p>
              <p className="text-sm text-astronaut-blue-700">
                <span className="font-bold">Duration:</span> {bookingResult.booking?.days} days
              </p>
              <p className="text-sm text-astronaut-blue-700">
                <span className="font-bold">Daily Rate:</span> ₹{bookingResult.booking?.dailyRate}
              </p>
            </div>
            <p className="text-astronaut-blue-600">
              We'll contact you within <span className="font-bold text-astronaut-blue-800">30 minutes</span> to confirm
              your booking details.
            </p>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-2xl py-6 text-lg font-bold shadow-xl active:scale-95 transition-transform duration-200"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const appearance: StripeElementsOptions["appearance"] = {
    theme: "stripe",
    variables: {
      colorPrimary: "#318cc6", // astronaut-blue-500
      colorBackground: "#ffffff",
      colorText: "#1a486b", // astronaut-blue-800
      colorDanger: "#ef4444", // red-500
      fontFamily: "Inter, sans-serif",
      spacingUnit: "4px",
      borderRadius: "0.75rem", // rounded-xl
    },
    rules: {
      ".Input": {
        border: "2px solid var(--colorBackground)",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
        fontSize: "1rem",
        fontWeight: "500",
        color: "var(--colorText)",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      ".Input--invalid": {
        borderColor: "var(--colorDanger)",
      },
      ".Label": {
        fontWeight: "700",
        fontSize: "0.875rem",
        color: "var(--colorText)",
        marginBottom: "0.5rem",
      },
      ".Error": {
        color: "var(--colorDanger)",
        fontSize: "0.875rem",
        marginTop: "0.5rem",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100">
      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-xl shadow-xl border-b border-astronaut-blue-100/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center space-x-4 animate-slide-down">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-2xl active:scale-95 transition-transform duration-200"
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5 text-astronaut-blue-700" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-black text-astronaut-blue-900">Book Your Car</h1>
              <p className="text-sm text-astronaut-blue-600 font-medium">Fill in your details below</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-md mx-auto px-6 py-8">
        {/* General Error Alert */}
        {(errors.general || paymentError) && (
          <Alert className="mb-6 border-red-200 bg-red-50 animate-slide-down">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">{errors.general || paymentError}</AlertDescription>
          </Alert>
        )}

        {!showPaymentForm ? (
          <form onSubmit={handleBookingFormSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-slide-up">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-astronaut-blue-900 font-black">
                  <div className="w-8 h-8 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Personal Information
                </CardTitle>
                <CardDescription className="text-astronaut-blue-600 font-medium">
                  We need these details to process your booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-astronaut-blue-800 font-bold text-sm">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`pl-12 border-2 rounded-2xl py-6 text-base font-medium ${
                        errors.name
                          ? "border-red-300 focus:border-red-400"
                          : "border-astronaut-blue-200 focus:border-astronaut-blue-400"
                      }`}
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
                  </div>
                  {errors.name && <p className="text-red-600 text-sm font-medium">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-astronaut-blue-800 font-bold text-sm">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-12 border-2 rounded-2xl py-6 text-base font-medium ${
                        errors.email
                          ? "border-red-300 focus:border-red-400"
                          : "border-astronaut-blue-200 focus:border-astronaut-blue-400"
                      }`}
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
                  </div>
                  {errors.email && <p className="text-red-600 text-sm font-medium">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-astronaut-blue-800 font-bold text-sm">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`pl-12 border-2 rounded-2xl py-6 text-base font-medium ${
                        errors.phone
                          ? "border-red-300 focus:border-red-400"
                          : "border-astronaut-blue-200 focus:border-astronaut-blue-400"
                      }`}
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
                  </div>
                  {errors.phone && <p className="text-red-600 text-sm font-medium">{errors.phone}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card
              className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-astronaut-blue-900 font-black">
                  <div className="w-8 h-8 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  Booking Details
                </CardTitle>
                <CardDescription className="text-astronaut-blue-600 font-medium">
                  Choose your car and travel dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="carType" className="text-astronaut-blue-800 font-bold text-sm">
                    Car Type *
                  </Label>
                  <Select value={formData.carType} onValueChange={(value) => handleInputChange("carType", value)}>
                    <SelectTrigger
                      className={`border-2 rounded-2xl py-6 text-base font-medium ${
                        errors.carType ? "border-red-300" : "border-astronaut-blue-200"
                      }`}
                    >
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-seater">
                        <div className="flex items-center space-x-3 py-2">
                          <Car className="h-5 w-5 text-astronaut-blue-600" />
                          <div>
                            <div className="font-bold">5-Seater Cars</div>
                            <div className="text-sm text-gray-600">₹1,800/day • Perfect for city trips</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="7-seater">
                        <div className="flex items-center space-x-3 py-2">
                          <Car className="h-5 w-5 text-astronaut-blue-600" />
                          <div>
                            <div className="font-bold">7-Seater Cars</div>
                            <div className="text-sm text-gray-600">₹3,500/day • Ideal for families</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.carType && <p className="text-red-600 text-sm font-medium">{errors.carType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate" className="text-astronaut-blue-800 font-bold text-sm">
                      Pickup Date *
                    </Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={`border-2 rounded-2xl py-6 text-base font-medium ${
                        errors.pickupDate
                          ? "border-red-300 focus:border-red-400"
                          : "border-astronaut-blue-200 focus:border-astronaut-blue-400"
                      }`}
                    />
                    {errors.pickupDate && <p className="text-red-600 text-xs font-medium">{errors.pickupDate}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate" className="text-astronaut-blue-800 font-bold text-sm">
                      Return Date *
                    </Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => handleInputChange("returnDate", e.target.value)}
                      min={formData.pickupDate || new Date().toISOString().split("T")[0]}
                      className={`border-2 rounded-2xl py-6 text-base font-medium ${
                        errors.returnDate
                          ? "border-red-300 focus:border-red-400"
                          : "border-astronaut-blue-200 focus:border-astronaut-blue-400"
                      }`}
                    />
                    {errors.returnDate && <p className="text-red-600 text-xs font-medium">{errors.returnDate}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card
              className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-astronaut-blue-900 font-black">
                  <div className="w-8 h-8 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  Location Details
                </CardTitle>
                <CardDescription className="text-astronaut-blue-600 font-medium">
                  Where should we deliver your car?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation" className="text-astronaut-blue-800 font-bold text-sm">
                    Pickup Location *
                  </Label>
                  <div className="relative">
                    <Input
                      id="pickupLocation"
                      type="text"
                      placeholder="Enter pickup address"
                      value={formData.pickupLocation}
                      onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                      className={`pl-12 border-2 rounded-2xl py-6 text-base font-medium ${
                        errors.pickupLocation
                          ? "border-red-300 focus:border-red-400"
                          : "border-astronaut-blue-200 focus:border-astronaut-blue-400"
                      }`}
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
                  </div>
                  {errors.pickupLocation && <p className="text-red-600 text-sm font-medium">{errors.pickupLocation}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropLocation" className="text-astronaut-blue-800 font-bold text-sm">
                    Drop Location (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="dropLocation"
                      type="text"
                      placeholder="Enter drop address (if different)"
                      value={formData.dropLocation}
                      onChange={(e) => handleInputChange("dropLocation", e.target.value)}
                      className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            <Card
              className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-astronaut-blue-900 font-black">Special Requests</CardTitle>
                <CardDescription className="text-astronaut-blue-600 font-medium">
                  Any additional requirements or preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter any special requests or requirements..."
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  rows={4}
                  className="border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl text-base font-medium resize-none"
                />
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/50 rounded-3xl shadow-xl animate-fade-in">
              <CardContent className="pt-8">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                    className="mt-1 w-5 h-5 rounded-lg"
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="font-bold text-amber-800 cursor-pointer text-base">
                      I agree to the terms and conditions *
                    </Label>
                    <div className="mt-4 space-y-3">
                      {[
                        "Valid driving license required for all bookings",
                        "Security deposit mandatory (refundable)",
                        "Extra charges apply beyond 250 km/day (₹15/km)",
                        "Weekend rates are slightly higher than weekday rates",
                        "Fuel charges are separate and not included",
                        "Cancellation policy applies as per terms",
                      ].map((term, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-amber-800 font-medium leading-relaxed">{term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.agreeTerms && <p className="text-red-600 text-sm font-medium mt-2">{errors.agreeTerms}</p>}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-astronaut-blue-600 via-astronaut-blue-700 to-astronaut-blue-800 text-white border-0 rounded-3xl py-8 text-xl font-black shadow-2xl shadow-astronaut-blue-400/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Proceeding to Payment...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6" />
                  <span>Proceed to Payment</span>
                </div>
              )}
            </Button>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-astronaut-blue-600 font-bold">We'll contact you within 30 minutes</p>
              </div>
              <p className="text-xs text-astronaut-blue-500 font-medium">
                🔒 Secure booking • ⚡ Instant confirmation • 🚗 Premium service
              </p>
            </div>
          </form>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl flex items-center text-astronaut-blue-900 font-black">
                <div className="w-8 h-8 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <Car className="h-4 w-4 text-white" />
                </div>
                Payment Details
              </CardTitle>
              <CardDescription className="text-astronaut-blue-600 font-medium">
                Enter your payment information to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret && stripePromise ? (
                <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                  <PaymentForm onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} />
                </Elements>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-10 h-10 animate-spin text-astronaut-blue-500" />
                  <p className="mt-4 text-astronaut-blue-700">Loading payment form...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
