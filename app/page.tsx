import { Car, Shield, Calculator, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const carTypes = [
    {
      id: "5-seater",
      name: "5-Seater Cars",
      price: "₹1,800",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Comfortable seating for 5", "AC & Music System", "Perfect for city trips"],
    },
    {
      id: "7-seater",
      name: "7-Seater Cars",
      price: "₹3,500",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Spacious for 7 people", "Extra luggage space", "Ideal for family trips"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SF CAR RENTALS</h1>
          </div>
          <p className="text-center text-gray-600 text-sm mt-1">Your trusted car rental partner</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Choose Your Perfect Ride</h2>
          <p className="text-gray-600 text-sm">Affordable rates, reliable service</p>
        </div>

        {/* Car Types */}
        <div className="space-y-4">
          {carTypes.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                  {car.price}/day
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{car.name}</CardTitle>
                <CardDescription>Starting from {car.price} per day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-1">
                  {car.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href={`/cars/${car.id}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm">Price Calculator</p>
                <p className="text-xs text-gray-600">Calculate your trip cost</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-sm">24/7 Support</p>
                <p className="text-xs text-gray-600">Always here to help</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Terms & Conditions */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Shield className="h-4 w-4 mr-2 text-yellow-600" />
              Important Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>• Extra charge: ₹15/km for distances beyond 250 km/day</p>
            <p>• Weekend rates are slightly higher</p>
            <p>• Security deposit required for 2-Wheeler (bike/scooter)</p>
            <p>• Valid driving license mandatory</p>
            <p>• Fuel charges separate</p>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-3 pt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/booking">Start Your Booking</Link>
          </Button>
          <p className="text-xs text-gray-500">Need help? Call us at +91 98765 43210</p>
        </div>
      </main>
    </div>
  )
}
