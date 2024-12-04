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
import { registerUser } from "@/api/auth";
import Toast from "react-native-toast-message";
import { Link, router } from "expo-router";
import useStore from "@/hooks/useStore";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setToken = useStore((state) => state.setToken);

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (!username || !email || !password || !confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: "Please fill all the fields.",
        });
        return;
      }
      if (password !== confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: "Passwords do not match.",
        });
        return;
      }
      registerUser(email, username, password)
        .then((response) => {
          console.log(response, "re");
          setToken(response.token);
          setUsername(username);
          Toast.show({
            type: "success",
            text1: "Registration Successful",
          });
          router.push("/(onboarding)/diet");
        })
        .catch((error) => {
          console.log(error, "err");
          Toast.show({
            type: "error",
            text1: "Registration Failed",
            text2: error,
          });
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.illustrationContainer}>
            <Image
              source={require("../../assets/images/assets/Login.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.title}>ALMOST AT YOUR PLATE</Text>
            <Text style={styles.subtitle}>
              Login or Signup to fill your cravings!!!
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Signup</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#999"
              style={styles.input}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#999"
              textContentType="none" // Disables the strong password suggestion
              autoComplete="off"
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm "
              placeholderTextColor="#999"
              textContentType="none" // Disables the strong password suggestion
              autoComplete="off"
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.signupButtonText}>
                {loading ? "Signing up..." : "Signup"}
              </Text>
            </TouchableOpacity>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already an account? </Text>
              <Link href="/(auth)" style={styles.loginLink}>
                Login here
              </Link>
            </View>
          </View>
          <View style={styles.yellowAccent} />
        </ScrollView>
    </SafeAreaView>
  );
}

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
    alignItems: "flex-start",
    paddingHorizontal: moderateScale(32),
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
    marginTop: moderateScale(10),
  },
  subtitle: {
    fontSize: moderateScale(12),
    fontFamily: "PoppinsLight",
    color: "#FFFFFF",
    textAlign: "left",
    fontStyle: "italic",
    marginBottom: moderateScale(30),
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: moderateScale(60),
    padding: moderateScale(20),
    paddingHorizontal: moderateScale(30),
    paddingTop: moderateScale(30),
    paddingBottom: moderateScale(50),
    zIndex: 10,
  },
  formTitle: {
    fontFamily: "PoppinsBold",
    fontSize: moderateScale(24),
    color: "#333333",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: moderateScale(8),
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
    marginBottom: moderateScale(20),
  },
  signupButton: {
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(14),
    alignItems: "center",
    marginBottom: moderateScale(24),
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontFamily: "PoppinsMedium",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
    color: "#666666",
  },
  loginLink: {
    fontFamily: "PoppinsSemiBold",
    fontSize: moderateScale(14),
    color: "#0F6D41",
  },
  yellowAccent: {
    height: "80%",
    position: "absolute",
    right: 0,
    bottom: 0,
    width: moderateScale(30), // Updated to use moderateScale
    backgroundColor: "#FFC72C",
    borderTopLeftRadius: moderateScale(38),
    borderTopRightRadius: moderateScale(38),
    zIndex: 1,
  },
});
