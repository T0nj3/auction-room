export const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";
export const API_BASE_URL = "https://v2.api.noroff.dev/auction"; 

export async function getUserProfile() {
    const token = localStorage.getItem("token");

    if (token === null) {
        console.error("No access; the user is not logged in.");
        return null;
    }

    const decodedPayload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const name = decodedPayload.name;

    if (name === null || name === undefined) {
        console.error("No 'name' found in token.");
        return null;
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
    };

    try {

        const response = await fetch(`${API_BASE_URL}/profiles/${name}`, { headers });

        if (response.ok === false) {
            console.error(`Something went wrong while fetching your profile: ${response.status}`);
            const responseText = await response.text();
            console.error("Error response:", responseText);
            return null;
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Something went wrong while fetching your profile:", error);
        return null;
    }
}