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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "@/utils/spacing";
import { Ionicons } from "@expo/vector-icons";
import OtpInputField from "@/components/OtpField";
import { router } from "expo-router";
import { forgotPassword, resetPassword } from "@/api/auth";
import Toast from "react-native-toast-message";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [code, setCode] = useState("");
  const [pinReady, setPinReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigation = useNavigation();
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [changingPassLoading, setChangingPassLoading] = useState(false);

  const handleSendOTP = () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email address",
      });
      return;
    }
    setSendOtpLoading(true);
    forgotPassword(email)
      .then((res) => {
        console.log(res);
        setShowOtp(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSendOtpLoading(false);
      });
  };

  const handleChange = (_field: string, value: string) => {
    setCode(value);
  };

  const handleVerifyCode = () => {
    console.log(email, code, newPassword);
    if (!code) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter the OTP code",
      });
      return;
    }
    setShowPasswordReset(true);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);
    setChangingPassLoading(true);
    console.log(email, code, newPassword);
    resetPassword(email, code, newPassword)
      .then((res) => {
        console.log(res);
        router.push("/(auth)");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        Toast.show({
          type: "error",
          text1: "Sign-in Failed",
          text2: err.response.data.message,
        });
      })
      .finally(() => {
        setChangingPassLoading(false);
      });
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordsMatch(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordsMatch(text === newPassword);
  };

  const renderContent = () => {
    if (showPasswordReset) {
      return (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                placeholder="xxxxxxxx"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                placeholder="xxxxxxxx"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {!passwordsMatch && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!passwordsMatch || !newPassword || !confirmPassword) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={!passwordsMatch || !newPassword || !confirmPassword}
          >
            {changingPassLoading ? (
              <View
                style={{
                  height: moderateScale(16),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </>
      );
    }

    if (showOtp) {
      return (
        <>
          <Text style={styles.label}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            <OtpInputField
              setPinReady={setPinReady}
              code={code}
              setCode={setCode}
              maxLength={6}
              handleChange={handleChange}
              handleSend={handleVerifyCode}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !pinReady && styles.submitButtonDisabled,
            ]}
            onPress={handleVerifyCode}
            disabled={!pinReady}
          >
            <Text style={styles.submitButtonText}>Submit Otp</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSendOTP}>
          {sendOtpLoading ? (
            <View
              style={{
                height: moderateScale(16),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Send Otp</Text>
          )}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {showPasswordReset ? "Reset Password" : "Forget Password"}
          </Text>
        </View>

        <View style={styles.content}>
          {/* Lock Icon */}
          <Image
            source={require("../../assets/images/assets/lock.png")}
            style={styles.lockIcon}
            resizeMode="contain"
          />

          {/* Form */}
          <View style={styles.formContainer}>{renderContent()}</View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
  },
  backButton: {
    padding: moderateScale(5),
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
    color: "#000000",
    marginLeft: moderateScale(8),
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  lockIcon: {
    width: moderateScale(120),
    height: moderateScale(120),
    marginVertical: moderateScale(40),
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: moderateScale(24),
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsRegular",
    color: "#666666",
    marginBottom: moderateScale(8),
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: moderateScale(8),
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: moderateScale(8),
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
  },
  otpContainer: {
    marginVertical: moderateScale(20),
  },
  submitButton: {
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(4), // Updated to use moderateScale
    paddingVertical: moderateScale(14),
    alignItems: "center",
    marginTop: moderateScale(20),
  },
  submitButtonDisabled: {
    opacity: 0.7,
    borderRadius: moderateScale(4), // Updated to use moderateScale
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
  },
  errorText: {
    color: "red",
    fontSize: moderateScale(12),
    fontFamily: "PoppinsRegular",
    marginBottom: moderateScale(8),
  },
});

export default ForgotPasswordScreen;
