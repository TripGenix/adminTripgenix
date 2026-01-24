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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Upload } from "lucide-react";

import ReactSelect from "react-select";
import axios from "axios";
import vehicleApi from "@/api/vehicleApi";

// ------------------ VALIDATION ------------------
const editSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  nicNumber: z.string().min(9, "NIC number required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  email: z.string().email("Invalid email"),
  phone1: z.string().min(1, "Primary phone required"),
  phone2: z.string().min(1, "Secondary phone required"),
  addressLine1: z.string().min(1, "Address line 1 required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City required"),
  stateProvince: z.string().min(1, "State / Province required"),
  postalCode: z.string().min(1, "Postal code required"),
  status: z.string().min(1),

  licenseFile: z.instanceof(File).nullable().optional(),
  driverImage: z.instanceof(File).nullable().optional(),

  selectedVehicleCategories: z.array(z.number()).optional(),
  selectedVehicleByNumber: z.array(z.number()).optional(),
});

export default function EditDriver() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [existingDriver, setExistingDriver] = useState(null);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);

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
      selectedVehicleCategories: [],
      selectedVehicleByNumber: [],
    },
  });

  // ------------------ LOAD SUPPORTING DATA ------------------
  useEffect(() => {
    async function loadSupportingData() {
      try {
        const resCategory = await vehicleApi.getVehicleCategories();
        setCategoryOptions(
          resCategory.data.map((item) => ({
            value: item.id,
            label: item.category,
          }))
        );

        const resVehicles = await vehicleApi.getVehicleNumbers();
        setVehicleOptions(
          resVehicles.data.map((item) => ({
            value: item.vehicleId,
            label: item.numberPlate,
          }))
        );
      } catch (err) {
        console.error("Loading category/vehicle error", err);
      }
    }

    loadSupportingData();
  }, []);

  // ------------------ LOAD DRIVER ------------------
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
          dateOfBirth: d.dateOfBirth,
          email: d.email,
          phone1: d.phone1,
          phone2: d.phone2,
          addressLine1: d.addressLine1,
          addressLine2: d.addressLine2,
          city: d.city,
          stateProvince: d.stateProvince,
          postalCode: d.postalCode,
          status: d.status,

          selectedVehicleCategories: d.selectedVehicleCategories || [],
          selectedVehicleByNumber: d.selectedVehicleByNumber || [],

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

  // ------------------ SUBMIT UPDATE ------------------
  async function onSubmit(values) {
    if (!existingDriver) return;

    try {
      await toast.promise(
        (async () => {
          const newDriverImageUrl = values.driverImage
            ? await uploadToSupabase(
                values.driverImage,
                `driver-images/${values.nicNumber}`
              )
            : existingDriver.driverImage;

          const newLicensePdfUrl = values.licenseFile
            ? await uploadToSupabase(
                values.licenseFile,
                `license-files/${values.nicNumber}`
              )
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
            isApproved: existingDriver.isApproved ?? 0,

            selectedVehicleCategories: values.selectedVehicleCategories,
            selectedVehicleByNumber: values.selectedVehicleByNumber,
          };

          return driverApi.updateDriver(id, payload);
        })(),
        {
          loading: "Updating driver...",
          success: () => {
            goTo("/driver-management");
            return "Driver updated successfully!";
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

  // ------------------ UI ------------------
  return (
    <div className="p-6">
      <PageBreadcrumb title="Edit Driver" paths={["Driver Management"]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Driver Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* FIRST NAME */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LAST NAME */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIC NUMBER */}
              <FormField
                control={form.control}
                name="nicNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIC Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        <CalendarIcon className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PRIMARY PHONE */}
              <FormField
                control={form.control}
                name="phone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SECONDARY PHONE */}
              <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ADDRESS LINE 1 */}
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ADDRESS LINE 2 */}
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CITY */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATE / PROVINCE */}
              <FormField
                control={form.control}
                name="stateProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* POSTAL CODE */}
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATUS */}
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Pending_verification">Pending Verification</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LICENSE PDF */}
              <FormField
                control={form.control}
                name="licenseFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver License (PDF)</FormLabel>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
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
                        type="button"
                        variant="outline"
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
                        alt="Driver"
                        className="w-24 h-24 rounded-full object-cover border mt-3"
                      />
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ---------------- VEHICLE ALLOCATION ---------------- */}
            <h2 className="text-xl font-semibold mb-4">Vehicle Allocation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* BY CATEGORY */}
              <FormField
                control={form.control}
                name="selectedVehicleCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocate Vehicle By Category</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isMulti
                        options={categoryOptions}
                        value={categoryOptions.filter((opt) =>
                          field.value?.includes(opt.value)
                        )}
                        onChange={(selected) =>
                          field.onChange(selected.map((i) => i.value))
                        }
                        placeholder="Select categories..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BY VEHICLE NUMBER */}
              <FormField
                control={form.control}
                name="selectedVehicleByNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocate Vehicle By Number</FormLabel>
                    <FormControl>
                      <ReactSelect
                        isMulti
                        options={vehicleOptions}
                        value={vehicleOptions.filter((opt) =>
                          field.value?.includes(opt.value)
                        )}
                        onChange={(selected) =>
                          field.onChange(selected.map((i) => i.value))
                        }
                        placeholder="Select vehicles..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => goTo("/driver-management")}>
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
