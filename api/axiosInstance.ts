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
    (response) => response, // If no error, just return the response as is
    (error: AxiosError) => {
      const removeToken = useStore.getState().removeToken;
      console.log("Axios Error:", error.message);

      // If there is a response error with a status code (any HTTP error status)
      if (error.response) {
        const statusCode = error.response.status;

        // Remove token and redirect to the auth page for any status code error (like 401, 498, etc.)
        if (statusCode === 498) {
          console.warn(
            `Error with status code ${statusCode}. Redirecting to auth page.`
          );
          removeToken();
          router.push("/(auth)");
        }
      } else if (
        error.message === "Network Error" ||
        error.code === "ECONNABORTED"
      ) {
        // Handle network error or timeout
        console.warn("Network error or timeout. Redirecting to auth page.");
        // removeToken();
        // router.push("/(auth)");
      } else {
        console.warn("An unknown error occurred:", error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
