import { Car, Shield, Calculator, Clock, Star, MapPin, Users, Phone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"

// Dynamically import InstallPrompt to avoid SSR issues
const InstallPromptWrapper = dynamic(() => import("@/components/install-prompt-wrapper"), {
  ssr: false,
})

export default function HomePage() {
  const carTypes = [
    {
      id: "5-seater",
      name: "5-Seater Cars",
      price: "₹1,800",
      originalPrice: "₹2,200",
      image: "/placeholder.svg?height=240&width=400",
      features: ["Comfortable seating for 5", "AC & Music System", "Perfect for city trips"],
      rating: 4.8,
      reviews: 156,
      popular: true,
      discount: "18% OFF",
    },
    {
      id: "7-seater",
      name: "7-Seater Cars",
      price: "₹3,500",
      originalPrice: "₹4,000",
      image: "/placeholder.svg?height=240&width=400",
      features: ["Spacious for 7 people", "Extra luggage space", "Ideal for family trips"],
      rating: 4.9,
      reviews: 203,
      popular: false,
      discount: "12% OFF",
    },
  ]

  const features = [
    {
      icon: Calculator,
      title: "Smart Calculator",
      desc: "Instant price estimates",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Round the clock help",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      desc: "100% safe & protected",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: MapPin,
      title: "Doorstep Delivery",
      desc: "We come to you",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "50+", label: "Cities Covered" },
    { number: "24/7", label: "Support Available" },
    { number: "4.9★", label: "Average Rating" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-astronaut-blue-200/30 to-astronaut-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-astronaut-blue-300/20 to-astronaut-blue-400/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-xl shadow-xl border-b border-astronaut-blue-100/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-4 animate-slide-down">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 p-3 rounded-2xl">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black bg-gradient-to-r from-astronaut-blue-800 via-astronaut-blue-600 to-astronaut-blue-700 bg-clip-text text-transparent">
                SF CAR RENTALS
              </h1>
              <p className="text-astronaut-blue-600 text-sm font-semibold tracking-wide">Premium Car Rental Service</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-emerald-200 px-4 py-2 rounded-full border border-emerald-300/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <Star className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-800">Rated #1 Car Rental Service</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-astronaut-blue-900 mb-3">Choose Your Perfect Ride</h2>
            <p className="text-astronaut-blue-600 text-lg leading-relaxed">
              Premium cars, unbeatable prices, unforgettable journeys
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-3 animate-slide-up">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-astronaut-blue-100/50 shadow-lg"
            >
              <div className="text-lg font-black text-astronaut-blue-800">{stat.number}</div>
              <div className="text-xs text-astronaut-blue-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Car Types */}
        <div className="space-y-6">
          {carTypes.map((car, index) => (
            <Card
              key={car.id}
              className="group overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-2xl shadow-astronaut-blue-200/20 rounded-3xl animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden rounded-t-3xl">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  width={400}
                  height={240}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {car.popular && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1 text-xs font-bold">
                      🔥 MOST POPULAR
                    </Badge>
                  )}
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 text-xs font-bold">
                    {car.discount}
                  </Badge>
                </div>

                {/* Price */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-xl">
                  <div className="text-xs text-gray-500 line-through font-medium">{car.originalPrice}</div>
                  <div className="text-xl font-black text-astronaut-blue-800">{car.price}</div>
                  <div className="text-xs text-astronaut-blue-600 font-semibold">per day</div>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-gray-800">{car.rating}</span>
                  <span className="text-xs text-gray-600">({car.reviews})</span>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-black text-astronaut-blue-900">{car.name}</CardTitle>
                  <div className="flex items-center space-x-1 bg-astronaut-blue-100 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4 text-astronaut-blue-600" />
                    <span className="text-sm font-bold text-astronaut-blue-800">
                      {car.id === "5-seater" ? "5" : "7"} Seats
                    </span>
                  </div>
                </div>
                <CardDescription className="text-astronaut-blue-600 text-base">
                  Starting from <span className="font-black text-astronaut-blue-800">{car.price}</span> per day
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {car.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-sm">
                      <div className="w-6 h-6 bg-gradient-to-r from-astronaut-blue-500 to-astronaut-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-astronaut-blue-800 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white border-0 rounded-2xl py-6 text-base font-bold shadow-xl shadow-astronaut-blue-300/30 active:scale-95 transition-transform duration-200"
                  >
                    <Link href={`/cars/${car.id}`}>View Details</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-2 border-astronaut-blue-300 text-astronaut-blue-700 bg-white rounded-2xl py-6 text-base font-bold active:scale-95 transition-transform duration-200"
                  >
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-astronaut-blue-200/20 rounded-3xl active:scale-95 transition-transform duration-200 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center space-y-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-astronaut-blue-900">{feature.title}</p>
                  <p className="text-xs text-astronaut-blue-600 font-medium">{feature.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Terms & Conditions */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/50 rounded-3xl shadow-xl animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center text-amber-800 font-black">
              <Shield className="h-6 w-6 mr-3 text-amber-600" />
              Important Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Extra charge: ₹15/km for distances beyond 250 km/day",
              "Weekend rates are slightly higher than weekday rates",
              "Security deposit required for 2-Wheeler (bike/scooter)",
              "Valid driving license mandatory for all bookings",
              "Fuel charges are separate and not included in rental price",
            ].map((term, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-amber-800 font-medium leading-relaxed">{term}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-6 pt-6 animate-fade-in">
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-astronaut-blue-600 via-astronaut-blue-700 to-astronaut-blue-800 text-white border-0 rounded-3xl py-8 text-lg font-black shadow-2xl shadow-astronaut-blue-400/40 active:scale-95 transition-transform duration-200"
          >
            <Link href="/booking" className="flex items-center justify-center space-x-3">
              <Car className="h-6 w-6" />
              <span>Start Your Booking Journey</span>
            </Link>
          </Button>

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-bold">24/7 Available</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
              <Phone className="h-3 w-3 text-blue-600" />
              <span className="text-blue-800 font-bold">+91 98765 43210</span>
            </div>
          </div>
          <p className="text-xs text-astronaut-blue-500 font-medium">
            🔒 Secure booking • ⚡ Instant confirmation • 🚗 Premium service
          </p>
        </div>
      </main>

      {/* Install Prompt */}
      <InstallPromptWrapper />
    </div>
  )
}
