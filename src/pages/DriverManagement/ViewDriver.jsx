import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Select from "react-select";

import driverApi from "@/api/DriverApi";
import vehicleApi from "@/api/vehicleApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ViewDriver() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);

  /* ---------------- LOAD SUPPORT DATA ---------------- */
  useEffect(() => {
    async function loadSupportData() {
      try {
        const [catRes, vehRes] = await Promise.all([
          vehicleApi.getVehicleCategories(),
          vehicleApi.getVehicleNumbers(),
        ]);

        setCategoryOptions(
          catRes.data.map((c) => ({
            value: c.id,
            label: c.category,
          }))
        );

        setVehicleOptions(
          vehRes.data.map((v) => ({
            value: v.vehicleId,
            label: v.numberPlate,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vehicle data");
      }
    }

    loadSupportData();
  }, []);

  /* ---------------- LOAD DRIVER ---------------- */
  useEffect(() => {
    async function loadDriver() {
      try {
        const res = await driverApi.getDriverById(id);
        setDriver(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load driver");
      } finally {
        setLoading(false);
      }
    }

    loadDriver();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!driver) return <div className="p-6">No driver found</div>;

  return (
    <div className="p-6">
      <PageBreadcrumb title="View Driver" paths={["Driver Management",""]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Driver Details</h2>

        {/* ---------- DRIVER FORM (READ ONLY) ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Field label="First Name">
            <Input value={driver.firstName} disabled />
          </Field>

          <Field label="Last Name">
            <Input value={driver.lastName} disabled />
          </Field>

          <Field label="NIC Number">
            <Input value={driver.nicNumber} disabled />
          </Field>

          <Field label="Date of Birth">
            <Input type="date" value={driver.dateOfBirth} disabled />
          </Field>

          <Field label="Email">
            <Input value={driver.email} disabled />
          </Field>

          <Field label="Primary Phone">
            <Input value={driver.phone1} disabled />
          </Field>

          <Field label="Secondary Phone">
            <Input value={driver.phone2} disabled />
          </Field>

          <Field label="Address Line 1">
            <Input value={driver.addressLine1} disabled />
          </Field>

          <Field label="Address Line 2">
            <Input value={driver.addressLine2 || ""} disabled />
          </Field>

          <Field label="City">
            <Input value={driver.city} disabled />
          </Field>

          <Field label="State / Province">
            <Input value={driver.stateProvince} disabled />
          </Field>

          <Field label="Postal Code">
            <Input value={driver.postalCode} disabled />
          </Field>

          <Field label="Status">
            <Input value={driver.status} disabled />
          </Field>
        </div>

        {/* ---------- VEHICLE ALLOCATION ---------- */}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          Vehicle Allocation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Field label="Vehicle Categories">
            <Select
              isMulti
              isDisabled
              options={categoryOptions}
              value={categoryOptions.filter((opt) =>
                driver.selectedVehicleCategories?.includes(opt.value)
              )}
            />
          </Field>

          <Field label="Vehicle Numbers">
            <Select
              isMulti
              isDisabled
              options={vehicleOptions}
              value={vehicleOptions.filter((opt) =>
                driver.selectedVehicleByNumber?.includes(opt.value)
              )}
            />
          </Field>
        </div>

        {/* ---------- LICENSE & IMAGE ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

          <Field label="Driver License">
            {driver.licensePdfUrl ? (
              <a
                href={driver.licensePdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View License PDF
              </a>
            ) : (
              <p className="text-gray-500">No license uploaded</p>
            )}
          </Field>

          <Field label="Driver Image">
            {driver.driverImage && (
              <img
                src={driver.driverImage}
                alt="Driver"
                className="w-28 h-28 rounded-full border object-cover"
              />
            )}
          </Field>
        </div>

        {/* ---------- ACTION ---------- */}
        <div className="flex justify-end mt-8">
          <Button variant="outline" onClick={() => goTo("/driver-management")}>
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
