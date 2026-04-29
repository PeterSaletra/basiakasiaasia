import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const type = sessionStorage.getItem("access_token_type");
    const token = sessionStorage.getItem("token");

    if (type && token) {
      config.headers["Authorization"] = `${JSON.parse(type)} ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
