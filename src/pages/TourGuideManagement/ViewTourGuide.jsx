import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import tourGuideApi from "@/api/tourGuideApi";
import driverApi from "@/api/DriverApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ViewTourGuide() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState(null);
  const [driverName, setDriverName] = useState("Not Assigned");

  useEffect(() => {
    async function loadData() {
      try {
        if (!id) return;

        // 1. Fetch Guide
        const res = await tourGuideApi.getGuideById(id);
        const guideData = Array.isArray(res.data)
          ? res.data[0]
          : (res.data?.data?.[0] || res.data?.data || res.data);

        if (!guideData) {
          toast.error("Guide not found");
          setLoading(false);
          return;
        }

        setGuide(guideData);

        // 2. Fetch Driver Name if driverId exists
        if (guideData.driverId) {
          try {
            // Try fetching specific driver if API supports it, or generic list
            // Using getAllDrivers as per existing patterns in Edit/Add
            const driverRes = await driverApi.getAllDrivers();
            const drivers = driverRes?.data || [];
            const foundDriver = drivers.find(d => String(d.driverId) === String(guideData.driverId));
            if (foundDriver) {
              setDriverName(`${foundDriver.firstName} ${foundDriver.lastName}`);
            } else {
              setDriverName(`ID: ${guideData.driverId} (Not found in list)`);
            }
          } catch (err) {
            console.error("Failed to load driver info", err);
            setDriverName(`ID: ${guideData.driverId}`);
          }
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load tour guide details");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!guide) return <div className="p-6">No tour guide found.</div>;

  return (
    <div className="p-6">
      <PageBreadcrumb title="View Tour Guide" paths={["Tour Guide Management", []]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Tour Guide Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Full Name">
            <Input value={guide.name || `${guide.firstName || ""} ${guide.lastName || ""}`} disabled />
          </Field>

          <Field label="NIC">
            <Input value={guide.nic || ""} disabled />
          </Field>

          <Field label="Language">
            <Input value={guide.language || ""} disabled />
          </Field>

          <Field label="Review ID">
            <Input value={guide.reviewId || "N/A"} disabled />
          </Field>

          <Field label="Status">
            <Input
              value={
                (typeof guide.status === 'string' && guide.status.toLowerCase() === 'active') || guide.status === true
                  ? "Active"
                  : "Inactive"
              }
              disabled
            />
          </Field>

          <Field label="Associated Driver">
            <Input value={driverName} disabled />
          </Field>
        </div>

        {/* PROFILE IMAGE */}
        <div className="mt-8">
          <label className="text-sm font-medium block mb-2">Guide Image</label>
          {guide.guideImage || guide.image ? (
            <img
              src={guide.guideImage || guide.image}
              alt="Tour Guide"
              className="w-32 h-32 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-32 h-32 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8 gap-3">
          <Button variant="outline" onClick={() => goTo("/tour-guide-management")}>
            Back
          </Button>
          <Button className="bg-blue-700 text-white hover:bg-blue-900" onClick={() => goTo(`/tour-guide/edit/${id}`)}>
            Edit Guide
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}