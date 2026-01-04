import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import vehicleApi from "@/api/vehicleApi";
import ImageUploader from "@/components/ImageUploder";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import uploadToSupabase from "@/utils/uploadImage";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import useNavigator from "@/hooks/use-navigator";
import { useState, useEffect } from "react";
import axios from "axios";

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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { CalendarIcon, Upload } from "lucide-react";

const schema = z.object({
  vehicleName: z.string().min(1, "Vehicle name is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  category: z.number().min(1, "Category is required"),
  passengerCount: z.string().min(1, "Passenger count is required"),
  costPerKm: z.string().min(1, "Cost per KM required"),
  bookingPrice: z.string().min(1, "Booking price required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().min(1, "Add details about your vehicle"),

  ownerName: z.string().min(1, "Owner name required"),
  ownerId: z.string().min(1, "Owner ID required"),
  phone: z.string().min(1, "Phone required"),
  address1: z.string().min(1, "Address line 1 required"),
  address2: z.string().min(1, "Address line 2 required"),
  state: z.string().min(1, "State required"),
  postalCode: z.string().min(1, "Postal code required"),
  dob: z.string().min(1, "Date of birth required"),

  // Multiple Images (must be at least 1)
  vehicleImages: z
    .array(z.instanceof(File))
    .min(1, "Upload at least one vehicle image"),

  // Single PDF file
  documents: z
    .instanceof(File)
    .nullable()
    .refine((file) => !file || file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),

  // Single Image (owner)
  ownerImage: z.instanceof(File, { message: "Owner image required" }),
});

// -------------------------------
// MAIN COMPONENT
// -------------------------------
export default function AddVehicle() {
  const goTo = useNavigator();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleName: "",
      vehicleNumber: "",
      category: "",
      passengerCount: "",
      costPerKm: "",
      bookingPrice: "",
      status: "Available",
      description: "",

      ownerName: "",
      ownerId: "",
      phone: "",
      address1: "",
      address2: "",
      state: "",
      postalCode: "",
      dob: "",

      vehicleImages: [],
      ownerImage: null,
      documents: null,
    },
  });

  const vehicleImages = form.watch("vehicleImages");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await vehicleApi.getVehicleCategories();
        const formatted = res.data.map((item) => ({
          value: item.id,
          label: item.Category,
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    }

    loadCategories();
  }, []);
  // SUBMIT LOGIC
  async function onSubmit(values) {
    console.log("Submitting...", values);

    try {
      await toast.promise(
        (async () => {
          // Upload Vehicle Images
          const uploadedVehicleImages = await Promise.all(
            values.vehicleImages.map((file) =>
              uploadToSupabase(file, `vehicle-images/${values.vehicleNumber}`)
            )
          );

          //Upload Owner Image
          const ownerImageUrl = await uploadToSupabase(
            values.ownerImage,
            `owner-images/${values.vehicleNumber}`
          );

          // Upload Document
          const documentUrl = await uploadToSupabase(
            values.documents,
            `vehicle-docs/${values.vehicleNumber}`
          );

          // Build payload
          const payload = {
            ...values,
            vehicleImages: uploadedVehicleImages,
            ownerImage: ownerImageUrl,
            documentUrl,
          };

          return vehicleApi.createVehicle(payload);
        })(),

        {
          loading: "Processing…",
          success: () => {
            goTo("/Vehicle");
            form.reset();
            return "Save successful! 👋";
          },
          error: (err) => {
            const backendMessage =
              err?.response?.data?.message ||
              err?.response?.data ||
              err.message ||
              "Please Try Again";

            return backendMessage;
          },
        }
      );
    } catch (err) {
      console.error("Save failed", err);
    }
  }

  return (
    <div className="p-6">
      <PageBreadcrumb title="Add Vehicle" paths={["Vehicle Management", []]} />

      <div className="bg-white border border-gray-300 rounded-md shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* VEHICLE DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="vehicleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota KDH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value ?? "")}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>

                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat.value}
                              value={String(cat.value)}
                            >
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passengerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passenger Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costPerKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Per KM (LKR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="120.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Price (LKR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* VEHICLE IMAGE UPLOADER */}
              <FormField
                control={form.control}
                name="vehicleImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Images</FormLabel>

                    <ImageUploader
                      images={Array.isArray(field.value) ? field.value : []}
                      setImages={(imgs) => field.onChange(imgs)}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PDF DOCUMENTS */}
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Documents (PDF)</FormLabel>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        type="button"
                        onClick={() =>
                          document.getElementById("docUpload").click()
                        }
                      >
                        <Upload className="mr-2" /> Upload PDF
                      </Button>
                    </FormControl>

                    <input
                      id="docUpload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

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
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter vehicle description..."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* OWNER DETAILS */}
            <h2 className="text-xl font-semibold pt-4 border-t">
              Vehicle Owner Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner ID (NIC / Passport)</FormLabel>
                    <FormControl>
                      <Input placeholder="NIC / Passport" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="07X-XXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="House No / Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Town / Area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Province" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Postal Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="date"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <CalendarIcon className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OWNER IMAGE */}
              <FormField
                control={form.control}
                name="ownerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Image</FormLabel>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        type="button"
                        onClick={() =>
                          document.getElementById("ownerImageInput").click()
                        }
                      >
                        <Upload className="mr-2" /> Upload Image
                      </Button>
                    </FormControl>

                    <input
                      id="ownerImageInput"
                      type="file"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Clear
              </Button>

              <Button
                type="submit"
                className="bg-blue-700 text-white hover:bg-blue-900"
              >
                Save Vehicle
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
