import { ArrowLeft, Users, Fuel, Shield, MapPin, Star, Clock, CheckCircle } from "lucide-react"
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
    originalPrice: "₹2,200",
    image: "/placeholder.svg?height=300&width=500",
    description:
      "Perfect for small families and city trips. Comfortable, fuel-efficient, and reliable for all your travel needs.",
    rating: 4.8,
    reviews: 156,
    specifications: {
      seating: "5 People",
      fuelType: "Petrol/Diesel",
      transmission: "Manual/Automatic",
      ac: "Climate Control",
    },
    features: [
      "Premium Air Conditioning",
      "Advanced Music System",
      "Power Steering & Windows",
      "Central Locking System",
      "Comfortable Leather Seating",
      "GPS Navigation System",
      "USB Charging Ports",
      "Bluetooth Connectivity",
    ],
    models: ["Maruti Swift Dzire", "Honda Amaze", "Hyundai Xcent"],
    highlights: ["Most Popular", "Fuel Efficient", "City Friendly"],
  },
  "7-seater": {
    name: "7-Seater Cars",
    price: "₹3,500",
    weekendPrice: "₹3,800",
    originalPrice: "₹4,000",
    image: "/placeholder.svg?height=300&width=500",
    description:
      "Spacious SUVs perfect for large families and group travels. Premium comfort with advanced safety features.",
    rating: 4.9,
    reviews: 203,
    specifications: {
      seating: "7 People",
      fuelType: "Petrol/Diesel",
      transmission: "Manual/Automatic",
      ac: "Dual Zone Climate Control",
    },
    features: [
      "Spacious Premium Interior",
      "Extra Large Luggage Space",
      "Premium Sound System",
      "Dual Zone Climate Control",
      "Advanced Safety Features",
      "Entertainment System",
      "Captain Seats (Middle Row)",
      "360° Camera System",
    ],
    models: ["Toyota Innova Crysta", "Mahindra XUV700", "Maruti Ertiga"],
    highlights: ["Premium Choice", "Family Friendly", "Long Distance"],
  },
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const car = carData[params.id as keyof typeof carData]

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-astronaut-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-40 h-40 bg-astronaut-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-astronaut-blue-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 animate-slide-down">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-astronaut-blue-100 transition-colors duration-300"
            >
              <Link href="/">
                <ArrowLeft className="h-5 w-5 text-astronaut-blue-700" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-astronaut-blue-900">{car.name}</h1>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-astronaut-blue-600">
                  {car.rating} ({car.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Image */}
        <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-astronaut-blue-200 animate-scale-in">
          <div className="relative">
            <Image
              src={car.image || "/placeholder.svg"}
              alt={car.name}
              width={500}
              height={300}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-astronaut-blue-900/30 to-transparent"></div>

            {/* Price Badges */}
            <div className="absolute top-4 right-4 space-y-2">
              {car.highlights.map((highlight, index) => (
                <Badge
                  key={index}
                  className="bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 text-white border-0 animate-bounce-gentle"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {highlight}
                </Badge>
              ))}
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
              <div className="text-xs text-gray-500 line-through">{car.originalPrice}</div>
              <div className="text-xl font-bold text-astronaut-blue-700">{car.price}/day</div>
              <div className="text-xs text-astronaut-blue-600">Weekend: {car.weekendPrice}</div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="bg-white/70 backdrop-blur-sm border-astronaut-blue-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-astronaut-blue-900 flex items-center space-x-2">
              <span>{car.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-astronaut-blue-600">{car.rating}</span>
              </div>
            </CardTitle>
            <CardDescription className="text-astronaut-blue-600 leading-relaxed">{car.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Specifications */}
        <Card className="bg-white/70 backdrop-blur-sm border-astronaut-blue-200 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg text-astronaut-blue-900">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-astronaut-blue-50 to-astronaut-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-astronaut-blue-600" />
              <div>
                <p className="text-sm font-semibold text-astronaut-blue-900">Seating</p>
                <p className="text-xs text-astronaut-blue-600">{car.specifications.seating}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
              <Fuel className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">Fuel Type</p>
                <p className="text-xs text-emerald-600">{car.specifications.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-semibold text-purple-900">Transmission</p>
                <p className="text-xs text-purple-600">{car.specifications.transmission}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-orange-900">AC</p>
                <p className="text-xs text-orange-600">{car.specifications.ac}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-white/70 backdrop-blur-sm border-astronaut-blue-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg text-astronaut-blue-900">Premium Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {car.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-astronaut-blue-50 rounded-lg transition-colors duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-astronaut-blue-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Models */}
        <Card className="bg-white/70 backdrop-blur-sm border-astronaut-blue-200 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg text-astronaut-blue-900">Available Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {car.models.map((model, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-astronaut-blue-50 to-astronaut-blue-100 rounded-xl hover:from-astronaut-blue-100 hover:to-astronaut-blue-200 transition-all duration-300 transform hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-astronaut-blue-900">{model}</span>
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Available
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Info */}
        <Card className="bg-gradient-to-r from-astronaut-blue-100 to-astronaut-blue-200 border-astronaut-blue-300 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg text-astronaut-blue-900 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pricing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-astronaut-blue-800">
            <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
              <span>Weekday Rate:</span>
              <span className="font-bold">{car.price} per day</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
              <span>Weekend Rate:</span>
              <span className="font-bold">{car.weekendPrice} per day</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
              <span>Extra Distance:</span>
              <span className="font-bold">₹15/km beyond 250km/day</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
              <span>Security Deposit:</span>
              <span className="font-bold">Required</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-astronaut-blue-600 via-astronaut-blue-700 to-astronaut-blue-800 hover:from-astronaut-blue-700 hover:via-astronaut-blue-800 hover:to-astronaut-blue-900 text-white border-0 transition-all duration-500 hover:shadow-2xl hover:shadow-astronaut-blue-400/50 transform hover:scale-105 animate-bounce-gentle"
          >
            <Link href="/booking" className="flex items-center space-x-2">
              <span>Book This Car Now</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-astronaut-blue-300 text-astronaut-blue-700 hover:bg-astronaut-blue-50 hover:border-astronaut-blue-400 transition-all duration-300 transform hover:scale-105 bg-transparent"
          >
            <Link href="/calculator" className="flex items-center space-x-2">
              <span>Calculate Price</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
