import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "@/utils/spacing";
import { CouponIcon, DietIcon, HomeIcon, OrderIcon, ProfileIcon } from "@/components/navigation/Icons";

export default function TabLayout() {
  const activeColor = "#0F6D41";
  const inactiveColor = "#878787";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon
              color={focused ? activeColor : inactiveColor}
              size={moderateScale(28)}
              style={focused ? styles.activeIcon : styles.inactiveIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Order",
          tabBarIcon: ({ color, focused }) => (
            <OrderIcon
              color={focused ? activeColor : inactiveColor}
              size={moderateScale(28)}
              style={focused ? styles.activeIcon : styles.inactiveIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dietary"
        options={{
          title: "Diet",
          tabBarIcon: ({ color, focused }) => (
            <DietIcon
              color={focused ? activeColor : inactiveColor}
              size={moderateScale(28)}
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
            <CouponIcon
              color={focused ? activeColor : inactiveColor}
              size={moderateScale(28)}
              style={focused ? styles.activeIcon : styles.inactiveIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon
              color={focused ? activeColor : inactiveColor}
              size={moderateScale(28)}
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
    height: moderateScale(70),
    alignItems: "center",
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#878787",
    shadowColor: "transparent",
  },
  tabBarItem: {
    paddingHorizontal: moderateScale(10),
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