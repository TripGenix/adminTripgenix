import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import uploadToSupabase from "@/utils/uploadImage";
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
import useNavigator from "@/hooks/use-navigator";
import Select from "react-select";
import driverApi from "@/api/DriverApi";
import tourGuideApi from "@/api/tourGuideApi";

// ---------- schema ----------
const schema = z.object({
  name: z.string().min(1, "Name required"),
  nic: z.string().optional(),
  language: z.string().optional(),
  reviewId: z.coerce.number().optional(),
  image: z.instanceof(File, { message: "Image required" }),
  status: z.boolean(),
  driver: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .nullable()
    .optional(),
});

export default function AddTourGuide() {
  const goTo = useNavigator();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      nic: "",
      language: "",
      reviewId: undefined,
      image: null,
      status: true,
      driver: null,
    },
  });

  const [driverOptions, setDriverOptions] = React.useState([]);

  // ---------- load drivers ----------
  useEffect(() => {
    async function loadDrivers() {
      try {
        const res = await driverApi.getAllDrivers();
        const items = res?.data || [];

        console.log("Loaded drivers:", items);

        const options = items.map((d) => ({
          value: Number(d.driverId), // ✅ from your console screenshot
          label: `${d.firstName} ${d.lastName}`,
        }));

        setDriverOptions(options);
      } catch (e) {
        console.error("Driver load failed", e);
      }
    }

    loadDrivers();
  }, []);

  // ---------- submit ----------
  async function onSubmit(values) {
    try {
      await toast.promise(
        (async () => {
          const imageUrl = await uploadToSupabase(
            values.image,
            `guide-images/${values.nic || values.name}`
          );

          // ✅ send driver ID only
          const payload = {
            name: values.name,
            nic: values.nic,
            language: values.language,
            reviewId: values.reviewId ?? null,
            image: imageUrl,
            status: values.status,
            driver: values.driver ? values.driver.value : null,
          };

          console.log("Submitting payload:", payload);

          await tourGuideApi.createGuide(payload);
          return true;
        })(),
        {
          loading: "Saving guide...",
          success: () => {
            goTo("/tour-guide-management");
            form.reset();
            return "Tour guide created";
          },
          error: (err) => {
            console.log("SERVER ERROR:", err?.response?.data);
            return "Save failed";
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  // ---------- UI ----------
  return (
    <div className="p-6">
      <PageBreadcrumb
        title="Add Tour Guide"
        paths={["Tour Guide Management", []]}
      />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Guide Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* NAME */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIC */}
              <FormField
                name="nic"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIC</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />

              {/* LANGUAGE */}
              <FormField
                name="language"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />

              {/* REVIEW ID */}
              <FormField
                name="reviewId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* STATUS */}
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => {
                  const opts = [
                    { value: true, label: "Active" },
                    { value: false, label: "Inactive" },
                  ];
                  return (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          options={opts}
                          value={opts.find(o => o.value === field.value)}
                          onChange={(opt) => field.onChange(opt.value)}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              {/* ✅ DRIVER — FULLY FIXED */}
              <FormField
                name="driver"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associate Driver</FormLabel>
                    <FormControl>
                      <Select
                        options={driverOptions}
                        isClearable
                        value={
                          driverOptions.find(
                            (opt) => opt.value === field.value?.value
                          ) || null
                        }
                        onChange={(opt) => field.onChange(opt)}
                        getOptionValue={(o) => String(o.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* IMAGE */}
              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
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
                Save Guide
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
