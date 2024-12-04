import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={moderateScale(20)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
      </View>

      <ScrollView
        style={{ ...styles.content, paddingBottom: moderateScale(32) }}
      >
        <Text style={styles.text}>Last Updated: [Date]</Text>

        <Text style={styles.subHeading}>1. Introduction</Text>
        <Text style={styles.text}>
          This Privacy Policy describes how we collects, uses, and protects your
          personal information when you use our mobile application Maple
          Mornings.
        </Text>

        <Text style={styles.subHeading}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We may collect the following types of personal information:
          {"\n"}- Personal identification information (name, email address,
          etc.)
          {"\n"}- Device information (IP address, browser type, etc.)
          {"\n"}- Usage data (activities within the app, preferences)
        </Text>

        <Text style={styles.subHeading}>3. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the collected information for the following purposes:
          {"\n"}- To provide, personalize, and improve the App's functionality
          {"\n"}- To communicate with you regarding your account or updates
          {"\n"}- To analyze usage trends and improve our services
          {"\n"}- To send promotional offers, if you’ve opted in to receive them
        </Text>

        <Text style={styles.subHeading}>4. How We Share Your Information</Text>
        <Text style={styles.text}>
          We do not sell, trade, or rent your personal information to third
          parties. However, we may share your data in the following cases:
          {"\n"}- With trusted third-party service providers that help us
          operate the App
          {"\n"}- When required by law or in response to a legal request
        </Text>

        <Text style={styles.subHeading}>5. Data Security</Text>
        <Text style={styles.text}>
          We implement appropriate security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the internet is
          100% secure.
        </Text>

        <Text style={styles.subHeading}>6. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {"\n"}- Access, update, or delete your personal data
          {"\n"}- Opt-out of marketing communications
          {"\n"}- Request data portability or object to data processing
        </Text>

        <Text style={styles.subHeading}>7. Changes to This Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted in this document with an updated date.
        </Text>

        <Text style={styles.subHeading}>8. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us
          at:
          {"\n"}
          Email: maplemornings@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
    backgroundColor: "#0F6D41",
  },
  backButton: {
    padding: moderateScale(5),
    borderRadius: moderateScale(4),
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
    color: "#fff",
    marginLeft: moderateScale(10),
  },
  content: {
    padding: moderateScale(16),
  },
  text: {
    fontSize: moderateScale(14),
    color: "#333",
    marginBottom: moderateScale(10),
    lineHeight: moderateScale(20),
  },
  subHeading: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
    color: "#000",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(8),
  },
});

export default PrivacyPolicy;
