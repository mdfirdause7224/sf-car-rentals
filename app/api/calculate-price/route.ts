import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { carType, days, distance, isWeekend } = body

    // Validate inputs
    if (!carType || !days || days < 1) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    const carRates = {
      "5-seater": { weekday: 1800, weekend: 2000 },
      "7-seater": { weekday: 3500, weekend: 3800 },
    }

    if (!carRates[carType as keyof typeof carRates]) {
      return NextResponse.json({ error: "Invalid car type" }, { status: 400 })
    }

    const rates = carRates[carType as keyof typeof carRates]
    const dailyRate = isWeekend ? rates.weekend : rates.weekday
    const baseCost = dailyRate * days

    // Calculate extra distance charges
    const totalAllowedKm = days * 250
    const extraKm = Math.max(0, (distance || 0) - totalAllowedKm)
    const extraKmCharge = extraKm * 15

    const totalCost = baseCost + extraKmCharge

    // Calculate savings
    const originalRate = carType === "5-seater" ? 2200 : 4000
    const savings = (originalRate - dailyRate) * days

    return NextResponse.json({
      success: true,
      calculation: {
        carType,
        days,
        dailyRate,
        baseCost,
        extraKm,
        extraKmCharge,
        totalCost,
        savings,
        breakdown: {
          baseRate: `₹${dailyRate} × ${days} days = ₹${baseCost}`,
          extraDistance: extraKm > 0 ? `₹15 × ${extraKm} km = ₹${extraKmCharge}` : "No extra charges",
          total: `₹${totalCost}`,
        },
      },
    })
  } catch (error) {
    console.error("Price calculation error:", error)
    return NextResponse.json({ error: "Calculation failed. Please try again." }, { status: 500 })
  }
}
