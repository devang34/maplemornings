import { router, Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DealsIcon,
  DietIcon,
  HomeIcon,
  StatusIcon,
} from "@/components/navigation/Icons";
import { moderateScale } from "@/utils/spacing";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? "light"].tint;
  const inactiveColor = "#000"; // Set the inactive color as per your design

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: false, // Remove labels for a cleaner look
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => <StatusIcon color={color} />,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={{
                ...styles.iconWrapper,
              }}
              onPress={() => router.push("/(onboarding)")}
            >
              <StatusIcon />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: "Nutrition",
          tabBarIcon: ({ color, focused }) => <DietIcon />,
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: "Deals",
          tabBarIcon: ({ color, focused }) => <DealsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderWidth: moderateScale(1),
    borderColor: "#424242",
    height: moderateScale(65), // Increase height slightly for better alignment
    paddingBottom: Platform.OS === "ios" ? moderateScale(10) : moderateScale(5), // Adjust bottom padding for iOS
    paddingTop: Platform.OS === "ios" ? moderateScale(15) : moderateScale(5), // Adjust top padding for iOS
    alignItems: "center",
    position: "absolute",
    bottom: moderateScale(20),
    width: "90%",
    marginHorizontal: "5%",
    borderRadius: moderateScale(12),
    left: 0,
    right: 0,

    // Remove shadow
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0,
  },

  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(12),
    marginTop: moderateScale(2), // Adjust top margin to center icons better
  },
  activeIconWrapper: {
    borderColor: "#32CD32",
  },
});

