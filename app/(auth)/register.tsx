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
import { Link, router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import Toast from "react-native-toast-message";
import { Register } from "@/api/auth";
import useStore from "@/hooks/useStore";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setToken = useStore((state) => state.setToken);

  const handleRegister = async () => {
            router.push("/(onboarding)");

    // setLoading(true);
    // try {
    //   if (
    //     username === "" ||
    //     email === "" ||
    //     password === "" ||
    //     confirmPassword === ""
    //   ) {
    //     Toast.show({
    //       type: "error",
    //       text1: "Registration Failed",
    //       text2: "Please fill all the fields.",
    //     });
    //     return;
    //   }
    //   if (password !== confirmPassword) {
    //     Toast.show({
    //       type: "error",
    //       text1: "Registration Failed",
    //       text2: "Passwords do not match.",
    //     });
    //     return;
    //   }
    //   const response = await Register(email, username, password);
    //   if (response.token) {
    //     setToken(response.token); 

    //     Toast.show({
    //       type: "success",
    //       text1: "Registration Successful",
    //     });
    //     router.push("/(onboarding)");
    //   } else {
    //     throw new Error("Token not provided in response");
    //   }
    // } catch (error) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Registration Failed",
    //     text2: (error as any).response?.data?.message || "An error occurred.",
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };


  return (
    <ImageBackground
      source={require("../../assets/images/assets/back2.png")}
      style={styles.background}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/assets/logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.heading}>Welcome...</Text>
          <Text style={styles.subheading}>signup to fill your cravings!!!</Text>

          <TextInput
            placeholder="name"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email address"
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="re-type password"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleRegister}
          >
            <Text style={styles.signupButtonText}>sign-up</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <View style={styles.socialLoginContainer}>
            <TouchableOpacity>
              <AntDesign
                name="google"
                size={30}
                color="#DB4437"
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome
                name="apple"
                size={30}
                color="#000"
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo
                name="facebook"
                size={30}
                color="#3b5998"
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Link href="/(auth)" style={styles.loginLink}>
              Login Here
            </Link>
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
    alignItems: "center",
    paddingVertical: moderateScale(50),
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  logo: {
    width: moderateScale(200),
    height: moderateScale(200),
    resizeMode: "contain",
  },
  signupContainer: {
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
  signupButton: {
    width: "100%",
    padding: moderateScale(12),
    backgroundColor: "#FFC107",
    borderRadius: moderateScale(5),
    alignItems: "center",
    marginVertical: moderateScale(10),
  },
  signupButtonText: {
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
  loginText: {
    fontSize: moderateScale(12),
    fontFamily: "PoppinsRegular",
    color: "#333",
    marginTop: moderateScale(10),
  },
  loginLink: {
    color: "#FF6347",
    fontFamily: "PoppinsBold",
  },
});
