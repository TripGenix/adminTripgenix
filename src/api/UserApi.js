import axiosClientUsers from "./axioClients/axiosClientUsers";

const UserApi = {
 
  getAllUsers() {
    return axiosClientUsers.get("");
  },

  getUserById(id) {
    return axiosClientUsers.get(`/${id}`);
  },


  deleteUserByEmail(email) {
    return axiosClientUsers.delete("", {  
      data: { email },
    });
  },

  registerUser(payload) {
    return axiosClientUsers.post("", payload).then((res) => {
      if (typeof res.data === "string" && res.data.toLowerCase().includes("exist")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "User save failed");
      }

      return res;
    });
  },

  updateUser(id, payload) {
    return axiosClientUsers.put(`/${id}`, payload).then((res) => {
      if (typeof res.data === "string" && res.data.toLowerCase().includes("error")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "User update failed");
      }
 
      return res;
    });
  },
  
  inviteUser(email) {
    return axiosClientUsers.post(`/invite`, { email }).then((res) => {
      if (typeof res.data === "string" && res.data.toLowerCase().includes("error")) {
        throw new Error(res.data);
      }
      if (res.data?.success === false) {
        throw new Error(res.data.message || "User invite failed");
      }
    });
  },

  toggleUserStatus(id) {
    return axiosClientUsers.patch(`/${id}/toggle-status`);
  },

};

export default UserApi;
