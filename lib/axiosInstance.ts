import axios from "axios";
import { toast } from "sonner";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3333"
    : "https://xscheduler-adonisjs.onrender.com";

// export const baseURL = "https://xscheduler-adonisjs.onrender.com";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically before every request
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401 && typeof window !== "undefined") {
      toast.error("Session expired", {
        description: "Please log in again to continue.",
      });
      window.location.href = "/login";
    } else {
      toast.error(response?.message || "An error occurred");
    }

    return Promise.reject(error);
  }
);
