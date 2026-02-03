import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import tourGuideApi from "@/api/tourGuideApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ViewTourGuide() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState(null);

  /* ---------------- LOAD TOUR GUIDE ---------------- */
  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await tourGuideApi.searchGuide(id);
        setGuide(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tour guide");
      } finally {
        setLoading(false);
      }
    }

    loadGuide();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!guide) return <div className="p-6">No tour guide found</div>;

  return (
    <div className="p-6">
      <PageBreadcrumb
        title="View Tour Guide"
        paths={["Tour Guide Management", ""]}
      />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Tour Guide Details</h2>

        {/* ---------- TOUR GUIDE FORM (READ ONLY) ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Field label="Full Name">
            <Input value={guide.name || ""} disabled />
          </Field>

          <Field label="NIC Number">
            <Input value={guide.nic || ""} disabled />
          </Field>

          <Field label="Age">
            <Input value={guide.age || ""} disabled />
          </Field>

          <Field label="Email">
            <Input value={guide.email || ""} disabled />
          </Field>

          <Field label="Primary Phone">
            <Input value={guide.phone1 || ""} disabled />
          </Field>

          <Field label="Secondary Phone">
            <Input value={guide.phone2 || ""} disabled />
          </Field>

          <Field label="Language">
            <Input value={guide.language || ""} disabled />
          </Field>

          <Field label="Address Line 1">
            <Input value={guide.addressLine1 || ""} disabled />
          </Field>

          <Field label="Address Line 2">
            <Input value={guide.addressLine2 || ""} disabled />
          </Field>

          <Field label="City">
            <Input value={guide.city || ""} disabled />
          </Field>

          <Field label="State / Province">
            <Input value={guide.stateProvince || ""} disabled />
          </Field>

          <Field label="Postal Code">
            <Input value={guide.postalCode || ""} disabled />
          </Field>

          <Field label="Status">
            <Input 
              value={guide.status ? "Active" : "Inactive"} 
              disabled 
            />
          </Field>

          <Field label="Review ID">
            <Input value={guide.reviewId || ""} disabled />
          </Field>

          <Field label="Driver Assignment">
            <Input 
              value={guide.driver ? "Yes" : "No"} 
              disabled 
            />
          </Field>
        </div>

        {/* ---------- PROFILE IMAGE ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

          <Field label="Tour Guide Image">
            {guide.image ? (
              <img
                src={guide.image}
                alt="Tour Guide"
                className="w-28 h-28 rounded-full border object-cover"
              />
            ) : (
              <p className="text-gray-500">No image uploaded</p>
            )}
          </Field>
        </div>

        {/* ---------- ACTION ---------- */}
        <div className="flex justify-end mt-8 gap-3">
          <Button 
            variant="outline" 
            onClick={() => goTo("/tour-guide")}
          >
            Back
          </Button>
          <Button 
            className="bg-blue-700 text-white hover:bg-blue-950"
            onClick={() => goTo(`/tour-guide/edit/${id}`)}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL HELPER ---------- */
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
