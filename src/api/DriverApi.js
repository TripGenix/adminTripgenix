import axiosClientDrivers from "./axioClients/axioClientDrivers";

const driverApi = {
  // GET ALL DRIVERS
  getAllDrivers() {
    return axiosClientDrivers.get("");
  },

  // GET DRIVER BY ID
  getDriverById(id) {
    return axiosClientDrivers.get(`/${id}`);
  },

  // DELETE DRIVER
  deleteDriver(id) {
    return axiosClientDrivers.delete(`/${id}`);
  },

  // CREATE DRIVER
  createDriver(payload) {
    return axiosClientDrivers.post("", payload).then((res) => {
      if (typeof res.data === "string" && res.data.toLowerCase().includes("exist")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "Driver save failed");
      }

      return res;
    });
  },

  // UPDATE DRIVER
  updateDriver(id, payload) {
    return axiosClientDrivers.put(`/${id}`, payload).then((res) => {
      if (typeof res.data === "string" && res.data.toLowerCase().includes("error")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "Driver update failed");
      }

      return res;
    });
  },
};

export default driverApi;
