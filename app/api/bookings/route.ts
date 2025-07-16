import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      carType,
      pickupDate,
      returnDate,
      pickupLocation,
      dropLocation,
      specialRequests,
      agreeTerms, // This is a client-side validation, not stored in DB
      paymentIntentId, // Passed from client after successful payment
      paymentStatus, // Passed from client after successful payment
    } = body

    // Validate required fields
    const requiredFields = ["carType", "pickupDate", "returnDate", "pickupLocation", "totalAmount"] // totalAmount will be calculated on server
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: "Missing required fields", fields: missingFields }, { status: 400 })
    }

    // Validate dates
    const pickupDateObj = new Date(pickupDate)
    const returnDateObj = new Date(returnDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (pickupDateObj < today) {
      return NextResponse.json({ error: "Pickup date cannot be in the past" }, { status: 400 })
    }

    if (returnDateObj <= pickupDateObj) {
      return NextResponse.json({ error: "Return date must be after pickup date" }, { status: 400 })
    }

    // Calculate pricing (re-calculate on server for security)
    const carRates = {
      "5-seater": { weekday: 1800, weekend: 2000 },
      "7-seater": { weekday: 3500, weekend: 3800 },
    }

    const days = Math.ceil((returnDateObj.getTime() - pickupDateObj.getTime()) / (1000 * 60 * 60 * 24))
    const isWeekend =
      pickupDateObj.getDay() === 0 ||
      pickupDateObj.getDay() === 6 ||
      returnDateObj.getDay() === 0 ||
      returnDateObj.getDay() === 6
    const rates = carRates[carType as keyof typeof carRates]
    const dailyRate = isWeekend ? rates.weekend : rates.weekday
    const totalAmount = dailyRate * days // This is the server-calculated total

    // Insert booking into Supabase
    const { data: newBooking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        car_type: carType,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_location: pickupLocation,
        drop_location: dropLocation || null,
        special_requests: specialRequests || null,
        total_amount: totalAmount,
        status: paymentStatus === "succeeded" ? "confirmed" : "pending", // Set status based on payment
        payment_intent_id: paymentIntentId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase booking insertion error:", error.message)
      return NextResponse.json({ error: "Failed to create booking." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: newBooking.id,
        totalAmount: newBooking.total_amount,
        days,
        dailyRate,
        status: newBooking.status,
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
    const supabase = createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("id")

    if (bookingId) {
      // Fetch a specific booking by ID for the current user
      const { data: booking, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .eq("user_id", user.id) // Ensure user can only fetch their own booking
        .single()

      if (error) {
        console.error("Supabase fetch booking by ID error:", error.message)
        return NextResponse.json({ error: "Booking not found or unauthorized." }, { status: 404 })
      }
      return NextResponse.json({ booking })
    } else {
      // Fetch all bookings for the current user
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("pickup_date", { ascending: true }) // Order by pickup date

      if (error) {
        console.error("Supabase fetch all bookings error:", error.message)
        return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 })
      }
      return NextResponse.json({ bookings })
    }
  } catch (error) {
    console.error("Booking fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
