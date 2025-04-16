const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";

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
        result.errors ? result.errors[0].message : "Login failed"
      );
    }
    return result; 
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}