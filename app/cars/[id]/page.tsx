import { ArrowLeft, Users, Fuel, Shield, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

const carData = {
  "5-seater": {
    name: "5-Seater Cars",
    price: "₹1,800",
    weekendPrice: "₹2,000",
    image: "/placeholder.svg?height=250&width=400",
    description: "Perfect for small families and city trips. Comfortable and fuel-efficient.",
    specifications: {
      seating: "5 People",
      fuelType: "Petrol/Diesel",
      transmission: "Manual/Automatic",
      ac: "Yes",
    },
    features: [
      "Air Conditioning",
      "Music System",
      "Power Steering",
      "Central Locking",
      "Comfortable Seating",
      "GPS Navigation",
    ],
    models: ["Maruti Swift Dzire", "Honda Amaze", "Hyundai Xcent"],
  },
  "7-seater": {
    name: "7-Seater Cars",
    price: "₹3,500",
    weekendPrice: "₹3,800",
    image: "/placeholder.svg?height=250&width=400",
    description: "Spacious SUVs perfect for large families and group travels.",
    specifications: {
      seating: "7 People",
      fuelType: "Petrol/Diesel",
      transmission: "Manual/Automatic",
      ac: "Yes",
    },
    features: [
      "Spacious Interior",
      "Extra Luggage Space",
      "Premium Sound System",
      "Climate Control",
      "Safety Features",
      "Entertainment System",
    ],
    models: ["Toyota Innova", "Mahindra Xylo", "Maruti Ertiga"],
  },
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const car = carData[params.id as keyof typeof carData]

  if (!car) {
    notFound()
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
            <h1 className="text-lg font-semibold text-gray-900">{car.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Car Image */}
        <Card className="overflow-hidden">
          <div className="relative">
            <Image
              src={car.image || "/placeholder.svg"}
              alt={car.name}
              width={400}
              height={250}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4 space-y-2">
              <Badge className="bg-blue-600 text-white">{car.price}/day</Badge>
              <Badge variant="secondary" className="block">
                Weekend: {car.weekendPrice}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{car.name}</CardTitle>
            <CardDescription>{car.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Seating</p>
                <p className="text-xs text-gray-600">{car.specifications.seating}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Fuel Type</p>
                <p className="text-xs text-gray-600">{car.specifications.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Transmission</p>
                <p className="text-xs text-gray-600">{car.specifications.transmission}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">AC</p>
                <p className="text-xs text-gray-600">{car.specifications.ac}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Models */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {car.models.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{model}</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base text-blue-800">Pricing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-700">
            <p>• Weekday Rate: {car.price} per day</p>
            <p>• Weekend Rate: {car.weekendPrice} per day (slightly higher)</p>
            <p>• Extra charge: ₹15/km beyond 250 km/day</p>
            <p>• Security deposit required</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/booking">Book This Car</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
            <Link href="/calculator">Calculate Price</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
