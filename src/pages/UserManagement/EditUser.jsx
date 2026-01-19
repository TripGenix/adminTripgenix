import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import userApi from "@/api/UserApi";
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


const editSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  nic: z.string().min(9, "NIC number required"),
  dob: z.string().min(1, "Date of birth required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number required"),
  addressLine1: z.string().min(1, "Address required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State / Province required"),
  postalCode: z.string().min(1, "Postal code required"),

});

export default function EditUser() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [existingUser, setExistingUser] = useState(null);

  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nic: "",
      dob: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  // ------------------ LOAD USER ------------------
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await userApi.getUserById(id);
        const d = res.data;

        setExistingUser(d);

        form.reset({
          firstName: d.firstName,
          lastName: d.lastName,
          nic: d.nic,
          dob: d.dob ? d.dob.substring(0, 10) : "",
          email: d.email,
          phone: d.phone,
          addressLine1: d.addressLine1,
          addressLine2: d.addressLine2,
          city: d.city,
          state: d.state,
          postalCode: d.postalCode,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user.");
        setLoading(false);
      }
    }

    loadUser();
  }, [id, form]);

  // ------------------ SUBMIT UPDATE ------------------
  async function onSubmit(values) {
    if (!existingUser) return;

    try {
      await toast.promise(
        (async () => {

          const payload = {
            
            firstName: values.firstName,
            lastName: values.lastName,
            nic: values.nic,
            dob: values.dob,
            email: values.email,
            phone: values.phone,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,

          };

          return userApi.updateUser(id, payload);
        })(),
        {
          loading: "Updating user...",
          success: () => {
            goTo("/user-management");
            return "User updated successfully!";
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
      <PageBreadcrumb title="Edit User" paths={["User Management"]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>

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
                name="nic"
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
                name="dob"
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

              {/* PRIMARY PHONE */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
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
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => goTo("/user-management")}>
                Cancel
              </Button>

              <Button type="submit" className="bg-blue-700 text-white">
                Update User
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
