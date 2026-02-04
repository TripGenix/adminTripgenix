import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import uploadToSupabase from "@/utils/uploadImage";
import driverApi from "@/api/DriverApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { toast } from "sonner";

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
import { CalendarIcon } from "lucide-react";
import useNavigator from "@/hooks/use-navigator";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import vehicleApi from "@/api/vehicleApi";

const animatedComponents = makeAnimated();

// ---------------- ZOD VALIDATION ----------------
const schema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  nicNumber: z.string().min(9, "NIC number required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  email: z.string().email("Invalid email"),
  phone1: z.string().min(1, "Phone number required"),
  phone2: z.string().min(1, "Secondary phone required"),

  addressLine1: z.string().min(1, "Address required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City required"),
  stateProvince: z.string().min(1, "State / Province required"),
  postalCode: z.string().min(1, "Postal code required"),

  // REQUIRED PDF
  licenseFile: z
    .instanceof(File, { message: "License PDF is required" })
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files allowed",
    }),

  // REQUIRED IMAGE
  driverImage: z
    .instanceof(File, { message: "Driver image required" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files allowed",
    }),

  status: z.string().min(1),

  selectedVehicleCategories: z.array(z.any()).optional(),
  selectedVehicleByNumber: z.array(z.any()).optional(),
});

// ---------------- MAIN COMPONENT ----------------
export default function CreateDriver() {
  const goTo = useNavigator();

  const form = useForm({
    resolver: zodResolver(schema),
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
      status: "PENDING",
      licenseFile: null,
      driverImage: null,
      selectedVehicleCategories: [],
      selectedVehicleByNumber: [],
    },
  });

  // ---------------- SUBMIT ----------------
  async function onSubmit(values) {
    console.log("👉 FORM SUBMITTED VALUES:", values);

    try {
      await toast.promise(
        (async () => {
          const driverImageUrl = await uploadToSupabase(
            values.driverImage,
            `driver-images/${values.nicNumber}`
          );

          const licensePdfUrl = await uploadToSupabase(
            values.licenseFile,
            `license-files/${values.nicNumber}`
          );

          const payload = {
            ...values,
            driverImage: driverImageUrl,
            licensePdfUrl,
            isApproved: 0,
          };

          console.log("👉 FINAL PAYLOAD SENT TO BACKEND:", payload);

          return driverApi.createDriver(payload);
        })(),
        {
          loading: "Saving driver...",
          success: () => {
            goTo("/driver-management");
            form.reset();
            return "Driver created successfully!";
          },
          error: (err) =>
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong",
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  // ---------------- LOAD CATEGORIES + VEHICLES ----------------
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [vehicleOptions, setVehicleOptions] = React.useState([]);

  useEffect(() => {
    async function loadData() {
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
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }

    loadData();
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="p-6">
      <PageBreadcrumb title="Add Driver" paths={["Driver Management", []]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Driver Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* DRIVER DETAILS */}
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

              {/* NIC */}
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

              {/* PHONE 1 */}
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

              {/* ADDRESS 1 */}
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

              {/* ADDRESS 2 */}
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

              {/* STATE */}
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

              {/* LICENSE PDF */}
              <FormField
                control={form.control}
                name="licenseFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver License (PDF)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] ?? null)
                        }
                      />
                    </FormControl>
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
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] ?? null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* VEHICLE SELECTION */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Vehicle Allocation</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CATEGORY */}
                <FormField
                  control={form.control}
                  name="selectedVehicleCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocate Vehicle By Category</FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Select vehicle Categories..."
                          isMulti
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          options={categoryOptions}
                          value={categoryOptions.filter((opt) =>
                            field.value?.includes(opt.value)
                          )}
                          onChange={(selected) =>
                            field.onChange(selected.map((i) => i.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* VEHICLE NUMBER */}
                <FormField
                  control={form.control}
                  name="selectedVehicleByNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allocate Vehicle By Number</FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Select vehicle By Number"
                          isMulti
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          options={vehicleOptions}
                          value={vehicleOptions.filter((opt) =>
                            field.value?.includes(opt.value)
                          )}
                          onChange={(selected) =>
                            field.onChange(selected.map((i) => i.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Clear
              </Button>

              <Button
                className="bg-blue-700 text-white hover:bg-blue-900"
                type="submit"
              >
                Save Driver
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
