import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Car, Users, CalendarCheck, DollarSign } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-astronaut-blue-900 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-astronaut-blue-700">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-astronaut-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-astronaut-blue-900">150</div>
            <p className="text-xs text-muted-foreground">+20 new this month</p>
          </CardContent>
        </Card>

        <Card
          className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-scale-in"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-astronaut-blue-700">Active Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-astronaut-blue-900">75</div>
            <p className="text-xs text-muted-foreground">+5 today</p>
          </CardContent>
        </Card>

        <Card
          className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-scale-in"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-astronaut-blue-700">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-astronaut-blue-900">5,200</div>
            <p className="text-xs text-muted-foreground">+150 new users</p>
          </CardContent>
        </Card>

        <Card
          className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-scale-in"
          style={{ animationDelay: "0.3s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-astronaut-blue-700">Revenue (Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-astronaut-blue-900">₹1,250,000</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl text-astronaut-blue-900">Recent Activity</CardTitle>
          <CardDescription className="text-astronaut-blue-600">Latest bookings and user registrations.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-astronaut-blue-800">
            <li className="flex items-center space-x-2 p-2 bg-astronaut-blue-50 rounded-lg">
              <CalendarCheck className="h-4 w-4 text-green-500" />
              <span>New booking for John Doe (5-seater)</span>
            </li>
            <li className="flex items-center space-x-2 p-2 bg-astronaut-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-purple-500" />
              <span>New user registered: Jane Smith</span>
            </li>
            <li className="flex items-center space-x-2 p-2 bg-astronaut-blue-50 rounded-lg">
              <Car className="h-4 w-4 text-astronaut-blue-500" />
              <span>Car "Maruti Swift Dzire" marked as available</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
