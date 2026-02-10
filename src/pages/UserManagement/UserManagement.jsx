import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DragHandle } from "@/components/data-table";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { toast } from "sonner";
import { Plus, MoreVerticalIcon, ChevronRight } from "lucide-react";


import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import userApi from "@/api/UserApi";
import useNavigator from "@/hooks/use-navigator";

export default function UserManagement() {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
const [togglingId, setTogglingId] = useState(null);

  const goTo = useNavigator();

  useEffect(() => {
    if (loading) {
      loadUsers();
      setLoading(false);
    }
  }, [loading,isDeleting]);

  async function loadUsers() {
    try {
      const response = await userApi.getAllUsers();
      setusers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }

const handleDeleteConfirm = async () => {
  const email = selectedUser?.email;   
  if (!email) return;

    setIsDeleting(true);
    try {
      await toast.promise(userApi.deleteUserByEmail(email), {
        loading: "Deleting user...",
        success: `user deleted successfully!`,
        error: "Fail to delete existing user.",
      });

      setSelectedUser(null);
      setDeleteModalOpen(false);

      setLoading(true);
    } finally {
      setIsDeleting(false);
    }
}

  // TABLE COLUMNS
  const userColumns = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.userId.toString()} />,
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


    // FULL NAME
    {
      accessorKey: "firstName",
      header: "Full Name",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },

    { accessorKey: "nic", header: "Nic Number" },

    // PHONES
    { accessorKey: "phone", header: "Phone" },

    // EMAIL
    { accessorKey: "email", header: "Email" },

    // ADDRESS
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) =>
        `${row.original.addressLine1}, ${row.original.addressLine2}, ${row.original.city}`,
    },

   {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const userId = row.original.userId;

        // supports active / isActive and 0/1 or true/false
        const isActive = Boolean(row.original.isActive ?? row.original.active);

        return (
          <div className="flex flex-col items-left gap-1">
            <button
              type="button"
              disabled={togglingId === userId}
              onClick={async () => {
                if (togglingId === userId) return;

                setTogglingId(userId);
                try {
                  await toast.promise(userApi.toggleUserStatus(userId), {
                    loading: "Updating status...",
                    success: "Status updated!",
                    error: "Failed to update status.",
                  });

                  setusers((prev) =>
                    prev.map((u) => {
                      if (u.userId !== userId) return u;

                        const current = Boolean(u.isActive ?? u.active);
                        const next = !current;
                        
                      return { ...u, isActive: next, active: next };
                    })
                  );
                } finally {
                  setTogglingId(null);
                }
              }}
              className={`relative w-15 h-5 rounded-full bg-zinc-400 overflow-hidden shadow-inner
                ${togglingId === userId ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              aria-label={isActive ? "Set Active" : "Set Inactive"}
            >
              {/* green fill */}
              <span
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300
                  ${!isActive ? "w-1/2 bg-gradient-to-r from-lime-400 to-lime-500" : "w-0 bg-lime-500"}`}
              />

              {/* knob */}
              <span
                className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg
                  flex items-center justify-center transition-all duration-300
                  ${!isActive ? "left-1/2 -translate-x-1/2 bg-lime-300" : "left-1 bg-zinc-600"}`}
              >
                <ChevronRight
                  className={`w-6 h-5 ${isActive ? "text-zinc-200" : "text-zinc-900"}`}
                />
              </span>
            </button>

          </div>
        );
      },
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
              onClick={() => goTo(`user-management/edit/${row.original.userId}`)}
            >
              Edit
            </DropdownMenuItem>

          <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(row.original);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>
            
          <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => goTo(`view/${row.original.userId}`)}
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
      <PageBreadcrumb title="Users Management" />

      <div className="bg-white border rounded-md shadow-2xl md:pb-3">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row px-6 py-3 border-b items-center gap-3">
          <h1 className="text-xl font-medium w-full md:w-auto">Users List</h1>

          <div className="ml-auto flex flex-col md:flex-row gap-3">
            <Button
              className="bg-blue-700 text-white hover:bg-blue-950"
              size="lg"
              onClick={() => goTo("User-management/add")}
            >
              <Plus /> Add New User
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        <DataTable
          key={users.length}
          columns={userColumns}
          data={users}
          rowIdAccessor="userId"
        />
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete User"
        message="Are you sure you want to delete"
        itemName={
          selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : ""
        }
      />
    </div>
  );
}
