import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
  category: z.string().min(1),
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

  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      vehicleName: "",
      vehicleNumber: "",
      category: "",
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
  // Load Vehicle
  // -----------------------------
  useEffect(() => {
    async function loadVehicle() {
      try {
        const res = await vehicleApi.getAllVehicleDetailsByNumber(id);
        const v = res.data;

        setExistingVehicle(v);

        form.reset({
          vehicleName: v.vehicleName,
          vehicleNumber: v.numberPlate,
          category: v.type,
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
      } catch (err) {
        toast.error("Failed to load vehicle.");
        setLoading(false);
      }
    }

    loadVehicle();
  }, [id]);

  // -----------------------------
  // Submit Update
  // -----------------------------
  async function onSubmit(values) {
    if (!existingVehicle) return;

    try {
      await toast.promise(
        (async () => {
          const newVehicleImages =
            values.vehicleImages.length > 0
              ? await Promise.all(
                  values.vehicleImages.map((img) =>
                    uploadToSupabase(img, "vehicle-images")
                  )
                )
              : existingVehicle.vehicleImages;

          const newOwnerImage = values.ownerImage
            ? await uploadToSupabase(values.ownerImage, "owner-images")
            : existingVehicle.owner.ownerImage;

          const newDocumentUrl = values.documents
            ? await uploadToSupabase(values.documents, "vehicle-docs")
            : existingVehicle.documentUrl;

          const payload = {
            ...values,
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
          success: () => {
            goTo("/vehicle");
            return "Update successful! 👋";
          },
          error: "Update failed. Try again.",
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
      <PageBreadcrumb title="Edit Vehicle" paths={["Vehicle Management", ""]} />

      <div className="bg-white border border-gray-300 rounded-md shadow-2xl p-6">
        {/* SECTION TITLE */}
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* VEHICLE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Name */}
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Car / Van / Bus" />
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
                      <Input type="number" {...field} placeholder="4" />
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
                    <FormLabel>Cost Per KM</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="120.50" />
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
                    <FormLabel>Booking Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="1000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EXISTING IMAGES */}
              {existingVehicle.vehicleImages?.length > 0 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <h3 className="font-semibold mb-2">Current Vehicle Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingVehicle.vehicleImages.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        className="w-28 h-28 rounded border object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* UPLOAD NEW IMAGES */}
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

              {/* PDF Upload */}
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                    <FormLabel>Vehicle Document (PDF)</FormLabel>

                    <Button
                      variant="outline"
                      type="button"
                      onClick={() =>
                        document.getElementById("pdfUpload").click()
                      }
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
                        target="_blank"
                        className="text-blue-600 underline mt-2 block"
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                  <FormItem className="col-span-1 sm:col-span-2 lg:col-span-3">
                    <FormLabel>Description</FormLabel>
                    <Textarea className="h-32" {...field} />
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
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full Name" />
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
                    <FormLabel>NIC / Passport</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="NIC / Passport" />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="07X-XXXXXXX" />
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
                      <Input {...field} placeholder="Street / House No." />
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
                      <Input {...field} placeholder="Town / City" />
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
                      <Input {...field} placeholder="Province" />
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
                      <Input {...field} placeholder="Postal Code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
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
                      accept="image/*"
                      className="hidden"
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

            {/* ACTION BUTTONS */}
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
