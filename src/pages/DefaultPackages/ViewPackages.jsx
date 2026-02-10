import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import packageApi from "@/api/PackageApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export default function ViewPackages() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [packages, setpackages] = useState(null);

  useEffect(() => {
    async function loadPackage() {
      try {
        const res = await packageApi.getPackageById(id);
        setpackages(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    }
     loadPackage();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!packages) return <div className="p-6">No package found</div>;

    const destinations = Array.isArray(packages?.destinations)
    ? packages.destinations
    : typeof packages?.destinations === "string"
        ? packages.destinations.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const selectedDestination = destinations[0] ?? "";

    const hotels = Array.isArray(packages?.hotels)
    ? packages.hotels
    : typeof packages?.hotels === "string"
        ? packages.hotels.split(",").map(s => s.trim()).filter(Boolean)
        : [];

    const selectedHotels = hotels[0] ?? "";

  return (
    <div className="p-6">
      <PageBreadcrumb  paths={["Package Management", "View Package"]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Package Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Package Name">
            <Input value={packages.name?? ""} disabled />
          </Field>

         <Field label="Duration (in days/nights)">
            <Input value={packages.duration?? ""} disabled />
          </Field>

        <Field label="Destinations">
            <select
                className="w-full h-9 rounded-lg border-null border-gray-100 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm outline-none disabled:opacity-100 disabled:cursor-not-allowed"
                value={selectedDestination}
                onChange={() => {}} // keeps it "view-only" (won't change)
            >
                {destinations.length === 0 ? (
                <option value="">No destinations</option>
                ) : (
                destinations.map((d, idx) => (
                    <option key={`${d}-${idx}`} value={d}>
                    {d}
                    </option>
                ))
                )}
            </select>
        </Field>

            <Field label="Price (Per Person)">
            <Input
                value={
                packages.price != null && packages.price !== ""
                    ? `$${packages.price}`
                    : ""
                }
                disabled
            />
            </Field>


          <Field label="Passengers Allowed">
            <Input value={packages.passengers ?? ""} disabled />
          </Field>

          <Field label="Total Price">
            <Input value={
                packages.totalPrice !=null && packages.totalPrice!=""
                    ?`$${packages.totalPrice}`
                    :""
                }
                 disabled />
          </Field>
 
          <Field label="Vehicle Type">
            <Input value={packages.vehicle ?? ""} disabled />
          </Field>

          <Field label="Guide">
            <Input value={packages.guide ?? ""} disabled />
          </Field>

        <Field label="Hotels">
            <select
                className="w-full h-9 rounded-lg border-null border-gray-100 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm outline-none disabled:opacity-100 disabled:cursor-not-allowed"
                value={selectedHotels}
                onChange={() => {}} 
            >
                {hotels.length === 0 ? (
                <option value="">No hotels</option>
                ) : (
                hotels.map((d, idx) => (
                    <option key={`${d}-${idx}`} value={d}>
                    {d}
                    </option>
                ))
                )}
            </select>
        </Field>

          <Field label="Description">
            <Input value={packages.features ?? ""} disabled />
          </Field>

        </div>

        <div className="flex justify-end mt-8">
          <Button variant="outline" onClick={() => goTo("/packages")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
