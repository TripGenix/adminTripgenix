import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Select from "react-select";

import uploadToSupabase from "@/utils/uploadImage";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";
import driverApi from "@/api/DriverApi";
import tourGuideApi from "@/api/tourGuideApi";

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

// Schema matches AddTourGuide, but image is optional for update
const schema = z.object({
    name: z.string().min(1, "Name required"),
    nic: z.string().optional(),
    language: z.string().optional(),
    reviewId: z.coerce.number().optional(),
    image: z.instanceof(File).nullable().optional(),
    status: z.boolean(),
    driver: z
        .object({
            value: z.number(),
            label: z.string(),
        })
        .nullable()
        .optional(),
});

export default function EditTourGuide() {
    const { id } = useParams();
    const goTo = useNavigator();

    const [loading, setLoading] = useState(true);
    const [existingGuide, setExistingGuide] = useState(null);
    const [driverOptions, setDriverOptions] = useState([]);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            nic: "",
            language: "",
            reviewId: undefined,
            status: true,
            driver: null,
            image: null,
        },
    });

    // Load drivers
    useEffect(() => {
        async function loadDrivers() {
            try {
                const res = await driverApi.getAllDrivers();
                const items = res?.data || [];
                const options = items.map((d) => ({
                    value: Number(d.driverId),
                    label: `${d.firstName} ${d.lastName}`,
                }));
                setDriverOptions(options);
            } catch (e) {
                console.error("Driver load failed", e);
            }
        }
        loadDrivers();
    }, []);

    // Load guide data from API
    useEffect(() => {
        async function loadGuide() {
            if (!id) return;
            try {
                const res = await tourGuideApi.searchGuide(id);
                console.log("Guide fetched:", res.data);

                // Handle different response structures gracefully
                const guide = Array.isArray(res.data)
                    ? res.data[0]
                    : (res.data?.data?.[0] || res.data?.data || res.data);

                if (guide) {
                    setExistingGuide(guide);

                    // Map API data to form fields
                    form.reset({
                        name: guide.name || `${guide.firstName || ""} ${guide.lastName || ""}`.trim(),
                        nic: guide.nic || "",
                        language: guide.language || "",
                        reviewId: guide.reviewId,
                        status: typeof guide.status === 'string'
                            ? guide.status.toLowerCase() === "active"
                            : !!guide.status,
                        // Map driver using driverId or driver object from API
                        driver: guide.driverId ? {
                            value: guide.driverId,
                            label: guide.driverName || "Associated Driver"
                        } : null,
                        image: null,
                    });
                } else {
                    toast.error("Guide not found");
                }
            } catch (err) {
                console.error("Failed to load guide:", err);
                toast.error("Failed to load guide details.");
            } finally {
                setLoading(false);
            }
        }

        loadGuide();
    }, [id, form]);

    async function onSubmit(values) {
        try {
            await toast.promise(
                (async () => {
                    const imageUrl = values.image
                        ? await uploadToSupabase(values.image, `guide-images/${values.nic || values.name}`)
                        : existingGuide?.guideImage || existingGuide?.image;

                    const payload = {
                        tourGuideId: id,
                        name: values.name,
                        nic: values.nic,
                        language: values.language,
                        reviewId: values.reviewId ?? null,
                        image: imageUrl,
                        status: values.status,
                        driver: values.driver ? values.driver.value : null, // Changed from driverId to driver to match AddTourGuide
                    };

                    console.log("Updating payload:", payload);

                    await tourGuideApi.updateGuide(payload);
                    return true;
                })(),
                {
                    loading: "Updating guide...",
                    success: () => {
                        goTo("/tour-guide-management");
                        return "Guide updated successfully";
                    },
                    error: (err) => {
                        console.error("Update error:", err);
                        return err?.response?.data?.message || err.message || "Update failed";
                    }
                }
            );
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <div className="p-6">Loading…</div>;

    return (
        <div className="p-6">
            <PageBreadcrumb title="Edit Tour Guide" paths={["Tour Guide Management", []]} />

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
                                        <FormMessage />
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
                                        <FormMessage />
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
                                        <FormMessage />
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
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* ASSOCIATE DRIVER */}
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
                                                    ) ||
                                                    (field.value ? { value: field.value.value, label: field.value.label } : null)
                                                }
                                                onChange={(opt) => field.onChange(opt)}
                                                getOptionValue={(o) => String(o.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
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

                                        {(existingGuide?.guideImage || existingGuide?.image) && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                                                <img
                                                    src={existingGuide.guideImage || existingGuide.image}
                                                    alt="Current Guide"
                                                    className="w-24 h-24 rounded-full object-cover border"
                                                />
                                            </div>
                                        )}

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => goTo("/tour-guide-management")}>
                                Cancel
                            </Button>

                            <Button className="bg-blue-700 text-white hover:bg-blue-900" type="submit">
                                Update Guide
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}