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
import DriverManagement from "@/pages/DriverManagement/driverManagement";
import EditDriver from "@/pages/DriverManagement/EditDriver";
import AdminPackagesPage from "@/pages/DefaultPackages/AdminPackagesPage";
import PackageForm from "./pages/DefaultPackages/PackageForm";

import { Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";

//  Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />

      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/add-admin" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ========== PROTECTED ROUTES ========== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <AccountSettings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Vehicle */}
        <Route
          path="/vehicle"
          element={
            <ProtectedRoute>
              <Layout>
                <VehicleManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicle/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddVehicle />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicle/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditVehicle />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Driver */}
        <Route
          path="/driver-management"
          element={
            <ProtectedRoute>
              <Layout>
                <DriverManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver-management/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddDriver />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver-management/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditDriver />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Trips */}
        <Route
          path="/trips/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Trip />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ------FALLBACK --------*/}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />

        <Route 
          path="/packages" 
          element={ 
            <ProtectedRoute>
              <Layout>
                <AdminPackagesPage />
              </Layout>
            </ProtectedRoute>
          }
           />
           
          <Route 
          path="/packages/add"           
          element={ 
            <ProtectedRoute>
              <Layout>
                <PackageForm />
              </Layout>
            </ProtectedRoute>
          }
           />

        <Route 
          path="/packages/edit/:id"
          element={ 
            <ProtectedRoute>
              <Layout>
                <PackageForm />
              </Layout>
            </ProtectedRoute>
          }
           />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
