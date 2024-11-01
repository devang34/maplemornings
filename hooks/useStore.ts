import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define Zustand store interface
interface StoreState {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

// Create Zustand store with persist middleware
const useStore = create<StoreState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set(() => ({ token })),
      removeToken: () => set(() => ({ token: null })),
    }),
    {
      name: "auth", // Unique name for the store
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
