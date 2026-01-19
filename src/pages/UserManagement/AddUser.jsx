import React, { useEffect ,useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
import userApi from "@/api/UserApi";


// ---------------- ZOD VALIDATION ----------------
const schema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  nic: z.string().min(9, "NIC number required"),
  dob: z.string().min(1, "Date of birth required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password required"), 
  phone: z.string().min(1, "Phone number required"),
  addressLine1: z.string().min(1, "Address required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State / Province required"),
  postalCode: z.string().min(1, "Postal code required"),
});

// ---------------- MAIN COMPONENT ----------------
export default function AddUser() {
  const goTo = useNavigator();

  const [showPw, setShowPw] = useState(false);

  function generatePassword() {
  return Math.random().toString(36).slice(-8);
}


  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nic: "",
      dob: "",
      email: "",
      password:"",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

    useEffect(() => {
  form.setValue("password", generatePassword(), { shouldValidate: true });
}, [form]);

  //---------------- SUBMIT ----------------
  async function onSubmit(values) {
    console.log("👉 FORM SUBMITTED VALUES:", values);

    try {
      await toast.promise(
        (async () => {

          const payload = {
            ...values,
          };
          console.log("👉 FINAL PAYLOAD SENT TO BACKEND:", payload);

          return userApi.registerUser(payload);
        })(),
        {
          loading: "Saving user...",
          success: () => {
            goTo("/user-management");
            form.reset();
            return "User created successfully!";
          },
         error: (err) => {
          const status = err?.response?.status;
          const backendMsg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.response?.data; 

          if (
            status === 500 ||
            (typeof backendMsg === "string" &&
              backendMsg.toLowerCase().includes("email") &&
              backendMsg.toLowerCase().includes("exist"))
          ) {
            return "Email already exists";
          }
          return backendMsg || err.message || "Something went wrong";
        },
      }
    );
    } catch (error) {
      console.error(error);
    }
  }


  // ---------------- UI ----------------
  return (
    <div className="p-6">
      <PageBreadcrumb title="Add User" paths={["User Management", []]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
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

              {/* PASSWORD */}
              <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPw ? "text" : "password"}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPw((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                        >
                          {showPw ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />


              {/* PHONE 1 */}
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
                Save User
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
