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
export const vehicleColumns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
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
    accessorKey: "name",
    header: "Vehicle Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "number",
    header: "Plate Number",
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
            onClick={() => alert(`Vehicle Plate: ${row.original.number}`)}
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
  const vehicles = [
    { id: 1, name: "Toyota Prius", type: "Car", number: "ABC-1234" },
    { id: 2, name: "Nissan Leaf", type: "EV", number: "XYZ-8888" },
    { id: 3, name: "Bajaj 3-Wheeler", type: "Tuk", number: "TT-4455" },
    { id: 4, name: "Honda Fit", type: "Car", number: "HK-2299" },
    { id: 5, name: "Mitsubishi Outlander", type: "Car", number: "MO-3411" },
    { id: 6, name: "Tesla Model 3", type: "EV", number: "EV-9988" },
    { id: 7, name: "Toyota Axio", type: "Car", number: "AX-4567" },
    { id: 8, name: "Nissan e-NV200", type: "EV", number: "EV-5522" },
    { id: 9, name: "Piaggio Ape", type: "Tuk", number: "TU-3321" },
    { id: 10, name: "Kia Niro EV", type: "EV", number: "NI-7654" },
    { id: 11, name: "Hyundai Kona", type: "Car", number: "KO-8493" },
    { id: 12, name: "Renault Zoe", type: "EV", number: "ZE-1123" },
    { id: 13, name: "Suzuki WagonR", type: "Car", number: "WR-5628" },
    { id: 14, name: "Tuk Master 200", type: "Tuk", number: "TK-3349" },
    { id: 15, name: "BYD Dolphin", type: "EV", number: "DL-9833" },
    { id: 16, name: "Toyota Allion", type: "Car", number: "AL-6723" },
    { id: 17, name: "MG ZS EV", type: "EV", number: "MG-4522" },
    { id: 18, name: "Hero Tuk Deluxe", type: "Tuk", number: "TK-7812" },
    { id: 19, name: "Toyota Corolla", type: "Car", number: "CR-9211" },
    { id: 20, name: "Nissan Ariya", type: "EV", number: "AR-5510" },
  ];

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
            >
              <Plus />
              Add New Vehicle
            </Button>
          </div>
        </div>

        <DataTable columns={vehicleColumns} data={vehicles} />
      </div>
    </div>
  );
}
