import axiosClientTours from "./axioClients/axioClientTours";
const bookingApi = {
  // Get all NEW tours
  getNewTours() {
    return axiosClientTours.get("/get_new_bookings");
  },

    // Get all  tours
  getAllTours() {
    return axiosClientTours.get("/get_all_bookings");
  },

  //Get booking by ID
  getBookingById(id) {
    return axiosClientTours.get(`/get_booking/${id}`);
  },

  // Create new booking
  createBooking(payload) {
    return axiosClientTours.post("/saveBooking", payload).then((res) => {
      if (typeof res.data === "string" && res.data.includes("error")) {
        throw new Error(res.data);
      }

      if (res.data?.success === false) {
        throw new Error(res.data.message || "Booking failed");
      }

      return res;
    });
  },

  // Tourist confirm
  touristConfirm(id) {
    return axiosClientTours.put(`/tourist/confirm/${id}`);
  },

  // Tourist cancel
  touristCancel(id) {
    return axiosClientTours.put(`/tourist/cancel/${id}`);
  },

  //Driver confirm
  driverConfirm(id) {
    return axiosClientTours.put(`/driver/confirm/${id}`);
  },

  //  Driver cancel
  driverCancel(id) {
    return axiosClientTours.put(`/driver/cancel/${id}`);
  },
};

export default bookingApi;