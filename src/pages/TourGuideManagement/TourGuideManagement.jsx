import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";

import { Button } from "@/components/ui/button";
import { Plus, MoreVerticalIcon } from "lucide-react";
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

import useNavigator from "../../hooks/use-navigator";

function TourGuideManagement() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goTo = useNavigator();

  useEffect(() => {
    if (loading) {
      loadGuides();
      setLoading(false);
    }
  }, [loading]);

  async function loadGuides() {
    
    const sample = [
      {
        guideId: 1,
        guideImage:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
        firstName: "Akila",
        lastName: "Niluksha",
        dateOfBirth: "2001-06-06",
        phone1: "071-1234567",
        phone2: "077-7654321",
        email: "akila@gmail.com",
        addressLine1: "Kegalle",
        addressLine2: "",
        city: "Nuwara",
        status: "Active",
        isApproved: true,
      },
      {
        guideId: 2,
        guideImage:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
        firstName: "Lihini",
        lastName: "Thennakoon",
        dateOfBirth: "2000-09-02",
        phone1: "071-9876543",
        phone2: "",
        email: "lihini@gmail.com",
        addressLine1: "Matara",
        addressLine2: "Galle",
        city: "Hambanthota",
        status: "Inactive",
        isApproved: false,
      },
      {
        guideId: 3,
        guideImage:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
        firstName: "Milindu",
        lastName: "Gomes",
        dateOfBirth: "2001-10-08",
        phone1: "071-9876543",
        phone2: "116",
        email: "gomes@gmail.com",
        addressLine1: "No 254",
        addressLine2: "Moratuwa",
        city: "Colombo",
        status: "active",
        isApproved: false,
      },
    ];

    setGuides(sample);
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);


  }

  const guideColumns = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.guideId.toString()} />,
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

    {
      accessorKey: "guideImage",
      header: "Guide",
      cell: ({ row }) => (
        <img
          src={row.original.guideImage}
          alt="Guide"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },

    {
      accessorKey: "firstName",
      header: "Full Name",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },

    {
      accessorKey: "dateOfBirth",
      header: "Age",
      cell: ({ row }) => {
        const dob = new Date(row.original.dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        return age;
      },
    },

    { accessorKey: "phone1", header: "Phone 1" },
    { accessorKey: "phone2", header: "Phone 2" },
    { accessorKey: "email", header: "Email" },

    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) =>
        `${row.original.addressLine1}, ${row.original.addressLine2}, ${row.original.city}`,
    },

    { accessorKey: "status", header: "Status" },

    {
      accessorKey: "isApproved",
      header: "Approved",
      cell: ({ row }) => (row.original.isApproved ? "Approved" : "Pending"),
    },

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
            <DropdownMenuItem onClick={() => goTo(`edit/${row.original.guideId}`)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setSelectedGuide(row.original);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => alert("Guide: " + row.original.firstName)}>
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb title="Tour Guide Management" />

      <div className="bg-white border rounded-md shadow-2xl md:pb-3">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row px-6 py-3 border-b items-center gap-3">
          <h1 className="text-xl font-medium w-full md:w-auto">Tour Guide List</h1>

          <div className="ml-auto flex flex-col md:flex-row gap-3">
            <Button
              className="bg-blue-700 text-white hover:bg-blue-950"
              size="lg"
              onClick={() => goTo("/tour-guide-management/add")}
            >
              <Plus /> Add New Guide
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        <DataTable key={guides.length} columns={guideColumns} data={guides} rowIdAccessor="guideId" />
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Guide"
        message="Are you sure you want to delete"
        itemName={selectedGuide ? `${selectedGuide.firstName} ${selectedGuide.lastName}` : ""}
      />
    </div>
  );
}
export default TourGuideManagement;
