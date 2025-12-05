import Layout from "@/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import VehicleManagement from "@/pages/vehicleManagement";
import Trip from "@/pages/trips";
import AddVehicle from "@/pages/AddVehicle";

function App() {
  return (
    <BrowserRouter>
      <Layout> 
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Vehicle" element={<VehicleManagement />} />
          <Route path="/trips" element={<Trip />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
