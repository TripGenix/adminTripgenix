import Layout from "@/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import VehicleManagement from "@/pages/vehicleManagement";
import Trip from "@/pages/trips";
import AddVehicle from "@/pages/AddVehicle";
import { Toaster } from "sonner";
import EditVehicle from "@/pages/EditVehicle";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trip />} />
          <Route path="/Vehicle" element={<VehicleManagement />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/vehicle-edit/:id" element={<EditVehicle />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
