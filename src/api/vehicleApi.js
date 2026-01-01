import axiosClient from "./axioClients/axiosClientVehicle";
import axiosClientCategory from "./axioClients/axiosClientCategory";

const vehicleApi = {
  getAllVehicles() {
    return axiosClient.get("/getallvehicles");
  },

  getAllVehicleDetailsByNumber(id) {
    return axiosClient.get(`/detailsOfVehicle/${id}`);
  },
  deleteVehicle(id) {
    return axiosClient.delete(`/delete/${id}`);
  },

  createVehicle(payload) {
    return axiosClient.post("/save", payload).then((res) => {
      if (typeof res.data === "string" && res.data.includes("exists")) {
        throw new Error(res.data); // throw the message
      }
      if (res.data?.success === false) {
        throw new Error(res.data.message || "Save failed");
      }

      return res;
    });
  },

  updateVehicle(id, payload) {
    return axiosClient.put(`/update/${id}`, payload).then((res) => {
      if (typeof res.data === "string" && res.data.includes("error")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "Update failed");
      }

      return res;
    });
  },

  getVehicleNumbers(){
    return axiosClient.get("/getallvehicles");
  },

  getVehicleCategories(){
    return axiosClientCategory.get("");
  }
};

export default vehicleApi;
