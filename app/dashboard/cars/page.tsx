import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PlusCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminCarsPage() {
  const cars = [
    { id: 1, name: "Maruti Swift Dzire", type: "5-seater", status: "Available", location: "Delhi", bookings: 120 },
    { id: 2, name: "Toyota Innova Crysta", type: "7-seater", status: "Booked", location: "Mumbai", bookings: 85 },
    { id: 3, name: "Honda Amaze", type: "5-seater", status: "Maintenance", location: "Bangalore", bookings: 90 },
    { id: 4, name: "Mahindra XUV700", type: "7-seater", status: "Available", location: "Chennai", bookings: 60 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-astronaut-blue-900 mb-6">Car Inventory Management</h2>

      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-astronaut-blue-900">All Cars</CardTitle>
            <CardDescription className="text-astronaut-blue-600">Manage your fleet of rental cars.</CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-astronaut-blue-600 to-astronaut-blue-700 text-white rounded-xl">
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Car
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input placeholder="Search cars..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-astronaut-blue-200">
              <thead className="bg-astronaut-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-astronaut-blue-100">
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-astronaut-blue-900">
                      {car.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{car.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{car.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          car.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : car.status === "Booked"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{car.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{car.bookings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-astronaut-blue-600 hover:text-astronaut-blue-900"
                      >
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900 ml-2">
                        Delete
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
