import React, { useState } from "react";
import { Search, Calendar, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllTours() {
  const navigate = useNavigate();

  const [searchRef, setSearchRef] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  // Mock data (replace with API)
  const tours = [
    {
      id: "TR-10021",
      customer: "John Smith",
      route: "Colombo → Kandy",
      date: "2025-01-15",
      status: "New",
    },
    {
      id: "TR-10022",
      customer: "Emma Watson",
      route: "Negombo → Ella",
      date: "2025-01-18",
      status: "Ongoing",
    },
    {
      id: "TR-10023",
      customer: "David Miller",
      route: "Galle → Mirissa",
      date: "2025-01-10",
      status: "Completed",
    },
  ];

  const [filteredTours, setFilteredTours] = useState(tours);

  const handleSearch = () => {
    const results = tours.filter((tour) => {
      const matchesRef = tour.id
        .toLowerCase()
        .includes(searchRef.toLowerCase());

      const matchesStartDate = startDate
        ? new Date(tour.date) >= new Date(startDate)
        : true;

      const matchesEndDate = endDate
        ? new Date(tour.date) <= new Date(endDate)
        : true;

      const matchesStatus = status ? tour.status === status : true;

      return matchesRef && matchesStartDate && matchesEndDate && matchesStatus;
    });

    setFilteredTours(results);
  };

  const clearFilters = () => {
    setSearchRef("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setFilteredTours(tours);
  };

  const statusBadge = (status) => {
    const styles = {
      New: "bg-blue-100 text-blue-700",
      Ongoing: "bg-yellow-100 text-yellow-700",
      Completed: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return styles[status];
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-900">All Tours</h2>

      {/* FILTERS */}
      <div className="bg-white p-5 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Reference ID */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Reference ID"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-salt-500 outline-none"
          />
        </div>

        {/* Start Date */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-salt-500 outline-none"
        />

        {/* End Date */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-salt-500 outline-none"
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-salt-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          className="bg-slate-800 hover:bg-slate-600 text-white rounded-lg"
        >
          Search
        </button>

        {/* CLEAR */}
        <button
          onClick={clearFilters}
          className="border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Reference ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Route</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTours.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No tours found
                </td>
              </tr>
            ) : (
              filteredTours.map((tour) => (
                <tr
                  key={tour.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-salt-600">
                    {tour.id}
                  </td>
                  <td className="px-4 py-3">{tour.customer}</td>
                  <td className="px-4 py-3">{tour.route}</td>
                  <td className="px-4 py-3">{tour.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                        tour.status
                      )}`}
                    >
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/tours/view/${tour.id}`)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/tours/edit/${tour.id}`)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
