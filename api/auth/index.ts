import Toast from "react-native-toast-message";
import { BASE_URL } from "../api.config";
import { createAxiosInstance } from "../axiosInstance";

export interface User {
  email: string;
  username: string;
}

const axsinstance = createAxiosInstance();

export interface RegisterResponse {
  message: string;
  user: User;
  token: string;
}

export const Register = async (
  email: string,
  username: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await axsinstance.post<RegisterResponse>(
      `http://localhost:3333/auth/signIn`,
      {
        email,
        username,
        password,
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.message ||
      "An unexpected error occurred during registration.";
    Toast.show({
      type: "error",
      text1: "Registration Failed",
      text2: errorMessage,
    });
    throw error;
  }
};
export interface AuthResponse {
  token: string;
  isAdmin: boolean;
  isRegistered: boolean;
}
export const Signin = async (
  identifier: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axsinstance.post<AuthResponse>(
      `${BASE_URL}/auth/signin`,
      {
        name: identifier,
        password,
      }
    );

    console.log("Response Data:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("Error object:", error);
    const errorMessage =
      error.response?.data?.error || // Server-provided error message
      error.message || // Fallback for network errors
      "An unexpected error occurred during sign-in."; // Default error
    Toast.show({
      type: "error",
      text1: "Sign-in Failed",
      text2: errorMessage,
    });
    throw error;
  }
};   