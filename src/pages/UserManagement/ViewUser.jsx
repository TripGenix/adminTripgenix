import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import userApi from "@/api/UserApi";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import useNavigator from "@/hooks/use-navigator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export default function ViewUser() {
  const { id } = useParams();
  const goTo = useNavigator();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await userApi.getUserById(id);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!user) return <div className="p-6">No user found</div>;

  const dob = user.dob ? String(user.dob).slice(0, 10) : "";
 
  let status = "";
  if(user.status==1){
    status="Active"
  }else{
    status="Inactive"
  }

  return (
    <div className="p-6">
      <PageBreadcrumb  paths={["User Management", "View User"]} />

      <div className="bg-white border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-6">User Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="First Name">
            <Input value={user.firstName ?? ""} disabled />
          </Field>

          <Field label="Last Name">
            <Input value={user.lastName ?? ""} disabled />
          </Field>

          <Field label="NIC Number">
            <Input value={user.nic ?? ""} disabled />
          </Field>

          <Field label="Date of Birth">
            <Input type="date" value={dob} disabled />
          </Field>

          <Field label="Email">
            <Input value={user.email ?? ""} disabled />
          </Field>

          <Field label="Primary Phone">
            <Input value={user.phone ?? ""} disabled />
          </Field>

          <Field label="Address Line 1">
            <Input value={user.addressLine1 ?? ""} disabled />
          </Field>

          <Field label="Address Line 2">
            <Input value={user.addressLine2 ?? ""} disabled />
          </Field>

          <Field label="City">
            <Input value={user.city ?? ""} disabled />
          </Field>

          <Field label="State / Province">
            <Input value={user.state?? ""} disabled />
          </Field>

          <Field label="Postal Code">
            <Input value={user.postalCode ?? ""} disabled />
          </Field>

          <Field label="Status">

            <Input value={status ?? ""} disabled />
          </Field>
        </div>

        <div className="flex justify-end mt-8">
          <Button variant="outline" onClick={() => goTo("/user-management")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
