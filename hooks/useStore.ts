import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define Zustand store interface
interface StoreState {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
  resetIsVerified: () => void;
  disease: string | null;
  setDisease: (disease: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
}

// Create Zustand store with persist middleware
const useStore = create<StoreState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set(() => ({ token })),
      removeToken: () => set(() => ({ token: null })),
      isVerified: false,
      setIsVerified: (isVerified) => set(() => ({ isVerified })),
      resetIsVerified: () => set(() => ({ isVerified: false })),
      disease: null,
      setDisease: (disease) => set(() => ({ disease })),
      username: null,
      setUsername: (username) => set(() => ({ username })),
    }),
    {
      name: "auth", // Unique name for the store
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
