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

// ------------- VALIDATION -------------
const schema = z.object({
	name: z.string().min(1, "Name is required"),
	nic: z.string().optional(),
	language: z.string().optional(),
	reviewId: z.string().optional(),
	image: z
		.instanceof(File, { message: "Image is required" })
		.refine((f) => f.type.startsWith("image/"), { message: "Only images allowed" }),
	status: z.string().min(1, "Status required"),
	driverId: z.any().optional(),
});

export default function AddTourGuide() {
	const goTo = useNavigator();

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			nic: "",
			language: "",
			reviewId: "",
			image: null,
			status: "Active",
			driverId: null,
		},
	});

	const [driverOptions, setDriverOptions] = React.useState([]);

	useEffect(() => {
		async function loadDrivers() {
			try {
				const res = await driverApi.getAllDrivers();
				// handle if API returns array under data or directly
				const items = res?.data || [];
				setDriverOptions(
					items.map((d) => ({ value: d.driverId ?? d.id ?? d.driver_id, label: `${d.firstName || ""} ${d.lastName || ""}`.trim() }))
				);
			} catch (e) {
				console.error("Failed to load drivers", e);
			}
		}

		loadDrivers();
	}, []);

	async function onSubmit(values) {
		try {
			await toast.promise(
				(async () => {
					const imageUrl = await uploadToSupabase(values.image, `guide-images/${values.nic || values.name}`);

					const payload = {
						...values,
						image: imageUrl,
					};

					console.log("Submitting tour guide payload:", payload);

					// No real backend API yet - simulate a save delay
					await new Promise((res) => setTimeout(res, 700));

					return payload;
				})(),
				{
					loading: "Saving guide...",
					success: () => {
						goTo("/tour-guide-management");
						form.reset();
						return "Tour guide created";
					},
					error: (err) => err?.message || "Save failed",
				}
			);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className="p-6">
			<PageBreadcrumb title="Add Tour Guide" paths={["Tour Guide Management", []]} />

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
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="nic"
								render={({ field }) => (
									<FormItem>
										<FormLabel>NIC</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="language"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Language</FormLabel>
										<FormControl>
											<Input {...field} placeholder="e.g. English, Sinhala" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="reviewId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Review ID</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="driverId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Associate Driver</FormLabel>
										<FormControl>
											<Select
												options={driverOptions}
												onChange={(s) => field.onChange(s ? s.value : null)}
												value={driverOptions.find((o) => o.value === field.value) || null}
												isClearable
											/>
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
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end gap-4">
							<Button variant="outline" type="button" onClick={() => form.reset()}>
								Clear
							</Button>

							<Button className="bg-blue-700 text-white hover:bg-blue-900" type="submit">
								Save Guide
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
