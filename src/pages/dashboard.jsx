import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Bookings",
      value: "124",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Active Tours",
      value: "18",
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Vehicles",
      value: "32",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Drivers",
      value: "21",
      gradient: "from-orange-500 to-orange-700",
    },
  ];

  const bookingData = [
    { month: "Jan", bookings: 20 },
    { month: "Feb", bookings: 35 },
    { month: "Mar", bookings: 50 },
    { month: "Apr", bookings: 40 },
    { month: "May", bookings: 60 },
  ];

  const tourData = [
    { name: "Completed", value: 60 },
    { name: "Ongoing", value: 25 },
    { name: "Upcoming", value: 15 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-600">
          TripGenix system overview (Interim Version)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl p-5 text-white bg-gradient-to-r ${item.gradient} shadow-lg`}
          >
            <p className="text-sm opacity-90">{item.title}</p>
            <h2 className="text-3xl font-bold mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Bookings
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingData}>
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Tour Status
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tourData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {tourData.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activities
        </h2>

        <ul className="space-y-3 text-gray-600 text-sm">
          <li>🟢 New booking added for Ella Tour</li>
          <li>🔵 Vehicle assigned to Kandy Trip</li>
          <li>🟣 Driver profile updated</li>
          <li>🟠 Email notification sent</li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center">
        TripGenix © {new Date().getFullYear()} – Interim Dashboard
      </p>
    </div>
  );
}
