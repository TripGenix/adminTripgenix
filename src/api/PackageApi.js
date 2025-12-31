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
  async createPackage(payload) {
    const res = await axiosClientPackages.post("", payload);
    if (typeof res.data === "string" && res.data.toLowerCase().includes("exist")) {
      throw new Error(res.data);
    }
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Package save failed");
    }
    return res;
  },

  async updatePackage(id, payload) {
    const res = await axiosClientPackages.put(`/${id}`, payload);
    if (typeof res.data === "string" && res.data.toLowerCase().includes("error")) {
      throw new Error(res.data);
    }
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Package update failed");
    }
    return res;
  },
};

export default packageApi;
