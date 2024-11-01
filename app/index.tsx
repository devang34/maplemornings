import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import Toast from "react-native-toast-message";
import useStore from "@/hooks/useStore";

const Index: React.FC = () => {
  const token = useStore((state) => state.token);

  useEffect(() => {
    if (token) {
      Toast.show({
        type: "success",
        text1: "Welcome Back!",
        text2: "Redirecting to your dashboard...",
      });
    }
  }, [token]);

  return <Redirect href={token ? "/(tabs)" : "/(auth)"} />;
};

export default Index;
