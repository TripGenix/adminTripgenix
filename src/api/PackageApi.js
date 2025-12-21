import axiosClientPackages from "./axioClients/axiosClientPackages";


const packageApi = {

  getAllPackages() {
    return axiosClientPackages.get("");
  },

  getPackageById(id) {
    return axiosClientPackages.get(`/${id}`);
  },

  deletePackage(id) {
    return axiosClientPackages.delete(`/${id}`);
  },
  createPackage(payload) {
    return axiosClientPackages.post("", payload).then((res) => {
      if (typeof res.data === "string" && res.data.toLowerCase().includes("exist")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "Package save failed");
      }

      return res;
    });
  },

  updatePackage(id, payload) {
    return axiosClientPackages.put(`/${id}`, payload).then((res) => {
      if (typeof res.data === "string" && res.data.toLowerCase().includes("error")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "Package update failed");
      }

      return res;
    });
  },
};

export default packageApi;
