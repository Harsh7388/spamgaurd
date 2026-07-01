import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://spamguard-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

export const predictSpam = async (message) => {
  try {
    const response = await api.post("/predict", { message });
    return response.data;
  } catch (error) {
    if (error?.response?.data) {
      throw error;
    }
    throw new Error("Unable to reach the SpamGuard backend. Please try again in a moment.");
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    throw new Error("SpamGuard backend is unavailable right now.");
  }
};

export default api;
