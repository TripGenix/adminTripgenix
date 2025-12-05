import { DataTable } from "../components/data-table";
import PageBreadcrumb from "../components/common/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DragHandle } from "@/components/data-table";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import vehicleApi from "@/api/vehicleApi";
import useNavigator from "@/hooks/use-navigator";

export const vehicleColumns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.vehicleId.toString()} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center ">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
        />
      </div>
    ),
  },

  // MATCH YOUR VEHICLE FIELDS HERE
  {
    accessorKey: "numberPlate",
    header: "Plate Number",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "passengerCount",
    header: "Passengers",
  },
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
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("en-US"),
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => alert(`Vehicle Plate: ${row.original.numberPlate}`)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const goTo = useNavigator();

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const response = await vehicleApi.getAllVehicles();
      console.log("API Data:", response.data);

      setVehicles(response.data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <PageBreadcrumb title="Vehicle Management" />
      <div className="bg-white border border-[948E8E] rounded-md shadow-2xl md:pb-3">
        <div
          className="
  flex flex-col md:flex-row
  px-6 py-3 border-b
  text-center md:text-left
  items-center 
  gap-3 md:gap-0
"
        >
          <h1 className="text-xl font-medium w-full md:w-auto">Vehicle List</h1>

          <div className="ml-auto flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              className="border border-1 border-black w-full md:w-auto"
              size="lg"
            >
              <Download />
              Export
            </Button>

            <Button
              className="bg-blue-700 text-white hover:bg-blue-950 w-full md:w-auto"
              size="lg"
              onClick={() => goTo("/add-vehicle")}
            >
              <Plus />
              Add New Vehicle
            </Button>
          </div>
        </div>
        <DataTable
          columns={vehicleColumns}
          data={vehicles}
          rowIdAccessor="vehicleId" // 🔥 add this
        />{" "}
      </div>
    </div>
  );
}
