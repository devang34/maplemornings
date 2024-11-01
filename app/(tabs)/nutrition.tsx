import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "@/hooks/useStore";

const nutrition = () => {
  const removeToken = useStore((state) => state.removeToken);
  const handleLogout = () => {
    removeToken();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleLogout}>
        <Text>nutrition</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default nutrition;
