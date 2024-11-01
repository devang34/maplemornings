import { BASE_URL } from "../api.config";
import { createAxiosInstance } from "../axiosInstance";

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
    console.error("Error fetching disease details:", error);
    throw error;
  }
};

export const getAllDiseases = async (): Promise<Disease[]> => {
  try {
    const response = await axsinstance.get<Disease[]>(`${BASE_URL}/diseases`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch all diseases");
    }
  } catch (error) {
    console.error("Error fetching all diseases:", error);
    throw error;
  }
};
