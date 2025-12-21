import axios from "axios";

const axiosClientPackages = axios.create({
  baseURL: "http://localhost:8082/api/packages",
  headers: {
    "Content-Type": "application/json",
  },
  
});

export default axiosClientPackages;
