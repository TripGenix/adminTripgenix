import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";

import vehicleApi from "@/api/vehicleApi";
import uploadToSupabase from "@/utils/uploadImage";
import ImageUploader from "@/components/ImageUploder";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { CalendarIcon, Upload } from "lucide-react";

// -----------------------------
// Validation Schema
// -----------------------------
const editSchema = z.object({
  vehicleName: z.string().min(1),
  vehicleNumber: z.string().min(1),
  category: z.number().min(1),
  passengerCount: z.string().min(1),
  costPerKm: z.string().min(1),
  bookingPrice: z.string().min(1),
  status: z.string().min(1),
  description: z.string().min(1),

  ownerName: z.string().min(1),
  ownerId: z.string().min(1),
  phone: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  dob: z.string().min(1),

  vehicleImages: z.array(z.instanceof(File)).default([]),
  documents: z.instanceof(File).nullable().optional(),
  ownerImage: z.instanceof(File).nullable().optional(),
});

export default function EditVehicle() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [existingVehicle, setExistingVehicle] = useState(null);
  const [categories, setCategories] = useState([]);

  // -----------------------------
  // FORM
  // -----------------------------
  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      vehicleName: "",
      vehicleNumber: "",
      category: 0,
      passengerCount: "",
      costPerKm: "",
      bookingPrice: "",
      status: "",
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

  // -----------------------------
  // Load Categories
  // -----------------------------
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = awaitvehicleApi.getVehicleCategories();

        const formatted = res.data.map((item) => ({
          value: item.id,
          label: item.Category,
        }));

        setCategories(formatted);
      } catch {
        console.error("Failed to load categories");
      }
    }

    loadCategories();
  }, []);

  // Load Vehicle
  useEffect(() => {
    async function loadVehicle() {
      try {
        const res = await vehicleApi.getAllVehicleDetailsByNumber(id);
        const v = res.data;

        setExistingVehicle(v);

        form.reset({
          vehicleName: v.vehicleName,
          vehicleNumber: v.numberPlate,
          category: Number(v.type),
          passengerCount: String(v.passengerCount),
          costPerKm: String(v.costPerKm),
          bookingPrice: String(v.bookingPrice),
          status: v.status,
          description: v.description,

          ownerName: v.owner.name,
          ownerId: v.owner.nic,
          phone: v.owner.phone,
          address1: v.owner.addressLine1,
          address2: v.owner.addressLine2,
          state: v.owner.stateProvince,
          postalCode: v.owner.postalCode,
          dob: v.owner.dateOfBirth,

          vehicleImages: [],
          ownerImage: null,
          documents: null,
        });

        setLoading(false);
      } catch {
        toast.error("Failed to load vehicle.");
        setLoading(false);
      }
    }

    loadVehicle();
  }, [id]);

  // Auto select category
  useEffect(() => {
    if (existingVehicle && categories.length > 0) {
      form.setValue("category", Number(existingVehicle.type));
    }
  }, [categories, existingVehicle]);
  

  // Submit Update
  async function onSubmit(values) {
    if (!existingVehicle) return;

    try {
      await toast.promise(
        (async () => {
          const newVehicleImages =
            values.vehicleImages.length > 0
              ? await Promise.all(
                  values.vehicleImages.map((file) =>
                    uploadToSupabase(
                      file,
                      `vehicle-images/${values.vehicleNumber}`
                    )
                  )
                )
              : existingVehicle.vehicleImages;

          const newOwnerImage = values.ownerImage
            ? await uploadToSupabase(
                values.ownerImage,
                `owner-images/${values.vehicleNumber}`
              )
            : existingVehicle.owner.ownerImage;

          const newDocumentUrl = values.documents
            ? await uploadToSupabase(
                values.documents,
                `vehicle-docs/${values.vehicleNumber}`
              )
            : existingVehicle.documentUrl;

          const payload = {
            ...values,
            category: Number(values.category),
            passengerCount: Number(values.passengerCount),
            costPerKm: Number(values.costPerKm),
            bookingPrice: Number(values.bookingPrice),
            vehicleImages: newVehicleImages,
            ownerImage: newOwnerImage,
            documentUrl: newDocumentUrl,
          };

          return vehicleApi.updateVehicle(id, payload);
        })(),

        {
          loading: "Updating vehicle...",
          success: "Vehicle updated successfully!",
          error: "Update failed. Try again.",
        }
      );

      goTo("/vehicle");
    } catch {
      toast.error("Unexpected error occurred!");
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-6">
      <PageBreadcrumb title="Edit Vehicle" paths={["Vehicle Management"]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* GRID = responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* VEHICLE NAME */}
              <FormField
                control={form.control}
                name="vehicleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Toyota KDH" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* VEHICLE NUMBER */}
              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ABC-1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={String(cat.value)}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSENGER COUNT */}
              <FormField
                control={form.control}
                name="passengerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passenger Count</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* COST PER KM */}
              <FormField
                control={form.control}
                name="costPerKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Per KM</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BOOKING PRICE */}
              <FormField
                control={form.control}
                name="bookingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* EXISTING IMAGES */}
            <div className="w-full md:w-6/12">
              <h3 className="font-semibold mb-2">Current Vehicle Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {existingVehicle.vehicleImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className="w-24 h-24 rounded border object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ADD NEW IMAGES */}
              <FormField
                control={form.control}
                name="vehicleImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add More Images</FormLabel>
                    <ImageUploader
                      images={field.value}
                      setImages={(imgs) => field.onChange(imgs)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOCUMENT UPLOAD */}
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Document (PDF)</FormLabel>

                    <Button
                      variant="outline"
                      type="button"
                      onClick={() =>
                        document.getElementById("pdfUpload").click()
                      }
                      className="w-full"
                    >
                      <Upload className="mr-2" /> Upload PDF
                    </Button>

                    <input
                      id="pdfUpload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

                    {existingVehicle.documentUrl && (
                      <a
                        href={existingVehicle.documentUrl}
                        className="text-blue-600 underline mt-2 block"
                        target="_blank"
                      >
                        View Current PDF
                      </a>
                    )}

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
                    <Select value={field.value} onValueChange={field.onChange}>
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

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Textarea className="h-28" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* OWNER DETAILS */}
            <h2 className="text-xl font-semibold pt-4 border-t">
              Owner Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* OWNER NAME */}
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
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
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIC / Passport</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
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
                name="address1"
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
                name="address2"
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

              {/* STATE */}
              <FormField
                control={form.control}
                name="state"
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

              {/* POSTAL */}
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

              {/* DOB */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="date" {...field} />
                        <CalendarIcon className="absolute h-4 w-4 right-3 top-3 opacity-50" />
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

                    <Button
                      variant="outline"
                      type="button"
                      onClick={() =>
                        document.getElementById("ownerImg").click()
                      }
                    >
                      <Upload className="mr-2" /> Upload New Image
                    </Button>

                    <input
                      id="ownerImg"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />

                    {existingVehicle.owner.ownerImage && (
                      <img
                        src={existingVehicle.owner.ownerImage}
                        className="w-24 h-24 rounded-full border mt-3"
                      />
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/vehicle")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-700 text-white">
                Update Vehicle
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
