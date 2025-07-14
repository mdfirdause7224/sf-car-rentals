"use client"

import { useState } from "react"
import { ArrowLeft, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CalculatorPage() {
  const [calculation, setCalculation] = useState({
    carType: "",
    days: "",
    distance: "",
    isWeekend: false,
  })

  const [result, setResult] = useState<{
    baseRate: number
    totalDays: number
    extraKmCharge: number
    weekendSurcharge: number
    total: number
  } | null>(null)

  const carRates = {
    "5-seater": { weekday: 1800, weekend: 2000 },
    "7-seater": { weekday: 3500, weekend: 3800 },
  }

  const calculatePrice = () => {
    if (!calculation.carType || !calculation.days) return

    const days = Number.parseInt(calculation.days)
    const distance = Number.parseInt(calculation.distance) || 0
    const rates = carRates[calculation.carType as keyof typeof carRates]

    const baseRate = calculation.isWeekend ? rates.weekend : rates.weekday
    const totalDays = days

    // Extra km charge (beyond 250 km per day)
    const totalAllowedKm = days * 250
    const extraKm = Math.max(0, distance - totalAllowedKm)
    const extraKmCharge = extraKm * 15

    // Weekend surcharge calculation (if applicable)
    const weekendSurcharge = calculation.isWeekend ? (rates.weekend - rates.weekday) * days : 0

    const total = baseRate * days + extraKmCharge

    setResult({
      baseRate,
      totalDays,
      extraKmCharge,
      weekendSurcharge,
      total,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Price Calculator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Your Trip Cost
            </CardTitle>
            <CardDescription>Get an instant price estimate for your rental</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="carType">Car Type</Label>
              <Select
                value={calculation.carType}
                onValueChange={(value) => setCalculation((prev) => ({ ...prev, carType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-seater">5-Seater Cars</SelectItem>
                  <SelectItem value="7-seater">7-Seater Cars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                placeholder="Enter number of days"
                value={calculation.days}
                onChange={(e) => setCalculation((prev) => ({ ...prev, days: e.target.value }))}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="distance">Total Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="Enter total distance (optional)"
                value={calculation.distance}
                onChange={(e) => setCalculation((prev) => ({ ...prev, distance: e.target.value }))}
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">First 250 km per day included. ₹15/km extra beyond that.</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="weekend"
                checked={calculation.isWeekend}
                onChange={(e) => setCalculation((prev) => ({ ...prev, isWeekend: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="weekend" className="text-sm">
                Weekend booking (rates slightly higher)
              </Label>
            </div>

            <Button onClick={calculatePrice} className="w-full">
              Calculate Price
            </Button>
          </CardContent>
        </Card>

        {/* Rate Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base text-blue-800">Current Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">5-Seater (Weekday)</span>
              <Badge variant="secondary">₹1,800/day</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">5-Seater (Weekend)</span>
              <Badge variant="secondary">₹2,000/day</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">7-Seater (Weekday)</span>
              <Badge variant="secondary">₹3,500/day</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">7-Seater (Weekend)</span>
              <Badge variant="secondary">₹3,800/day</Badge>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm">Extra Distance</span>
              <Badge variant="outline">₹15/km</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-base text-green-800">Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Base Rate ({result.totalDays} days)</span>
                <span className="font-semibold">₹{(result.baseRate * result.totalDays).toLocaleString()}</span>
              </div>

              {result.extraKmCharge > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Extra Distance Charge</span>
                  <span className="font-semibold">₹{result.extraKmCharge.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-green-300">
                <span className="font-semibold text-green-800">Total Estimated Cost</span>
                <span className="text-lg font-bold text-green-800">₹{result.total.toLocaleString()}</span>
              </div>

              <p className="text-xs text-green-700 mt-2">* Fuel charges, tolls, and security deposit are additional</p>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        {result && (
          <Button asChild size="lg" className="w-full">
            <Link href="/booking">Book Now</Link>
          </Button>
        )}
      </main>
    </div>
  )
}
