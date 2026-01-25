import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";

import { Button } from "@/components/ui/button";
import { Plus, MoreVerticalIcon, Search } from "lucide-react";
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
import tourGuideApi from "@/api/tourGuideApi";
import { Input } from "@/components/ui/input";

function TourGuideManagement() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goTo = useNavigator();

  useEffect(() => {
    
    if (loading) {
      loadDrivers();
      console.log(selectedGuide + "console");
          }
  }, [loading]);

  async function loadDrivers() {
    try {
      const response = await tourGuideApi.getAllGuides();
      console.log("Tour Guides Response:", response.data);
      console.log("First Guide Properties:", response.data[0]);
      setGuides(response.data);
    } catch (error) {
      console.error("Error loading drivers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    try {
      await toast.promise(
        tourGuideApi.deleteGuide(selectedGuideId),
        {
          loading: "Deleting Guide...",
          success: `Guide deleted successfully!`,
          error: "Failed to delete Guide. Try again.",
        }
      );

      setSelectedGuide(null);
      setSelectedGuideId(null);
      setDeleteModalOpen(false);
      setLoading(true); // reload list
    } finally {
      setIsDeleting(false);
    }
  }

  // Filter guides based on search query
  const filteredGuides = guides.filter((guide) =>
    guide.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const guideColumns = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={String(row.original.nic ?? "")} />,
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
      accessorKey: "image",
      header: "Guide",
      cell: ({ row }) => (
        <img
          src={row.original.image || "/avatar-placeholder.png"}
          alt="Guide"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },

    {
      accessorKey: "name",
      header: "Full Name",
    },

    {
      accessorKey: "language",
      header: "Language",
    },

    {
      accessorKey: "reviewId",
      header: "Review ID",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status ? (
          <span className="text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-red-600 font-medium">Inactive</span>
        ),
    },

    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ row }) => (row.original.driver ? "Yes" : "No"),
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
            <DropdownMenuItem onClick={() => goTo(`edit/${row.original.tourGuideId}`)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setSelectedGuide(row.original.tourGuideId);
                console.log("Selected Guide:", row.original);
                setSelectedGuideId(row.original.tourGuideId);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => goTo(`view/${row.original.tourGuideId}`)}
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
      <PageBreadcrumb title="Tour Guide Management" />

      <div className="bg-white border rounded-md shadow-2xl md:pb-3">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row px-6 py-3 border-b items-center gap-3">
          <h1 className="text-xl font-medium w-full md:w-auto">
            Tour Guide List
          </h1>

          <div className="ml-auto flex flex-col md:flex-row gap-3">
            <Button
              className="bg-blue-700 text-white hover:bg-blue-950"
              size="lg"
              onClick={() => goTo("/tour-guide/add")}
            >
              <Plus /> Add New Guide
            </Button>
          </div>
        </div>

        {/* SEARCH INPUT */}
        <div className="px-6 py-4 border-b flex justify-end">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by guide name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <DataTable
          key={guides.length}
          columns={guideColumns}
          data={filteredGuides}
         rowIdAccessor="nic"
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Guide"
        message="Are you sure you want to delete"
        itemName={selectedGuide ? selectedGuide.name : ""}  
      />
    </div>
  );
}

export default TourGuideManagement;
