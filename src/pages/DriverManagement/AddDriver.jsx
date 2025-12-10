import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import uploadToSupabase from "@/utils/uploadImage";
import driverApi from "@/api/DriverApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { toast } from "sonner";

import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, CalendarIcon } from "lucide-react";
import useNavigator from "@/hooks/use-navigator";


// ZOD VALIDATION SCHEMA
const schema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  nicNumber: z.string().min(9, "NIC number required"),

  dateOfBirth: z.string().min(1, "Date of birth required"),

  email: z.string().email("Invalid email"),
  phone1: z.string().min(1, "Phone number required"),
  phone2: z.string().optional(),

  addressLine1: z.string().min(1, "Address required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City required"),
  stateProvince: z.string().min(1, "State / Province required"),
  postalCode: z.string().min(1, "Postal code required"),

  // License PDF
  licenseFile: z
    .instanceof(File)
    .nullable()
    .refine((file) => !file || file.type === "application/pdf", {
      message: "Only PDF files allowed",
    }),

  // Driver Image
  driverImage: z.instanceof(File, { message: "Driver image required" }),

  status: z.string().min(1),
});



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
      status: "Active",
      licenseFile: null,
      driverImage: null,
    },
  });

  // SUBMIT HANDLER
  async function onSubmit(values) {
    try {
      await toast.promise(
        (async () => {
          // Upload driver image
          const driverImageUrl = await uploadToSupabase(
            values.driverImage,
            `driver-images/${values.nicNumber}`
          );

          // Upload license (PDF)
          const licensePdfUrl = values.licenseFile
            ? await uploadToSupabase(values.licenseFile, `license-files/${values.nicNumber}`)
            : null;

          // Build payload for backend
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
            licensePdfUrl,
            driverImage: driverImageUrl,
            status: values.status,
            isApproved: 0,
          };

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

  return (
    <div className="p-6">
      <PageBreadcrumb title="Add Driver" paths={["Driver Management", []]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Driver Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

            {/* DRIVER BASIC DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* FIRST NAME */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
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
                    <FormControl><Input  {...field} /></FormControl>
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
                    <FormControl><Input type="email" {...field} /></FormControl>
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
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE 2 */}
              <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone (Optional)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />

              {/* ADDRESS */}
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stateProvince"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
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
                          document.getElementById("licenseUpload").click()
                        }
                      >
                        <Upload className="mr-2" /> Upload License
                      </Button>
                    </FormControl>

                    <input
                      id="licenseUpload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

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
                          document.getElementById("driverImageInput").click()
                        }
                      >
                        <Upload className="mr-2" /> Upload Image
                      </Button>
                    </FormControl>

                    <input
                      id="driverImageInput"
                      type="file"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Clear
              </Button>

              <Button className="bg-blue-700 text-white hover:bg-blue-900" type="submit">
                Save Driver
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
