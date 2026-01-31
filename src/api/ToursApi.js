import axiosClientTours from "./axioClients/axioClientTours";
const bookingApi = {
  // Get all NEW tours
  getNewTours() {
    return axiosClientTours.get("/get_new_bookings");
  },

    getConfirmedTours() {
    return axiosClientTours.get("/get_confirmed_bookings");
  },

  getCancelledTours(){
    return axiosClientTours.get("/get_cancled_bookings");
  },

  // Get all  tours
  getAllTours() {
    return axiosClientTours.get("/get_all_bookings");
  },

  //Get booking by ID
  getBookingById(id) {
    return axiosClientTours.get(`/get_booking_by_id/${id}`);
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
  sendConfirmEmail(payload) {
    return axiosClientTours.post("/send_confirm_booking_email", payload);
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
