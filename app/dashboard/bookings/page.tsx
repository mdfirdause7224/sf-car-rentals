import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminBookingsPage() {
  const bookings = [
    {
      id: "SF12345",
      user: "John Doe",
      car: "5-seater",
      pickup: "2024-07-20",
      return: "2024-07-22",
      status: "Confirmed",
      amount: 3600,
    },
    {
      id: "SF67890",
      user: "Jane Smith",
      car: "7-seater",
      pickup: "2024-07-25",
      return: "2024-07-28",
      status: "Pending",
      amount: 10500,
    },
    {
      id: "SF11223",
      user: "Alice Brown",
      car: "5-seater",
      pickup: "2024-07-10",
      return: "2024-07-11",
      status: "Completed",
      amount: 1800,
    },
    {
      id: "SF44556",
      user: "Bob White",
      car: "7-seater",
      pickup: "2024-08-01",
      return: "2024-08-05",
      status: "Cancelled",
      amount: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-astronaut-blue-900 mb-6">Booking Management</h2>

      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl text-astronaut-blue-900">All Bookings</CardTitle>
          <CardDescription className="text-astronaut-blue-600">
            View and manage all car rental bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input placeholder="Search bookings..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-astronaut-blue-200">
              <thead className="bg-astronaut-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Car Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Pickup Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-astronaut-blue-100">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-astronaut-blue-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{booking.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{booking.car}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{booking.pickup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{booking.return}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">
                      ₹{booking.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-astronaut-blue-600 hover:text-astronaut-blue-900"
                      >
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900 ml-2">
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
