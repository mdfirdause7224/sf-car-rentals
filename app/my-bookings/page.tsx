import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  car_type: string
  pickup_date: string
  return_date: string
  pickup_location: string
  drop_location: string | null
  total_amount: number
  status: string
  created_at: string
}

export default async function MyBookingsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login") // Redirect to login if no user is logged in
  }

  let bookings: Booking[] = []
  let errorFetching = false

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Next.js automatically handles cookies for server components
      },
      cache: "no-store", // Ensure fresh data
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Failed to fetch bookings:", errorData.error)
      errorFetching = true
    } else {
      const data = await response.json()
      bookings = data.bookings || []
    }
  } catch (error) {
    console.error("Network error fetching bookings:", error)
    errorFetching = true
  }

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcomingBookings = bookings.filter((b) => new Date(b.pickup_date) >= now)
  const pastBookings = bookings.filter((b) => new Date(b.pickup_date) < now)

  return (
    <div className="min-h-screen bg-gradient-to-br from-astronaut-blue-50 via-white to-astronaut-blue-100 p-6">
      <header className="max-w-md mx-auto px-4 py-4 mb-6">
        <h1 className="text-3xl font-black text-astronaut-blue-900 text-center">My Bookings</h1>
        <p className="text-astronaut-blue-600 text-center mt-2">View your past and upcoming car rentals.</p>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        {errorFetching && (
          <Card className="bg-red-50 border-red-200 shadow-md rounded-xl">
            <CardContent className="p-4 flex items-center space-x-3 text-red-800">
              <XCircle className="h-5 w-5" />
              <p>Error loading your bookings. Please try again later.</p>
            </CardContent>
          </Card>
        )}

        {bookings.length === 0 && !errorFetching && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl text-center p-8">
            <CardContent className="space-y-4">
              <Clock className="h-12 w-12 text-astronaut-blue-500 mx-auto" />
              <h3 className="text-xl font-bold text-astronaut-blue-900">No Bookings Yet!</h3>
              <p className="text-astronaut-blue-600">It looks like you haven't made any car rental bookings.</p>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-2xl py-6 text-lg font-bold shadow-xl active:scale-95 transition-transform duration-200"
              >
                <Link href="/">Start Booking Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {upcomingBookings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-astronaut-blue-900">Upcoming Bookings</h2>
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </section>
        )}

        {pastBookings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-astronaut-blue-900">Past Bookings</h2>
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const statusColor =
    booking.status === "confirmed"
      ? "text-green-600"
      : booking.status === "pending"
        ? "text-yellow-600"
        : "text-red-600"
  const statusBg =
    booking.status === "confirmed" ? "bg-green-50" : booking.status === "pending" ? "bg-yellow-50" : "bg-red-50"

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-astronaut-blue-900 capitalize">{booking.car_type} Car</CardTitle>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} ${statusBg}`}>
            {booking.status}
          </span>
        </div>
        <CardDescription className="text-astronaut-blue-600 text-sm">
          Booking ID: {booking.id.substring(0, 8)}...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-astronaut-blue-800">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-astronaut-blue-500" />
            <span>Pickup: {new Date(booking.pickup_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-astronaut-blue-500" />
            <span>Return: {new Date(booking.return_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <MapPin className="h-4 w-4 text-astronaut-blue-500" />
            <span>Location: {booking.pickup_location}</span>
          </div>
          {booking.drop_location && (
            <div className="flex items-center space-x-2 col-span-2">
              <MapPin className="h-4 w-4 text-astronaut-blue-500" />
              <span>Drop-off: {booking.drop_location}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-astronaut-blue-100">
          <div className="flex items-center space-x-2 text-lg font-bold text-astronaut-blue-900">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>₹{booking.total_amount.toLocaleString()}</span>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-astronaut-blue-300 text-astronaut-blue-700 bg-transparent"
          >
            <Link href={`/booking-details/${booking.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
