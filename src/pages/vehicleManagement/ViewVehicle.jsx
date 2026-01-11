import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import vehicleApi from "@/api/vehicleApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ViewVehicle() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [categories, setCategories] = useState([]);

  /* ---------------- LOAD CATEGORIES ---------------- */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await vehicleApi.getVehicleCategories();
        setCategories(
          res.data.map((c) => ({
            value: c.id,
            label: c.category,
          }))
        );
      } catch {
        toast.error("Failed to load categories");
      }
    }
    loadCategories();
  }, []);

  /* ---------------- LOAD VEHICLE ---------------- */
  useEffect(() => {
    async function loadVehicle() {
      try {
        const res = await vehicleApi.getAllVehicleDetailsByNumber(id);
        setVehicle(res.data);
      } catch {
        toast.error("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    }
    loadVehicle();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!vehicle) return <div className="p-6">No vehicle found</div>;

  return (
    <div className="p-6">
      <PageBreadcrumb title="View Vehicle" paths={["Vehicle Management",""]} />

      <div className="bg-white border rounded-md shadow p-6">

        {/* ---------- TOP HEADER ---------- */}
        <div className="flex items-center gap-6 mb-8">
          {vehicle.vehicleImages?.[0] && (
            <img
              src={vehicle.vehicleImages[0]}
              className="w-28 h-28 rounded-lg object-cover border"
            />
          )}

          <div>
            <h2 className="text-2xl font-semibold">
              {vehicle.vehicleName} ({vehicle.numberPlate})
            </h2>

            <span
              className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${
                vehicle.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : vehicle.status === "Maintenance"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {vehicle.status}
            </span>
          </div>
        </div>

        {/* ---------- VEHICLE DETAILS ---------- */}
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Field label="Vehicle Name">
            <Input value={vehicle.vehicleName} disabled />
          </Field>

          <Field label="Vehicle Number">
            <Input value={vehicle.numberPlate} disabled />
          </Field>

          <Field label="Category">
            <Select value={String(vehicle.type)} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={String(c.value)}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Passenger Count">
            <Input value={vehicle.passengerCount} disabled />
          </Field>

          <Field label="Cost Per KM">
            <Input value={vehicle.costPerKm} disabled />
          </Field>

          <Field label="Booking Price">
            <Input value={vehicle.bookingPrice} disabled />
          </Field>

          <Field label="Location">
            <Input value={vehicle.location} disabled />
          </Field>

          <Field label="Description">
            <Textarea value={vehicle.description} disabled />
          </Field>
        </div>

        {/* ---------- VEHICLE IMAGES ---------- */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Vehicle Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {vehicle.vehicleImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-24 h-24 rounded border object-cover"
              />
            ))}
          </div>
        </div>

        {/* ---------- OWNER DETAILS ---------- */}
        <h2 className="text-xl font-semibold mt-10 mb-4 border-t pt-4">
          Owner Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Field label="Owner Name">
            <Input value={vehicle.owner.name} disabled />
          </Field>

          <Field label="NIC / Passport">
            <Input value={vehicle.owner.nic} disabled />
          </Field>

          <Field label="Phone">
            <Input value={vehicle.owner.phone} disabled />
          </Field>

          <Field label="Address Line 1">
            <Input value={vehicle.owner.addressLine1} disabled />
          </Field>

          <Field label="Address Line 2">
            <Input value={vehicle.owner.addressLine2} disabled />
          </Field>

          <Field label="State / Province">
            <Input value={vehicle.owner.stateProvince} disabled />
          </Field>

          <Field label="Postal Code">
            <Input value={vehicle.owner.postalCode} disabled />
          </Field>

          <Field label="Date of Birth">
            <Input type="date" value={vehicle.owner.dateOfBirth} disabled />
          </Field>

          <Field label="Owner Image">
            {vehicle.owner.ownerImage && (
              <img
                src={vehicle.owner.ownerImage}
                className="w-24 h-24 rounded-full border"
              />
            )}
          </Field>
        </div>

        {/* ---------- DOCUMENT ---------- */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Vehicle Document</h3>
          {vehicle.documentUrl ? (
            <a
              href={vehicle.documentUrl}
              target="_blank"
              className="text-blue-600 underline"
            >
              View Document
            </a>
          ) : (
            <p className="text-gray-500">No document uploaded</p>
          )}
        </div>

        {/* ---------- ACTION ---------- */}
        <div className="flex justify-end mt-8">
          <Button variant="outline" onClick={() => goTo("/vehicle")}>
            Back
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
