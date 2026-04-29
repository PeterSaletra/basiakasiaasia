import axios from "axios";
import { AUTH_BASE_URL, USE_MOCK_API } from "@/config/api";
import { mockLogin, mockLogout, mockRegister } from "@/mocks/mockApi";

export async function login(email: string, password: string) {
  if (USE_MOCK_API) {
    return mockLogin(email, password);
  }

  try {
    const response = await axios.post(`${AUTH_BASE_URL}/login`, {
      "email": email,
      "password": password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    
    // Check if it's a ban error (403)
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error("Twoje konto zostało zablokowane. Skontaktuj się z administratorem.");
    }
    
    // For other errors, throw the original error
    throw error;
  }
}

export async function register(email: string, password: string, username: string, date_of_birth: Date | undefined, gender: string, role_id: number = 1) {
  if (USE_MOCK_API) {
    return mockRegister(email, password, username, date_of_birth, gender, role_id);
  }

  const response = await axios.post(`${AUTH_BASE_URL}/register`, {
    "username": username,
    "email": email,
    "password": password,
    "date_of_birth": date_of_birth,
    "gender": gender,
    "role_id": role_id,
  });
  return response.data;
}

export async function logout() {
  if (USE_MOCK_API) {
    return mockLogout();
  }

  const token = sessionStorage.getItem("refreshToken");
  const response = await axios.post(
    `${AUTH_BASE_URL}/logout`,
    {
      "token": JSON.parse(token || "null"),
    }
  );
  return response.data;
}
