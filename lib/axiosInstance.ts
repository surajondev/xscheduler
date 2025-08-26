import axios from "axios";
import { toast } from "sonner";

export const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3333"
    : "https://surajondev-adonis.onrender.com";

const token = localStorage?.getItem("token");

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const { response } = error;

    // A 401 error now means the session is invalid or expired
    if (response?.status === 401 && typeof window !== "undefined") {
      toast.error("Session expired", {
        description: "Please log in again to continue.",
      });
    } else {
      toast.error(response?.message || "An error occurred");
    }
    return Promise.reject(error);
  }
);
