import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import uploadToSupabase from "@/utils/uploadImage";
import driverApi from "@/api/DriverApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Upload } from "lucide-react";

// -----------------------------
// Validation Schema
// -----------------------------
const editSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  nicNumber: z.string().min(9, "NIC number required"),

  dateOfBirth: z.string().min(1, "Date of birth required"),

  email: z.string().email("Invalid email"),
  phone1: z.string().min(1, "Primary phone required"),
  phone2: z.string().optional(),

  addressLine1: z.string().min(1, "Address line 1 required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City required"),
  stateProvince: z.string().min(1, "State / Province required"),
  postalCode: z.string().min(1, "Postal code required"),

  status: z.string().min(1, "Status is required"),

  // Files are optional in EDIT (keep old if not provided)
  licenseFile: z.instanceof(File).nullable().optional(),
  driverImage: z.instanceof(File).nullable().optional(),
});

export default function EditDriver() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [existingDriver, setExistingDriver] = useState(null);

  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nicNumber: "",
      dateOfBirth: "",
      email: "",
      phone1: "",
      phone2: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      status: "Active",
      licenseFile: null,
      driverImage: null,
    },
  });

  // -----------------------------
  // Load Driver
  // -----------------------------
  useEffect(() => {
    async function loadDriver() {
      try {
        const res = await driverApi.getDriverById(id);
        const d = res.data;

        setExistingDriver(d);

        form.reset({
          firstName: d.firstName,
          lastName: d.lastName,
          nicNumber: d.nicNumber,
          dateOfBirth: d.dateOfBirth, // assume "YYYY-MM-DD"
          email: d.email,
          phone1: d.phone1,
          phone2: d.phone2 || "",
          addressLine1: d.addressLine1,
          addressLine2: d.addressLine2 || "",
          city: d.city,
          stateProvince: d.stateProvince,
          postalCode: d.postalCode,
          status: d.status || "Active",
          licenseFile: null,
          driverImage: null,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load driver.");
        setLoading(false);
      }
    }

    loadDriver();
  }, [id, form]);

  // -----------------------------
  // Submit Update
  // -----------------------------
  async function onSubmit(values) {
    if (!existingDriver) return;

    try {
      await toast.promise(
        (async () => {
          // If new driver image selected → upload, else keep old
          const newDriverImageUrl = values.driverImage
            ? await uploadToSupabase(values.driverImage, "driver-images")
            : existingDriver.driverImage;

          // If new license PDF selected → upload, else keep old
          const newLicensePdfUrl = values.licenseFile
            ? await uploadToSupabase(values.licenseFile, "license-files")
            : existingDriver.licensePdfUrl;

          const payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            nicNumber: values.nicNumber,
            dateOfBirth: values.dateOfBirth,
            email: values.email,
            phone1: values.phone1,
            phone2: values.phone2,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            city: values.city,
            stateProvince: values.stateProvince,
            postalCode: values.postalCode,
            status: values.status,
            licensePdfUrl: newLicensePdfUrl,
            driverImage: newDriverImageUrl,
            // keep previous approval value unless you want to reset
            isApproved: existingDriver.isApproved ?? 0,
          };

          return driverApi.updateDriver(id, payload);
        })(),
        {
          loading: "Updating driver...",
          success: () => {
            goTo("/driver-management");
            return "Driver updated successfully! 👋";
          },
          error: (err) => {
            console.error(err);
            return "Update failed. Try again.";
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred!");
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <PageBreadcrumb title="Edit Driver" paths={["Driver Management", ""]} />

      <div className="bg-white border border-gray-300 rounded-md shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Driver Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* DRIVER BASIC DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Akila" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nilusha" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIC */}
              <FormField
                control={form.control}
                name="nicNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIC Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="200302302394" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="date" {...field} />
                        <CalendarIcon className="h-4 w-4 absolute right-3 top-3 opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="akila@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone 1 */}
              <FormField
                control={form.control}
                name="phone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0771234567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone 2 */}
              <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0719876543" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 1 */}
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="No. 25, Main Street" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 2 */}
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tholangamuwa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Kegalle" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State / Province */}
              <FormField
                control={form.control}
                name="stateProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sabaragamuwa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Postal Code */}
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="71000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Active / Inactive" />
                      {/* You can swap to <Select> if you want fixed options */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LICENSE (PDF) */}
              <FormField
                control={form.control}
                name="licenseFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver License (PDF)</FormLabel>

                    <FormControl>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() =>
                          document.getElementById("licensePdfUpload").click()
                        }
                      >
                        <Upload className="mr-2" /> Upload New License
                      </Button>
                    </FormControl>

                    <input
                      id="licensePdfUpload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

                    {/* Show existing license file link */}
                    {existingDriver.licensePdfUrl && (
                      <a
                        href={existingDriver.licensePdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline mt-2 block"
                      >
                        View Existing License PDF
                      </a>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DRIVER IMAGE */}
              <FormField
                control={form.control}
                name="driverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Image</FormLabel>
                    <FormControl>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() =>
                          document.getElementById("driverImageUpload").click()
                        }
                      >
                        <Upload className="mr-2" /> Upload New Image
                      </Button>
                    </FormControl>

                    <input
                      id="driverImageUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

                    {existingDriver.driverImage && (
                      <img
                        src={existingDriver.driverImage}
                        alt="Current driver"
                        className="w-24 h-24 rounded-full border mt-3 object-cover"
                      />
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/Driver")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-700 text-white">
                Update Driver
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
