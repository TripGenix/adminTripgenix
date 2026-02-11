import React from "react";
import { useNavigate } from "react-router-dom";
import { CarTaxiFront, Users, UserStar } from "lucide-react";

function PaymentHome() {
  const navigate = useNavigate();

  const paymentCards = [
    {
      title: "Driver Payments",
      description: "Manage and process payments for drivers.",
      icon: <Users size={32} />,
      route: "/payments/drivers",
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Vehicle Payments",
      description: "Manage vehicle owner payouts and expenses.",
      icon: <CarTaxiFront size={32} />,
      route: "/payments/vehicles",
      color: "from-green-500 to-green-700",
    },
    {
      title: "Tour Guide Payments",
      description: "Handle guide commission and settlements.",
      icon: <UserStar size={32} />,
      route: "/payments/guides",
      color: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Payment Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage commission distribution and payouts
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className={`cursor-pointer p-6 rounded-md text-white bg-gradient-to-r ${card.color} shadow-lg hover:scale-105 transition duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {card.title}
                </h2>
                <p className="text-sm opacity-90 mt-2">
                  {card.description}
                </p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentHome;
