

import axios from "axios";

const BASE_URL = "http://localhost:8089/api/v1";

const tourGuideApi = {
  createGuide: (data) =>
    axios.post(`${BASE_URL}/create-tour-guide`, data),

  getAllGuides: () =>
    axios.get(`${BASE_URL}/getAll`),

  // SEARCH BY NAME (backend)
  searchGuideByName: (name) =>
    axios.get(`${BASE_URL}/search`, {
      params: { name },
    }),

  deleteGuide: (tourId) =>
    axios.delete(`${BASE_URL}/delete/${tourId}`),
};

export default tourGuideApi;
