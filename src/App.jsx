import Layout from "@/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import VehicleManagement from "@/pages/vehicleManagement/vehicleManagement";
import Trip from "@/pages/trips";
import AddVehicle from "@/pages/vehicleManagement/AddVehicle";
import { Toaster } from "sonner";
import EditVehicle from "@/pages/vehicleManagement/EditVehicle";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trip />} />

          {/* Vehicle parent */}
          <Route path="/vehicle">
            <Route index element={<VehicleManagement />} /> {/* /vehicle */}
            <Route path="add" element={<AddVehicle />} /> {/* /vehicle/add */}
            <Route path="edit/:id" element={<EditVehicle />} />
          </Route>
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
