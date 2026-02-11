import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";

import { Button } from "@/components/ui/button";
import { Plus, MoreVerticalIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DragHandle } from "@/components/data-table";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { toast } from "sonner";
import tourGuideApi from "@/api/TourGuideApi";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goTo = useNavigator();

  // ✅ LOAD ONCE
  useEffect(() => {
    loadGuides();
  }, []);

  // async function loadGuides() {
  //   try {
  //     const res = await tourGuideApi.getAllGuides();
  //     console.log("RAW GUIDE RESPONSE:", res.data);

  //     const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

  //     // ✅ NORMALIZE ID FIELD
  //     const normalized = res.data.map((g) => ({
  //       ...g,
  //       guideId: g.tourGuideId,
  //     }));

  //     setGuides(normalized);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to load tour guides");
  //   }
  // }

  // async function handleDeleteConfirm() {
  //   if (!selectedGuide) return;

  //   try {
  //     setIsDeleting(true);
  //     await tourGuideApi.deleteGuide(selectedGuide.guideId);
  //     toast.success("Guide deleted");

  //     setDeleteModalOpen(false);
  //     loadGuides();
  //   } catch {
  //     toast.error("Delete failed");
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // }

  async function loadGuides() {
    try {
      const res = await tourGuideApi.getAllGuides();
      console.log("RAW GUIDE RESPONSE:", res.data);

      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      // ✅ FIX: Use consistent ID field - tourGuideId is the primary key
      const normalized = list.map((g) => ({
        ...g,
        guideId: g.tourGuideId || g.tourId || g.guideId, // Fallback chain
      }));

      setGuides(normalized);
    } catch (err) {
      console.error("Load guides error:", err.response?.data || err);
      toast.error("Failed to load tour guides");
    }
  }

  async function handleDeleteConfirm() {
    if (!selectedGuide) return;

    try {
      setIsDeleting(true);
      console.log("Deleting guide with ID:", selectedGuide.guideId); // Debug log
      await tourGuideApi.deleteGuide(selectedGuide.guideId);
      toast.success("Guide deleted");

      setDeleteModalOpen(false);
      loadGuides();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }

  // ✅ SAFE COLUMNS
  const guideColumns = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={String(row.original.guideId)} />,
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

    // IMAGE
    {
      header: "Guide",
      cell: ({ row }) => (
        <img
          src={row.original.image || row.original.guideImage}
          alt="guide"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },

    // NAME
    {
      header: "Full Name",
      cell: ({ row }) =>
        row.original.name ||
        `${row.original.firstName || ""} ${row.original.lastName || ""}`,
    },

    { accessorKey: "nic", header: "NIC" },
    { accessorKey: "language", header: "Language" },
    { accessorKey: "reviewId", header: "Review ID" },
    {
      accessorKey: "hourlyRate",
      header: "Hourly Rate (LKR)",
      cell: ({ row }) => row.original.hourlyRate ? `${row.original.hourlyRate}` : "N/A"
    },

    {
      header: "Status",
      cell: ({ row }) => (row.original.status ? "Active" : "Inactive"),
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
              onClick={() => goTo(`view/${row.original.guideId}`)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => goTo(`edit/${row.original.guideId}`)}
            >
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
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageBreadcrumb title="Tour Guide Management" />

      <div className="bg-white border rounded-md shadow-2xl">
        {/* HEADER */}
        <div className="flex px-6 py-3 border-b items-center">
          <h1 className="text-xl font-medium">Tour Guide List</h1>

          <Button
            className="ml-auto bg-blue-700 text-white hover:bg-blue-950"
            onClick={() => goTo("/tour-guide/add")}
          >
            <Plus /> Add New Guide
          </Button>
        </div>

        {/* TABLE */}
        <DataTable
          columns={guideColumns}
          data={guides}
          rowIdAccessor="guideId"
        />
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Guide"
        message="Are you sure you want to delete"
        itemName={
          selectedGuide
            ? selectedGuide.name ||
            `${selectedGuide.firstName} ${selectedGuide.lastName}`
            : ""
        }
      />
    </div>
  );
}

export default TourGuideManagement;
