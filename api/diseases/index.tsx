import useStore from "@/hooks/useStore";
import { BASE_URL } from "../api.config";
import { createAxiosInstance } from "../axiosInstance";
import { Dish } from "@/interfaces";

export interface Disease {
  id: number;
  name: string;
  desc: string;
  prevention: string;
}

const axsinstance = createAxiosInstance();

export const getDiseaseById = async (
  age: number,
  diseaseId: number
): Promise<Disease> => {
  try {
    const response = await axsinstance.put<Disease>(
      `${BASE_URL}/user/get-disease`,
      {
        age,
        diseaseId,
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch disease details");
    }
  } catch (error) {
    throw error;
  }
};

export const getAllDiseases = async (token: string): Promise<Disease[]> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axsinstance.get<Disease[]>(`${BASE_URL}/diseases`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDishByDisease = async (
  age: string,
  diseaseId: string,
  token: string
): Promise<Dish[]> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axsinstance.put(
      `${BASE_URL}/user/get-disease`,
      { diseaseId: Number(diseaseId), age: Number(age) },
      {
        headers,
      }
    );
    return response.data.dishes as Dish[];
  } catch (error) {
    throw error;
  }
};

export const getDishByDiseases = async (
  diseaseId: string | null,
  token: string
) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(token, diseaseId);

    const response = await axsinstance.get(
      `${BASE_URL}/user/diseases/${diseaseId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDishById = async (dishId: string | null, token: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(token, dishId);

    const response = await axsinstance.get(
      `${BASE_URL}/dishes/${dishId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
