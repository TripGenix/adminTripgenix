import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";

import { Button } from "@/components/ui/button";
import { Plus, Download, MoreVerticalIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DragHandle } from "@/components/data-table";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import vehicleApi from "@/api/vehicleApi";
import useNavigator from "@/hooks/use-navigator";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goTo = useNavigator();

  // Load vehicles on mount
  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const response = await vehicleApi.getAllVehicles();
      setVehicles(response.data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);

    try {
      await toast.promise(vehicleApi.deleteVehicle(selectedVehicle.vehicleId), {
        loading: "Deleting vehicle...",
        success: `${selectedVehicle.numberPlate} deleted successfully!`,
        error: "Failed to delete vehicle. Try again.",
      });

      setSelectedVehicle(null);
      setDeleteModalOpen(false);

      await loadVehicles();
    } finally {
      setIsDeleting(false);
    }
  }

  // COLUMNS (inside component so it can access state)
  const vehicleColumns = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.vehicleId.toString()} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
        />
      ),
    },

    { accessorKey: "vehicleName", header: "Vehicle Name" },
    { accessorKey: "numberPlate", header: "Plate Number" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "passengerCount", header: "Passengers" },

    {
      accessorKey: "costPerKm",
      header: "Cost per KM (LKR)",
      cell: ({ row }) => `Rs. ${row.original.costPerKm.toFixed(2)}`,
    },
    {
      accessorKey: "bookingPrice",
      header: "Booking Price (LKR)",
      cell: ({ row }) => `Rs. ${row.original.bookingPrice.toFixed(2)}`,
    },

    { accessorKey: "status", header: "Status" },

    {
      accessorKey: "createdAt",
      header: "Create Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-US"),
    },

    // ACTION MENU
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => goTo(`edit/${row.original.vehicleId}`)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setSelectedVehicle(row.original);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => alert("View Vehicle: " + row.original.numberPlate)}
            >
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb title="Vehicle Management" />

      <div className="bg-white border rounded-md shadow-2xl md:pb-3">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row px-6 py-3 border-b items-center gap-3">
          <h1 className="text-xl font-medium w-full md:w-auto">Vehicle List</h1>

          <div className="ml-auto flex flex-col md:flex-row gap-3">
            <Button variant="outline" className="border border-black" size="lg">
              <Download /> Export
            </Button>

            <Button
              className="bg-blue-700 text-white hover:bg-blue-950"
              size="lg"
              onClick={() => goTo("/vehicle/add")}
            >
              <Plus /> Add New Vehicle
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <DataTable
          key={vehicles.map((d) => d.vehicleId).join("-")}
          columns={vehicleColumns}
          data={vehicles}
          rowIdAccessor="vehicleId"
        />
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Vehicle"
        message="Are you sure you want to delete"
        itemName={
          selectedVehicle
            ? `${selectedVehicle.type} ${selectedVehicle.numberPlate}`
            : ""
        }
      />
    </div>
  );
}
