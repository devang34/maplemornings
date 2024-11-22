import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";

export default function TabLayout() {
  const activeColor = "#000";
  const inactiveColor = "#000";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"} // Change icon based on focus
              size={moderateScale(28)}
              color={color}
              style={focused ? styles.activeIcon : styles.inactiveIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Order",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Entypo
                name="shopping-bag"
                size={moderateScale(28)}
                color={color}
                style={focused ? styles.activeIcon : styles.inactiveIcon}
              />
            ) : (
              <Feather
                name="shopping-bag"
                size={moderateScale(28)}
                color={color}
                style={focused ? styles.activeIcon : styles.inactiveIcon}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="dietary"
        options={{
          title: "Dietary",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "nutrition" : "nutrition-outline"} // Change icon based on focus
              size={moderateScale(28)}
              color={color}
              style={focused ? styles.activeIcon : styles.inactiveIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: "Deals",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pricetag" : "pricetag-outline"} // Change icon based on focus
              size={moderateScale(28)}
              color={color}
              style={focused ? styles.activeIcon : styles.inactiveIcon}
            />
          ),
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
    height: moderateScale(65),
    paddingBottom: Platform.OS === "ios" ? moderateScale(10) : moderateScale(5),
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
  activeIcon: {
    borderRadius: moderateScale(12),
    padding: moderateScale(5),
  },
  inactiveIcon: {
    borderRadius: moderateScale(12),
    backgroundColor: "transparent",
    padding: moderateScale(5),
  },
});
