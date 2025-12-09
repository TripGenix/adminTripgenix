import Layout from "@/Layout/Layout";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VehicleManagement from "@/pages/vehicleManagement/vehicleManagement";
import Trip from "@/pages/trips";
import AccountSettings from "@/pages/AccountSettings";
import EditVehicle from "@/pages/vehicleManagement/EditVehicle";
import AddVehicle from "@/pages/vehicleManagement/AddVehicle";
import EditVehicle from "@/pages/vehicleManagement/EditVehicle";
import { Toaster } from "sonner";

function App() {

 const isAuthenticated = !!localStorage.getItem('token');

    const ProtectedRoute = ({ children }) => {
        if (!localStorage.getItem('token')) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };


  return (
    <BrowserRouter>
    <Routes>
       <Toaster position="top-right" richColors closeButton />
       <Route path="/" element={<Dashboard />} />
        <Route path="/trips" element={<Trip />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-admin" element={<Register />} /> 
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
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
                
                <Route path="/trips" element={
                  <Layout>
                    <Trip/>
                  </Layout>
                } 
                />

                <Route path="/Vehicle" element={
                  <Layout>
                    <VehicleManagement/>
                  </Layout>
                  }
                />

                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
                <Route path="/settings" element={<AccountSettings />} />
           
          
           {/* Vehicle parent */}
          <Route path="/vehicle">
            <Route index element={<VehicleManagement />} /> {/* /vehicle */}
            <Route path="add" element={<AddVehicle />} /> {/* /vehicle/add */}
            <Route path="edit/:id" element={<EditVehicle />} />
          </Route>

        </Routes>
    </BrowserRouter>   
  );
}

export default App;
