import { BASE_URL } from "../api.config";
import { createAxiosInstance } from "../axiosInstance";

const axsinstance = createAxiosInstance();

export const addFavorite = async (dishId: number, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(dishId, token);

    const response = await axsinstance.post(
      `${BASE_URL}/user/favorite`,
      { dishId },
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFavorite = async (dishId: number, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.delete(`${BASE_URL}/user/favorite`, {
      headers,
      data: { dishId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFavorite = async (token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axsinstance.get(`${BASE_URL}/user/favorite`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
