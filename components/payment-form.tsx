"use client"

import type React from "react"
import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface PaymentFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (message: string) => void
}

export default function PaymentForm({ onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/booking?payment_status=success`, // This will redirect after payment
      },
      redirect: "if_required", // Handle redirection manually if needed, or let Stripe handle it
    })

    // This point will only be reached if there's an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An unknown card error occurred.")
      } else {
        setMessage("An unexpected error occurred.")
      }
      onPaymentError(message || "Payment failed.")
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!")
      onPaymentSuccess(paymentIntent.id)
    } else {
      // This case might happen for payment methods that require customer action
      // after the initial confirmation, but before the final status is known.
      // For example, some bank redirects.
      setMessage(`Payment status: ${paymentIntent?.status}`)
      onPaymentError(`Payment requires further action or is not yet succeeded: ${paymentIntent?.status}`)
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button
        disabled={isLoading || !stripe || !elements}
        type="submit"
        className="w-full bg-gradient-to-r from-astronaut-blue-600 via-astronaut-blue-700 to-astronaut-blue-800 text-white border-0 rounded-3xl py-8 text-xl font-black shadow-2xl shadow-astronaut-blue-400/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform duration-200"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <span>Pay Now</span>
          </div>
        )}
      </Button>
      {/* Show any error or success messages */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-xl flex items-center space-x-2 ${
            message.includes("succeeded") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.includes("succeeded") ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </form>
  )
}
