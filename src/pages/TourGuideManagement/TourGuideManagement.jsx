import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";

import { Button } from "@/components/ui/button";
import { Plus, Download, MoreVerticalIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DragHandle } from "@/components/data-table";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { toast } from "sonner";

function TourGuideManagement() {
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
            {/* <Button variant="outline" className="border border-black" size="lg">
              <Download /> Export
            </Button> */}

            <Button
              className="bg-blue-700 text-white hover:bg-blue-950"
              size="lg"
              onClick={() => goTo("/driver-management/add")}
            >
              <Plus /> Add New Guide
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        {/* <DataTable
          key={drivers.length}
          columns={driverColumns}
          data={drivers}
          rowIdAccessor="driverId"
        /> */}
      </div>

      {/* DELETE MODAL */}
      {/* <DeleteConfirmModal
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
      /> */}
    </div>
  );
}

export default TourGuideManagement;
