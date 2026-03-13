import React from "react";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const navigate = useNavigate();

  const reports = [
     {
      title: "Earning Report",
      description: "View company earnings and financial reports",
      color: "bg-orange-600",
      path: "/reports/earnings",
    },
    {
      title: "Tour Report",
      description: "View all tours, bookings and tour statistics",
      color: "bg-blue-600",
      path: "/reports/toursreport",
    },
    // {
    //   title: "New Registered Drivers",
    //   description: "View newly registered drivers in the system",
    //   color: "bg-green-600",
    //   path: "/reports/drivers",
    // },
    // {
    //   title: "New Added Vehicles",
    //   description: "View vehicles recently added to the system",
    //   color: "bg-purple-600",
    //   path: "/reports/vehicles",
    // },
    //  {
    //   title: "New Added Tour Guides",
    //   description: "View newly added tour guides in the system",
    //   color: "bg-yellow-600",
    //   path: "/reports/tour-guides",
    // },
   
  ];

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold text-gray-800">
        Company Reports
      </h1>

      <p className="text-gray-500">
        Access system analytics and financial reports.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {reports.map((report, index) => (
          <div
            key={index}
            onClick={() => navigate(report.path)}
            className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border"
          >

            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${report.color}`}
            >
              {report.title.charAt(0)}
            </div>

            <h2 className="text-lg font-semibold mt-4">
              {report.title}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {report.description}
            </p>

            <button
              className="mt-4 text-sm text-blue-600 font-medium hover:underline"
            >
              View Report →
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ReportPage;