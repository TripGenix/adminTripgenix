import axiosClient from "./axiosClient";

const vehicleApi = {
  getAllVehicles() {
    return axiosClient.get("/getallvehicles");
  },
}

export default vehicleApi;