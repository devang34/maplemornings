import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "@/utils/spacing";
import { Signin } from "@/api/auth"; // Make sure this is the correct import for your API
import Toast from "react-native-toast-message"; // To show success/error messages
import { router } from "expo-router";
import useStore from "@/hooks/useStore"; // Assuming useStore is used for global state management

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for login process

  const setToken = useStore((state) => state.setToken);
  const setIsVerified = useStore((state) => state.setIsVerified);
  const setDisease = useStore((state) => state.setDisease);
  const setUsername = useStore((state) => state.setUsername);

  const handleLogin = async () => {
    setLoading(true); // Set loading to true while API request is in progress

    try {
      // Call the Signin API with email and password
      const response = await Signin(email, password);
      console.log("Login response:", response);

      // Handle successful login
      setToken(response.token);
      setIsVerified(response.isRegistered);
      setDisease(response.diseaseId);
      setUsername(response.username);

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${response.username || email}!`,
      });

      if (response.isRegistered) {
        router.replace("/(tabs)"); // Redirect to the main app (tabs screen)
      } else {
        router.replace("/(onboarding)/diet"); // Redirect to onboarding if not registered
      }
    } catch (error: any) {
      // Handle error during login
      console.log("Login failed:", error);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.response.data.error,
      });
      console.log(error.response.data);
    } finally {
      setLoading(false); // Stop loading after API call is finished
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Illustration Section */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../assets/images/assets/Login.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.title}>ALMOST AT YOUR PLATE</Text>
            <Text style={styles.subtitle}>
              Login or signup to fill your cravings!!!
            </Text>
          </View>

          {/* Login Form Section */}
          <View style={styles.formContainer}>
            <Text
              style={{
                fontFamily: "PoppinsBold",
                fontSize: moderateScale(24),
                color: "#333333",
                marginBottom: moderateScale(20),
              }}
            >
              Login
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address or Username</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity onPress={() => router.push("/(auth)/forgot")}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading} // Disable button while loading
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              height: "80%",
              position: "absolute",
              right: 0,
              bottom: 0,
              width: moderateScale(20), // Updated to use moderateScale
              zIndex: 1,
              backgroundColor: "#FFC72C",
              borderTopLeftRadius: moderateScale(38),
              borderTopRightRadius: moderateScale(38),
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F6D41",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: moderateScale(40),
    paddingHorizontal: moderateScale(20),
  },
  illustration: {
    width: moderateScale(300),
    height: moderateScale(200),
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: "PoppinsBold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsRegular",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: moderateScale(8),
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: moderateScale(60),
    padding: moderateScale(20),
    paddingHorizontal: moderateScale(30),
    paddingTop: moderateScale(30),
    zIndex: 10,
  },
  inputContainer: {
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsRegular",
    color: "#333333",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: moderateScale(8),
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
  },
  forgotPassword: {
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
    color: "#0F6D41",
    textAlign: "left",
    marginBottom: moderateScale(10),
  },
  loginButton: {
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(4),
    paddingVertical: moderateScale(14),
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontFamily: "PoppinsMedium",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  signupText: {
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
    color: "#666666",
  },
  signupLink: {
    fontFamily: "PoppinsSemiBold",
    fontSize: moderateScale(14),
    color: "#0F6D41",
  },
});

export default LoginScreen;
