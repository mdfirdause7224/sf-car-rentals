import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Customer", status: "Active", bookings: 5 },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Customer", status: "Active", bookings: 3 },
    { id: 3, name: "Alice Brown", email: "alice.b@example.com", role: "Admin", status: "Active", bookings: 0 },
    { id: 4, name: "Bob White", email: "bob.w@example.com", role: "Customer", status: "Inactive", bookings: 1 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-astronaut-blue-900 mb-6">User Management</h2>

      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl text-astronaut-blue-900">All Users</CardTitle>
          <CardDescription className="text-astronaut-blue-600">Manage user accounts and roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Input placeholder="Search users..." className="pl-10" />
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
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-astronaut-blue-700 uppercase tracking-wider">
                    Status
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-astronaut-blue-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-astronaut-blue-800">{user.bookings}</td>
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
