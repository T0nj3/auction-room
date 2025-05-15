import { ShowError } from "./error/errorAuth.js";

const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";

/**
 * Log in a user using the provided credentials.
 * @param {Object} userData - The user login data.
 * @param {string} userData.email - User email address.
 * @param {string} userData.password - User password.
 * @returns {Promise<Object>} The response data from the API if successful.
 * @throws Will throw an error if login fails.
 */
export async function loginUser(userData) {
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      ShowError(result.errors ? result.errors[0].message : "Login failed");
      throw new Error(
        result.errors ? result.errors[0].message : "Login failed",
      );
    }

    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Register a new user with the provided data.
 * @param {Object} userData - The registration form data.
 * @param {string} userData.name - Chosen username.
 * @param {string} userData.email - User email address.
 * @param {string} userData.password - Chosen password.
 * @returns {Promise<Object>} The response data from the API if successful.
 * @throws Will throw an error if registration fails.
 */
export async function registerUser(userData) {
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors ? result.errors[0].message : "Registration failed",
      );
    }

    return result;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
