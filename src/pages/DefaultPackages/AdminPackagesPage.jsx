import { useState,useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import useNavigator from "@/hooks/use-navigator";
import packageApi from "@/api/PackageApi";
import PackageForm from "./PackageForm";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";

const initialPackages = [
  {
    id: 1,
    name: "Bronze Package",
    totalPrice: 599,
    passengers:1,
    duration: "5 Days",
    destinations: ["Colombo", "Galle", "Kandy", "Sigiriya", "Negombo"],
    vehicle: "Economy Car",
    guide: "Standard Guide",
    features: [
      "5 Popular Destinations",
      "Economy Vehicle",
      "Standard Tour Guide",
      "Hotel Recommendations",
      "Basic Itinerary Planning",
    ],
    hotels:[
      "Hotel A",
      "Hotel B",
    ]
  },
  
];

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState(initialPackages);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const nav=useNavigator();

  const loadPackages = async () => {
    try {
      const res = await packageApi.getAllPackages();
      setPackages(res.data);
    } catch (err) {
      console.error("Failed to load packages", err);
      toast.error("Failed to load packages");
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

    // Delete packages
    const handleDelete = (id) => {
    const toastId= toast(
        <div>
          Are you sure you want to delete this package?
          <div className="mt-2 flex gap-2 justify-end">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={async () => {
                try {
                  await packageApi.deletePackage(id);
                  await loadPackages();
                  toast.dismiss(toastId);
                  toast.success("Package deleted successfully");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete package");
                }
              }}
            >
              Delete
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    };

    // Save package 
    const handleSave = async (pkg) => {
      try {
        if (pkg.id) {
          await packageApi.updatePackage(pkg.id, pkg);
          toast.success("Package updated successfully");
        } else {
          await packageApi.createPackage(pkg);
          toast.success("Package added successfully");
        }
        setShowForm(false);
        setEditing(null);
        await loadPackages();
      } catch (err) {
        console.error("Save failed", err);
        toast.error("Failed to save package");
      }
    };



  return (
    <div className="p-6">
      <PageBreadcrumb  paths={["Default Packages", []]} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Manage Tour Packages</h2>
        <button
          onClick={() => {
            nav("/packages/add")
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Package
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left ">Name</th>
              <th className="p-3">Price ($)</th>
              <th className="p-3">Passengers</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Guide</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-t">
                <td className="p-3">{pkg.name}</td>
                <td className="p-3 text-center">{pkg.totalPrice}</td>
                <td className="p-3 text-center">{pkg.passengers}</td>
                <td className="p-3 text-center">{pkg.duration}</td>
                <td className="p-3 text-center">{pkg.vehicle}</td>
                <td className="p-3 text-center">{pkg.guide}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => nav(`/packages/edit/${pkg.id}`)}
                    className="text-blue-600"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <PackageForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
