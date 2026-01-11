import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/Layout/Layout";

import Dashboard from "@/pages/dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import VehicleManagement from "@/pages/vehicleManagement/vehicleManagement";
import AddVehicle from "@/pages/vehicleManagement/AddVehicle";
import EditVehicle from "@/pages/vehicleManagement/EditVehicle";

import DriverManagement from "@/pages/DriverManagement/driverManagement";
import AddDriver from "@/pages/DriverManagement/AddDriver";
import EditDriver from "@/pages/DriverManagement/EditDriver";

import Trip from "@/pages/tour-tabs/Trip";
import AccountSettings from "@/pages/AccountSettings";

import AdminPackagesPage from "@/pages/DefaultPackages/AdminPackagesPage";
import PackageForm from "@/pages/DefaultPackages/PackageForm";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner";
import TourGuideManagement from "./pages/TourGuideManagement/TourGuideManagement";
import ViewDriver from "./pages/DriverManagement/ViewDriver";
import ViewVehicle from "./pages/vehicleManagement/ViewVehicle";
import AddTourGuide from "./pages/TourGuideManagement/AddTourGuide";
import EditTourGuide from "./pages/TourGuideManagement/EditTourGuide";

function App() {
  const { isAuthenticated } = useAuth();

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
        <Route path="/login" element={<Login />} />
        <Route path="/add-admin" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Settings */}
                  <Route path="settings" element={<AccountSettings />} />

                  {/* Vehicle Routes */}
                  <Route path="vehicle">
                    <Route index element={<VehicleManagement />} />
                    <Route path="add" element={<AddVehicle />} />
                    <Route path="edit/:id" element={<EditVehicle />} />
                    <Route path="view/:id" element={<ViewVehicle />} />
                  </Route>

                  {/* Driver Routes */}
                  <Route path="driver-management">
                    <Route index element={<DriverManagement />} />
                    <Route path="add" element={<AddDriver />} />
                    <Route path="edit/:id" element={<EditDriver />} />
                    <Route path="view/:id" element={<ViewDriver />} />
                  </Route>

                  {/* TourGuide Routes */}
                  <Route path="tour-guide">
                    <Route index element={<TourGuideManagement />} />
                    <Route path="add" element={<AddTourGuide />} />
                    <Route path="edit/:id" element={<EditTourGuide />} />
                  </Route>

                  {/* Package Routes */}
                  <Route path="packages">
                    <Route index element={<AdminPackagesPage />} />
                    <Route path="add" element={<PackageForm />} />
                    <Route path="edit/:id" element={<PackageForm />} />
                  </Route>

                  {/* Trips */}
                  <Route path="trips/*" element={<Trip />} />

                  {/* Default Redirect */}
                  <Route path="/" element={<Navigate to="/trips/new" />} />

                  {/* Catch-all inside layout */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
