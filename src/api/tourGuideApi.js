import axios from "axios";

const BASE_URL = "http://localhost:8089/api/v1";

const tourGuideApi = {
  // CREATE
  createGuide: (data) =>
    axios.post(`${BASE_URL}/create-tour-guide`, data),

  // GET ALL
  getAllGuides: () =>
    axios.get(`${BASE_URL}/getAll`),

  // SEARCH BY ID
  searchGuide: (tourId) =>
    axios.get(`${BASE_URL}/search`, {
      params: { tourId },
    }),

  // DELETE
  deleteGuide: (tourId) =>
    // axios.delete(`${BASE_URL}/delete`, {
    //   params: { tourId },
    // }),

    axios.delete(`${BASE_URL}/delete/${tourId}`),
};

export default tourGuideApi;
