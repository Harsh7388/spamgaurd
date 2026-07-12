import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://spamguard-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000, // 60 seconds — Render free-tier cold starts can take 30-50s
});

/**
 * Retry wrapper: retries the request up to `retries` times with a delay
 * between attempts. This handles Render cold-start scenarios where the
 * first request may wake the service but time out before it responds.
 */
async function withRetry(fn, retries = 2, delayMs = 3000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries;

      // If the server returned a real response (e.g. 400 validation error),
      // don't retry — bubble it up immediately.
      if (error?.response) {
        throw error;
      }

      // Network error / timeout — retry unless this was the last attempt
      if (isLastAttempt) {
        throw error;
      }

      // Wait before retrying (gives the cold-starting backend time to spin up)
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export const predictSpam = async (message) => {
  try {
    const data = await withRetry(async () => {
      const response = await api.post("/predict", { message });
      return response.data;
    });
    return data;
  } catch (error) {
    if (error?.response?.data) {
      throw error;
    }
    throw new Error(
      "Unable to reach the SpamGuard backend. Please check that the backend server is running and try again."
    );
  }
};

export const checkHealth = async () => {
  try {
    const data = await withRetry(async () => {
      const response = await api.get("/health");
      return response.data;
    });
    return data;
  } catch (error) {
    throw new Error("SpamGuard backend is unavailable right now.");
  }
};

export default api;
