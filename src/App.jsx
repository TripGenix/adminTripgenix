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
import ViewPackages from "@/pages/DefaultPackages/ViewPackages";

import { useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner";
import TourGuideManagement from "./pages/TourGuideManagement/TourGuideManagement";
import ViewDriver from "./pages/DriverManagement/ViewDriver";
import ViewVehicle from "./pages/vehicleManagement/ViewVehicle";
import ViewTourGuide from "./pages/TourGuideManagement/ViewTourGuide";
import AddTourGuide from "./pages/TourGuideManagement/AddTourGuide";
import EditTourGuide from "./pages/TourGuideManagement/EditTourGuide";
import AddNewTour from "./pages/tour-tabs/AddNewTour";
import EmailSendView from "./pages/tour-tabs/emailsendView";
import ViewTour from "./pages/tour-tabs/viewNewTours";

import UserManagement from "./pages/UserManagement/UserManagement";
import AddUser from "./pages/UserManagement/AddUser";
import EditUser from "./pages/UserManagement/EditUser";
import ViewUser from "./pages/UserManagement/ViewUser";
import EditTour from "./pages/tour-tabs/EditTour";

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
                    <Route path="view/:id" element={<ViewTourGuide />} />
                  </Route>

                  {/* Package Routes */}
                  <Route path="packages">
                    <Route index element={<AdminPackagesPage />} />
                    <Route path="add" element={<PackageForm />} />
                    <Route path="edit/:id" element={<PackageForm />} />
                    <Route path="view/:id" element={<ViewPackages />} />
                  </Route>

                  {/* Trips */}
                  {/* <Route path="trips/*" element={<Trip />} />
                  <Route path="trips/add-new" element={<AddNewTour />} /> */}

                  <Route path="trips">
                    <Route index element={<Trip />} />
                    <Route path="add-new" element={<AddNewTour />} />
                    <Route
                      path="send-email-view/:id"
                      element={<EmailSendView />}
                    />
                    <Route path="view/:id" element={<ViewTour />} />
                    <Route path="edit/:id" element={<EditTour />} />
                  </Route>

                  {/* Default Redirect */}
                  <Route path="/" element={<Navigate to="/trips/new" />} />

                  {/* User Routes */}
                  <Route path="user-management">
                    <Route index element={<UserManagement />} />
                    <Route path="user-management/add" element={<AddUser />} />
                    <Route
                      path="user-management/edit/:id"
                      element={<EditUser />}
                    />
                    <Route path="view/:id" element={<ViewUser />} />
                  </Route>

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
