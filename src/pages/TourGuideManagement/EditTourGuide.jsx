import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import uploadToSupabase from "@/utils/uploadImage";
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

// Simple validation schema
const schema = z.object({
    name: z.string().min(1, "Name is required"),
    age: z.number().min(0).optional(),
    phone1: z.string().min(1, "Primary phone required"),
    phone2: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    addressLine1: z.string().min(1, "Address required"),
    image: z.instanceof(File).nullable().optional(),
});

export default function EditTourGuide() {
    const { id } = useParams();
    const goTo = useNavigator();

    const [loading, setLoading] = useState(true);
    const [existingGuide, setExistingGuide] = useState(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            age: undefined,
            phone1: "",
            phone2: "",
            email: "",
            addressLine1: "",
            image: null,
        },
    });

    // sample data matches TourGuideManagement's sample
    useEffect(() => {
        async function loadGuide() {
            try {
                const sample = [
                    {
                        guideId: 1,
                        guideImage:
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
                        firstName: "Akila",
                        lastName: "Niluksha",
                        dateOfBirth: "2001-06-06",
                        phone1: "071-1234567",
                        phone2: "077-7654321",
                        email: "akila@gmail.com",
                        addressLine1: "Kegalle",
                        addressLine2: "",
                        city: "Nuwara",
                        status: "Active",
                        isApproved: true,
                    },
                    {
                        guideId: 2,
                        guideImage:
                            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
                        firstName: "Lihini",
                        lastName: "Thennakoon",
                        dateOfBirth: "2000-09-02",
                        phone1: "071-9876543",
                        phone2: "",
                        email: "lihini@gmail.com",
                        addressLine1: "Matara",
                        addressLine2: "Galle",
                        city: "Hambanthota",
                        status: "Inactive",
                        isApproved: false,
                    },
                    {
                        guideId: 3,
                        guideImage:
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
                        firstName: "Milindu",
                        lastName: "Gomes",
                        dateOfBirth: "2001-10-08",
                        phone1: "071-9876543",
                        phone2: "116",
                        email: "gomes@gmail.com",
                        addressLine1: "No 254",
                        addressLine2: "Moratuwa",
                        city: "Colombo",
                        status: "active",
                        isApproved: false,
                    },
                ];

                const found = sample.find((s) => String(s.guideId) === String(id));

                if (found) {
                    setExistingGuide(found);

                    form.reset({
                        name: `${found.firstName || ""} ${found.lastName || ""}`.trim(),
                        age: undefined,
                        phone1: found.phone1 || "",
                        phone2: found.phone2 || "",
                        email: found.email || "",
                        addressLine1: found.addressLine1 || "",
                        image: null,
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load guide.");
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
                        ? await uploadToSupabase(values.image, `guide-images/${values.name}`)
                        : existingGuide?.guideImage;

                    const payload = {
                        ...values,
                        image: imageUrl,
                        id,
                    };

                    // simulate save delay / API
                    await new Promise((res) => setTimeout(res, 700));

                    return payload;
                })(),
                {
                    loading: "Updating guide...",
                    success: () => {
                        goTo("/tour-guide-management");
                        return "Guide updated";
                    },
                    error: (err) => err?.message || "Update failed",
                }
            );
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <div className="p-6">Loading…</div>;

    return (
        <div className="p-6">
            <PageBreadcrumb title="Edit Tour Guide" paths={["Tour Guide Management"]} />

            <div className="bg-white border rounded-md shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Guide Details</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone 1</FormLabel>
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
                                        <FormLabel>Phone 2</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name="addressLine1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                                            />
                                        </FormControl>

                                        {existingGuide?.guideImage && (
                                            <img
                                                src={existingGuide.guideImage}
                                                alt="Guide"
                                                className="w-24 h-24 rounded-full object-cover border mt-3"
                                            />
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

                            <Button className="bg-blue-700 text-white" type="submit">
                                Update Guide
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}