import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import Toast from "react-native-toast-message";
import { Signin } from "@/api/auth";
import useStore from "@/hooks/useStore";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setToken = useStore((state) => state.setToken);
  const setIsVerified = useStore((state) => state.setIsVerified);
  const setDisease = useStore((state) => state.setDisease);
  const setUsername = useStore((state) => state.setUsername);

  const handleLogin = async () => {
    setLoading(true);
    console.log("Logging in with:", identifier, password);
    try {
      console.log("Login response222:", identifier, password);
      const response = await Signin(identifier, password);
      console.log("Login response:", response);
      setToken(response.token);
      setIsVerified(response.isRegistered);
      setDisease(response.diseaseId);
      setUsername(response.username);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${identifier}!`,
      });
      if (response.isRegistered) {
        router.push("/(tabs)");
      } else {
        router.push("/(onboarding)");
      }
    } catch (error) {
      console.log("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/assets/back.png")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/assets/logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.heading}>ALMOST AT YOUR PLATE</Text>
          <Text style={styles.subheading}>
            login or signup to fill your cravings!!!
          </Text>

          <TextInput
            placeholder="username or e-mail"
            value={identifier}
            onChangeText={setIdentifier}
            style={styles.input}
          />
          <TextInput
            placeholder="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Logging in..." : "login"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text
              onPress={() => router.push("/(auth)/register")}
              style={styles.signupLink}
            >
              Signup Here
            </Text>
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: moderateScale(20),
    marginTop: moderateScale(50),
  },
  logo: {
    width: moderateScale(200),
    height: moderateScale(200),
    marginBottom: moderateScale(10),
  },
  loginContainer: {
    width: "90%",
    maxWidth: moderateScale(400),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
    marginBottom: moderateScale(50),
  },
  heading: {
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
    color: "#333",
    marginBottom: moderateScale(5),
  },
  subheading: {
    fontSize: moderateScale(12),
    fontFamily: "PoppinsLight",
    color: "#555",
    marginBottom: moderateScale(15),
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: moderateScale(10),
    marginVertical: moderateScale(2),
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
    fontFamily: "PoppinsRegular",
  },
  loginButton: {
    width: "100%",
    padding: moderateScale(12),
    backgroundColor: "#FFC107",
    borderRadius: moderateScale(5),
    alignItems: "center",
    marginVertical: moderateScale(10),
  },
  loginButtonText: {
    color: "#000",
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
  },
  orText: {
    fontSize: moderateScale(12),
    fontFamily: "PoppinsRegular",
    color: "#888",
    marginVertical: moderateScale(10),
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginVertical: moderateScale(10),
  },
  socialIcon: {
    marginHorizontal: moderateScale(10),
  },
  signupText: {
    fontSize: moderateScale(12),
    fontFamily: "PoppinsRegular",
    color: "#333",
    marginTop: moderateScale(10),
  },
  signupLink: {
    color: "#FF6347",
    fontFamily: "PoppinsBold",
  },
});
