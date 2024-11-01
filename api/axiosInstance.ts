import { router } from "expo-router";
import axios, { AxiosInstance, AxiosError } from "axios";
import useStore from "@/hooks/useStore";
import { BASE_URL } from "./api.config";

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const removeToken = useStore.getState().removeToken;
      console.log("Axios Error:", error.message);

      if (error.message === "Network Error" || error.code === "ECONNABORTED") {
        console.warn("Network error or timeout. Redirecting to auth page.");
        removeToken();
        router.push("/(auth)");
      } else if (error.response?.status === 401) {
        console.warn("Unauthorized access - clearing token.");
        removeToken();
      } else {
        console.warn("An unknown error occurred:", error);
      }

      return Promise.reject(error);
    }
  );
  
  return instance;
};
