import { BASE_URL } from "../api.config";
import { createAxiosInstance } from "../axiosInstance";

const axsinstance = createAxiosInstance();

export const validateCoupon = async (couponCode: string, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`, // Ensure the user is authenticated
    };

    const response = await axsinstance.get(
      `${BASE_URL}/coupon/validate/${couponCode}`,
      { headers }
    );

    return response.data; // Backend response should include `discountPercentage` and `maxDiscountAmount`
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to validate coupon");
  }
};

export const getAllCoupons = async (token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.get(`${BASE_URL}/coupon`, { headers });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to validate coupon");
  }
};
