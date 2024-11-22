import { OrderCreate } from "@/interfaces";
import { BASE_URL } from "../api.config";
import { createAxiosInstance } from "../axiosInstance";

const axsinstance = createAxiosInstance();

export const createOrder = async (data: OrderCreate, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.post(`${BASE_URL}/order/create`, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmOrder = async (paymentIntentId: string, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.post(
      `${BASE_URL}/order/confirm`,
      { paymentIntentId },
      { headers }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllOrder = async (token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.get(`${BASE_URL}/order`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId: number, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.get(`${BASE_URL}/order/${orderId}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
