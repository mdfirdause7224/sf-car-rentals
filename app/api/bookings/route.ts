import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "carType", "pickupDate", "returnDate", "pickupLocation"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: "Missing required fields", fields: missingFields }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^(\+91|91)?[6789]\d{9}$/
    if (!phoneRegex.test(body.phone.replace(/\s+/g, ""))) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Validate dates
    const pickupDate = new Date(body.pickupDate)
    const returnDate = new Date(body.returnDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickupDate < today) {
      return NextResponse.json({ error: "Pickup date cannot be in the past" }, { status: 400 })
    }

    if (returnDate <= pickupDate) {
      return NextResponse.json({ error: "Return date must be after pickup date" }, { status: 400 })
    }

    // Generate booking ID
    const bookingId = `SF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Calculate pricing
    const carRates = {
      "5-seater": { weekday: 1800, weekend: 2000 },
      "7-seater": { weekday: 3500, weekend: 3800 },
    }

    const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))
    const isWeekend =
      pickupDate.getDay() === 0 || pickupDate.getDay() === 6 || returnDate.getDay() === 0 || returnDate.getDay() === 6
    const rates = carRates[body.carType as keyof typeof carRates]
    const dailyRate = isWeekend ? rates.weekend : rates.weekday
    const totalAmount = dailyRate * days

    // Create booking object
    const booking = {
      id: bookingId,
      ...body,
      days,
      dailyRate,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In a real app, save to database here
    console.log("New booking created:", booking)

    // Send confirmation email (mock)
    // await sendConfirmationEmail(booking)

    return NextResponse.json({
      success: true,
      booking: {
        id: bookingId,
        totalAmount,
        days,
        dailyRate,
        status: "pending",
      },
      message: "Booking created successfully. We will contact you within 30 minutes.",
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("id")

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // In a real app, fetch from database
    // const booking = await getBookingById(bookingId)

    // Mock booking data
    const booking = {
      id: bookingId,
      name: "John Doe",
      status: "confirmed",
      carType: "5-seater",
      pickupDate: "2024-01-15",
      returnDate: "2024-01-17",
      totalAmount: 3600,
      days: 2,
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Booking fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
