import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import Toast from "react-native-toast-message";
import useStore from "@/hooks/useStore";

const Index: React.FC = () => {
  const token = useStore((state) => state.token);
  const isVerified = useStore((state) => state.isVerified);

  useEffect(() => {
    if (token) {
      if (isVerified) {
        Toast.show({
          type: "success",
          text1: "Welcome Back!",
          text2: "Redirecting to your dashboard...",
        });
      } else {
        Toast.show({
          type: "info",
          text1: "Almost there!",
          text2: "Please complete onboarding...",
        });
      }
    }
  }, [token, isVerified]);

  if (!token) {
    return <Redirect href="/(auth)" />;
  }

  if (token && !isVerified) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
};

export default Index;
