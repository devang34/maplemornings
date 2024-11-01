import { useEffect } from "react";
import { useRouter } from "expo-router";
import { AxiosError } from "axios";
import useStore from "@/hooks/useStore"; // Import the Zustand store

const useHandleUnauthorized = (error: AxiosError | null) => {
  const router = useRouter();
  const removeToken = useStore((state) => state.removeToken); // Get removeToken action from Zustand

  useEffect(() => {
    if (error?.response?.status === 401) {
      removeToken(); // Use Zustand to remove the token
      router.push("/(auth)"); // Redirect to the auth page
    }
  }, [error, removeToken, router]);
};

export default useHandleUnauthorized;
