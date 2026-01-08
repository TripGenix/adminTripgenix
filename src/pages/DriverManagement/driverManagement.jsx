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

import driverApi from "@/api/DriverApi";
import useNavigator from "@/hooks/use-navigator";
import { set } from "zod";

export default function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goTo = useNavigator();

  useEffect(() => {
    if (loading) {
      loadDrivers();
      setLoading(false);
    }
  }, [loading,isDeleting]);

  async function loadDrivers() {
    try {
      const response = await driverApi.getAllDrivers();
      setDrivers(response.data);
    } catch (error) {
      console.error("Error loading drivers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);

    try {
      await toast.promise(driverApi.deleteDriver(selectedDriver.driverId), {
        loading: "Deleting driver...",
        success: `Driver deleted successfully!`,
        error: "Failed to delete driver. Try again.",
      });

      setSelectedDriver(null);
      setDeleteModalOpen(false);

      setLoading(true);
    } finally {
      setIsDeleting(false);
    }
  }

  // TABLE COLUMNS
  const driverColumns = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.driverId.toString()} />,
    },

    // CHECKBOX SELECT
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

    // IMAGE
    {
      accessorKey: "driverImage",
      header: "Driver",
      cell: ({ row }) => (
        <img
          src={row.original.driverImage}
          alt="Driver"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },

    // FULL NAME
    {
      accessorKey: "firstName",
      header: "Full Name",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },

    // DOB
    {
      accessorKey: "dateOfBirth",
      header: "Age",
      cell: ({ row }) => {
        const dob = new Date(row.original.dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        // adjust if birthday hasn't happened yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        return age;
      },
    },

    { accessorKey: "nicNumber", header: "Nic Number" },

    // PHONES
    { accessorKey: "phone1", header: "Phone 1" },
    { accessorKey: "phone2", header: "Phone 2" },

    // EMAIL
    { accessorKey: "email", header: "Email" },

    // ADDRESS
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) =>
        `${row.original.addressLine1}, ${row.original.addressLine2}, ${row.original.city}`,
    },

    // STATUS
    { accessorKey: "status", header: "Status" },

    // APPROVAL STATUS
    {
      accessorKey: "isApproved",
      header: "Approved",
      cell: ({ row }) => (row.original.isApproved ? "Approved" : "Pending"),
    },

    // CREATED DATE

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
              onClick={() => goTo(`edit/${row.original.driverId}`)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setSelectedDriver(row.original);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => goTo(`view/${row.original.driverId}`)}
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
      <PageBreadcrumb title="Drivers Management" />

      <div className="bg-white border rounded-md shadow-2xl md:pb-3">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row px-6 py-3 border-b items-center gap-3">
          <h1 className="text-xl font-medium w-full md:w-auto">Drivers List</h1>

          <div className="ml-auto flex flex-col md:flex-row gap-3">
            {/* <Button variant="outline" className="border border-black" size="lg">
              <Download /> Export
            </Button> */}

            <Button
              className="bg-blue-700 text-white hover:bg-blue-950"
              size="lg"
              onClick={() => goTo("/driver-management/add")}
            >
              <Plus /> Add New Driver
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        <DataTable
          key={drivers.length}
          columns={driverColumns}
          data={drivers}
          rowIdAccessor="driverId"
        />
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Driver"
        message="Are you sure you want to delete"
        itemName={
          selectedDriver
            ? `${selectedDriver.firstName} ${selectedDriver.lastName}`
            : ""
        }
      />
    </div>
  );
}
