import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";

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

import packageApi from "@/api/PackageApi";
import useNavigator from "@/hooks/use-navigator";

export default function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goTo = useNavigator();

  useEffect(() => {
    if (loading) {
      loadPackages();
      setLoading(false);
    }
  }, [loading]);

  async function loadPackages() {
    try {
      const response = await packageApi.getAllPackages();
      setPackages(response.data);
    } catch (error) {
      console.error("Failed to load packages", error);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);

    try {
      await toast.promise(packageApi.deletePackage(selectedPackage.id), {
        loading: "Deleting package...",
        success: "Package deleted successfully!",
        error: "Failed to delete package",
      });

      setSelectedPackage(null);
      setDeleteModalOpen(false);
      setLoading(true);
    } finally {
      setIsDeleting(false);
    }
  }

  // ================= TABLE COLUMNS =================
  const packageColumns = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id.toString()} />,
    },

    // SELECT CHECKBOX
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

    // PACKAGE NAME
    { accessorKey: "name", header: "Package Name" },

    // PRICE
    {
      accessorKey: "totalPrice",
      header: "Price ($)",
      cell: ({ row }) => `$${row.original.totalPrice}`,
    },

    // PASSENGERS
    {
      accessorKey: "passengers",
      header: "Passengers",
    },

    // DURATION
    {
      accessorKey: "duration",
      header: "Duration",
    },

    // VEHICLE
    {
      accessorKey: "vehicle",
      header: "Vehicle",
    },

    // GUIDE
    {
      accessorKey: "guide",
      header: "Guide",
    },

    // ACTIONS
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
              onClick={() => goTo(`/packages/edit/${row.original.id}`)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setSelectedPackage(row.original);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => goTo(`/packages/view/${row.original.id}`)}
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
      <PageBreadcrumb title="Package Management" />

      <div className="bg-white border rounded-md shadow-2xl md:pb-3">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row px-6 py-3 border-b items-center gap-3">
          <h1 className="text-xl font-medium w-full md:w-auto">
            Tour Packages
          </h1>

          <div className="ml-auto flex flex-col md:flex-row gap-3">
            {/* <Button variant="outline" className="border border-black" size="lg">
              <Download /> Export
            </Button> */}

            <Button
              className="bg-blue-700 text-white hover:bg-blue-950"
              size="lg"
              onClick={() => goTo("/packages/add")}
            >
              <Plus /> Add New Package
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        <DataTable
          key={packages.length}
          columns={packageColumns}
          data={packages}
          rowIdAccessor="id"
        />
      </div>

      {/* DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Package"
        message="Are you sure you want to delete"
        itemName={selectedPackage?.name || ""}
      />
    </div>
  );
}
