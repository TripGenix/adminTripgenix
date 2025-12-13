import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/Layout/Layout";

import Dashboard from "@/pages/dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VehicleManagement from "@/pages/vehicleManagement/vehicleManagement";
import Trip from "@/pages/tour-tabs/trips";
import AccountSettings from "@/pages/AccountSettings";
import AddVehicle from "@/pages/vehicleManagement/AddVehicle";
import EditVehicle from "@/pages/vehicleManagement/EditVehicle";
import AddDriver from "@/pages/DriverManagement/AddDriver";
import DriverManagement from "./pages/DriverManagement/driverManagement";
import EditDriver from "@/pages/DriverManagement/EditDriver";

import { Toaster } from "sonner";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/add-admin" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  {/* <Route path="trips" element={<Trip />} /> */}
                  <Route path="settings" element={<AccountSettings />} />

                  {/* Vehicle Routes */}
                  <Route path="vehicle">
                    <Route index element={<VehicleManagement />} />
                    <Route path="add" element={<AddVehicle />} />
                    <Route path="edit/:id" element={<EditVehicle />} />
                  </Route>

                  <Route path="driver-management">
                    <Route index element={<DriverManagement />} />
                    <Route path="add" element={<AddDriver />} />
                    <Route path="edit/:id" element={<EditDriver />} />
                  </Route>
                  <Route path="/" element={<Navigate to="/trips/new" />} />

                  {/* Trips */}
                  <Route path="trips/*" element={<Trip />} />
                  
                  {/* Catch All Inside Layout */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Global catch-all */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
