import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20", // Use a recent API version
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { carType, days, distance, isWeekend } = body

    // Validate inputs
    if (!carType || !days || days < 1) {
      return NextResponse.json({ error: "Invalid input parameters for payment calculation" }, { status: 400 })
    }

    const carRates = {
      "5-seater": { weekday: 1800, weekend: 2000 },
      "7-seater": { weekday: 3500, weekend: 3800 },
    }

    if (!carRates[carType as keyof typeof carRates]) {
      return NextResponse.json({ error: "Invalid car type for payment calculation" }, { status: 400 })
    }

    const rates = carRates[carType as keyof typeof carRates]
    const dailyRate = isWeekend ? rates.weekend : rates.weekday
    const baseCost = dailyRate * days

    // Calculate extra distance charges
    const totalAllowedKm = days * 250
    const extraKm = Math.max(0, (distance || 0) - totalAllowedKm)
    const extraKmCharge = extraKm * 15

    const totalAmount = baseCost + extraKmCharge

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Amount in cents
      currency: "inr", // Indian Rupee
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        carType,
        days: String(days),
        distance: String(distance || 0),
        isWeekend: String(isWeekend),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent." }, { status: 500 })
  }
}
