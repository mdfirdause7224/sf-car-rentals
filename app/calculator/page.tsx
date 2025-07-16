"use client"

import { useState } from "react"
import { ArrowLeft, Calculator, TrendingUp, MapPin, Car, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface CalculationResult {
  carType: string
  days: number
  dailyRate: number
  baseCost: number
  extraKm: number
  extraKmCharge: number
  totalCost: number
  savings: number
  breakdown: {
    baseRate: string
    extraDistance: string
    total: string
  }
}

export default function CalculatorPage() {
  const [calculation, setCalculation] = useState({
    carType: "",
    days: "",
    distance: "",
    isWeekend: false,
  })

  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculatePrice = async () => {
    if (!calculation.carType || !calculation.days) return

    setIsCalculating(true)

    try {
      const response = await fetch("/api/calculate-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carType: calculation.carType,
          days: Number.parseInt(calculation.days),
          distance: Number.parseInt(calculation.distance) || 0,
          isWeekend: calculation.isWeekend,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.calculation)
      }
    } catch (error) {
      console.error("Price calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const carRates = [
    {
      type: "5-seater",
      name: "5-Seater Cars",
      weekday: "₹1,800",
      weekend: "₹2,000",
      features: ["Perfect for city trips", "Fuel efficient", "Comfortable seating"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      type: "7-seater",
      name: "7-Seater Cars",
      weekday: "₹3,500",
      weekend: "₹3,800",
      features: ["Spacious for families", "Extra luggage space", "Premium comfort"],
      gradient: "from-purple-500 to-violet-500",
    },
  ]

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
              <h1 className="text-2xl font-black text-astronaut-blue-900">Price Calculator</h1>
              <p className="text-sm text-astronaut-blue-600 font-medium">Get instant pricing estimates</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Calculator Form */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-astronaut-blue-900 font-black">
              <div className="w-10 h-10 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-2xl flex items-center justify-center mr-3">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              Trip Cost Calculator
            </CardTitle>
            <CardDescription className="text-astronaut-blue-600 font-medium text-base">
              Get an instant price estimate for your rental
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="carType" className="text-astronaut-blue-800 font-bold">
                Car Type
              </Label>
              <Select
                value={calculation.carType}
                onValueChange={(value) => setCalculation((prev) => ({ ...prev, carType: value }))}
              >
                <SelectTrigger className="border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium">
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
            </div>

            <div className="space-y-3">
              <Label htmlFor="days" className="text-astronaut-blue-800 font-bold">
                Number of Days
              </Label>
              <div className="relative">
                <Input
                  id="days"
                  type="number"
                  placeholder="Enter number of days"
                  value={calculation.days}
                  onChange={(e) => setCalculation((prev) => ({ ...prev, days: e.target.value }))}
                  min="1"
                  className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
                />
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="distance" className="text-astronaut-blue-800 font-bold">
                Total Distance (km)
              </Label>
              <div className="relative">
                <Input
                  id="distance"
                  type="number"
                  placeholder="Enter total distance (optional)"
                  value={calculation.distance}
                  onChange={(e) => setCalculation((prev) => ({ ...prev, distance: e.target.value }))}
                  min="0"
                  className="pl-12 border-2 border-astronaut-blue-200 focus:border-astronaut-blue-400 rounded-2xl py-6 text-base font-medium"
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-astronaut-blue-500" />
              </div>
              <div className="bg-astronaut-blue-50 p-4 rounded-2xl border border-astronaut-blue-200">
                <p className="text-sm text-astronaut-blue-700 font-medium">
                  💡 First 250 km per day included. ₹15/km extra beyond that.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-astronaut-blue-50 to-astronaut-blue-100 rounded-2xl border border-astronaut-blue-200">
              <input
                type="checkbox"
                id="weekend"
                checked={calculation.isWeekend}
                onChange={(e) => setCalculation((prev) => ({ ...prev, isWeekend: e.target.checked }))}
                className="w-5 h-5 rounded-lg border-2 border-astronaut-blue-300 text-astronaut-blue-600 focus:ring-astronaut-blue-500"
              />
              <Label htmlFor="weekend" className="text-base font-bold text-astronaut-blue-800 cursor-pointer">
                Weekend booking (rates slightly higher)
              </Label>
            </div>

            <Button
              onClick={calculatePrice}
              disabled={!calculation.carType || !calculation.days || isCalculating}
              className="w-full bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-2xl py-8 text-lg font-black shadow-xl shadow-astronaut-blue-300/40 disabled:opacity-50 active:scale-95 transition-transform duration-200"
            >
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Calculating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Calculate Price</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Rate Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-astronaut-blue-900 text-center">Current Rates</h3>
          {carRates.map((car, index) => (
            <Card
              key={car.type}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${car.gradient} rounded-2xl flex items-center justify-center`}
                    >
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-astronaut-blue-900">{car.name}</h4>
                      <p className="text-sm text-astronaut-blue-600">Premium comfort & reliability</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-astronaut-blue-50 p-3 rounded-xl text-center">
                    <p className="text-xs text-astronaut-blue-600 font-medium">Weekday</p>
                    <p className="text-lg font-black text-astronaut-blue-800">{car.weekday}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-xl text-center">
                    <p className="text-xs text-orange-600 font-medium">Weekend</p>
                    <p className="text-lg font-black text-orange-800">{car.weekend}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {car.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-astronaut-blue-500 rounded-full"></div>
                      <span className="text-astronaut-blue-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Results */}
        {result && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/50 rounded-3xl shadow-xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl text-green-800 font-black">💰 Price Breakdown</CardTitle>
              <CardDescription className="text-green-700 font-medium">Your trip cost calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/70 rounded-xl">
                  <span className="text-sm font-medium text-green-800">Base Cost ({result.days} days)</span>
                  <span className="font-black text-green-900">₹{result.baseCost.toLocaleString()}</span>
                </div>

                {result.extraKmCharge > 0 && (
                  <div className="flex justify-between items-center p-3 bg-white/70 rounded-xl">
                    <span className="text-sm font-medium text-green-800">Extra Distance ({result.extraKm} km)</span>
                    <span className="font-black text-green-900">₹{result.extraKmCharge.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300/50">
                  <span className="font-black text-green-900 text-lg">Total Cost</span>
                  <span className="text-2xl font-black text-green-900">₹{result.totalCost.toLocaleString()}</span>
                </div>

                {result.savings > 0 && (
                  <div className="text-center p-3 bg-orange-100 rounded-xl border border-orange-300/50">
                    <p className="text-sm font-bold text-orange-800">
                      🎉 You save ₹{result.savings.toLocaleString()} with our discounted rates!
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl py-6 text-lg font-black shadow-xl active:scale-95 transition-transform duration-200"
                >
                  <Link href="/booking">Book This Trip Now</Link>
                </Button>
              </div>

              <p className="text-xs text-green-700 text-center font-medium">
                * Fuel charges, tolls, and security deposit are additional
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
