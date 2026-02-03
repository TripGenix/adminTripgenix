
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
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goTo = useNavigator();

  useEffect(() => {
    if (loading) loadGuides();
  }, [loading]);

  async function loadGuides() {
    try {
      const res = await tourGuideApi.getAllGuides();
      setGuides(res.data);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function searchGuides(name) {
    try {
      const res = await tourGuideApi.searchGuideByName(name);
      setGuides(res.data ? [res.data] : []);
    } catch {
      setGuides([]);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setLoading(true);
      } else {
        searchGuides(searchQuery);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    try {
      await toast.promise(
        tourGuideApi.deleteGuide(selectedGuideId),
        {
          loading: "Deleting Guide...",
          success: "Guide deleted successfully!",
          error: "Delete failed",
        }
      );
      setLoading(true);
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

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
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
    },
    {
      accessorKey: "image",
      header: "Guide",
      cell: ({ row }) => (
        <img
          src={row.original.image || "/avatar-placeholder.png"}
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    { accessorKey: "name", header: "Full Name" },
    { accessorKey: "language", header: "Language" },
    { accessorKey: "reviewId", header: "Review ID" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-red-600">Inactive</span>
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
                setSelectedGuideId(row.original.tourGuideId);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => goTo(`view/${row.original.tourGuideId}`)}>
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

      <div className="bg-white border rounded-md shadow-2xl">
        <div className="flex px-6 py-3 border-b items-center">
          <h1 className="text-xl font-medium">Tour Guide List</h1>
          <Button
            className="ml-auto bg-blue-700 text-white"
            onClick={() => goTo("/tour-guide/add")}
          >
            <Plus /> Add New Guide
          </Button>
        </div>

        <div className="px-6 py-4 border-b flex justify-end">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by guide name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <DataTable
          key={guides.length}
          columns={guideColumns}
          data={guides}
          rowIdAccessor="nic"
        />
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Guide"
        message="Are you sure?"
      />
    </div>
  );
}

export default TourGuideManagement;

