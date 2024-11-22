import { CartCreate } from "@/interfaces";
import { BASE_URL } from "../api.config";
import { createAxiosInstance } from "../axiosInstance";

const axsinstance = createAxiosInstance();

export const addToCart = async (data: CartCreate, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.post(`${BASE_URL}/cart/add`, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCart = async (token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.get(`${BASE_URL}/cart`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeCartItem = async (cartItem: number, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.delete(`${BASE_URL}/cart/item`, {
      headers,
      data: { cartItemId: cartItem },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const clearCart = async (token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.delete(`${BASE_URL}/cart/clear`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
