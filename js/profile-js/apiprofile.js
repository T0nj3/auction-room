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

export async function updateUserProfile(name, bio, avatar, banner) {
    const token = localStorage.getItem('token');  // Hent token fra localStorage
    if (!token) {
        console.error('Token is missing');
        return null;
    }

    // Hvis bio, avatar eller banner er tomme, returner null og logg en feil
    if (!bio || !avatar || !banner) {
        console.error('Missing required fields: bio, avatar, or banner.');
        return null;
    }

    // Forbered dataene med riktig struktur
    const dataToSend = {
        bio: bio,  // Vi sender bio som en enkel tekst
        avatar: { url: avatar, alt: "User avatar" },  // Avatar som objekt med url og alt
        banner: { url: banner, alt: "User banner" }   // Banner som objekt med url og alt
    };

    console.log("Sending data to API:", dataToSend);  // Logg dataene før de sendes

    const response = await fetch(`${API_BASE_URL}/profiles/${name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY,  // Sørg for at denne er definert og tilgjengelig
        },
        body: JSON.stringify(dataToSend),  // Send dataene som JSON
    });

    if (!response.ok) {
        const errorText = await response.text();  // Få mer informasjon om feilen fra serveren
        console.error(`Failed to update profile. Status: ${response.status}. Message: ${errorText}`);
        return null;
    }

    return await response.json();  // Returner svaret fra API-et
}