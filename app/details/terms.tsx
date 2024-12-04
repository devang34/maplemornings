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

const TermsAndConditions = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={moderateScale(20)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Terms and Conditions</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.text}>Last Updated: 3rd December</Text>

        <Text style={styles.subHeading}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing or using the Maple Mornings operated by us, you agree to
          comply with these Terms and Conditions.
        </Text>

        <Text style={styles.subHeading}>2. Changes to Terms</Text>
        <Text style={styles.text}>
          We reserve the right to modify, update, or revise these Terms at any
          time. Any changes to the Terms will be posted on this page with the
          updated date.
        </Text>

        <Text style={styles.subHeading}>3. User Registration</Text>
        <Text style={styles.text}>
          To use the App, you must create an account by providing accurate and
          complete information.
        </Text>

        <Text style={styles.subHeading}>4. Use of the App</Text>
        <Text style={styles.text}>
          You agree to use the App only for lawful purposes and in accordance
          with these Terms. You agree not to engage in unlawful conduct.
        </Text>

        <Text style={styles.subHeading}>5. Privacy Policy</Text>
        <Text style={styles.text}>
          Your use of the App is also governed by our Privacy Policy, which
          explains how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.subHeading}>6. Intellectual Property</Text>
        <Text style={styles.text}>
          All content available on the App, including but not limited to text,
          images, logos, and software, is the property of Maple Mornings or its
          licensors and is protected by copyright, trademark, and other
          intellectual property laws.
        </Text>

        {/* Add more terms here */}
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
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(8),
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

export default TermsAndConditions;
