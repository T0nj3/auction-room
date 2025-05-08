export const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";
export const API_BASE_URL = "https://v2.api.noroff.dev/auction"; 


const token = localStorage.getItem("token");
export async function getUserProfile() {

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
    if (!token) {
        console.error('Token is missing');
        return null;
    }

    const dataToSend = {};

    if (bio) dataToSend.bio = bio;
    if (avatar) dataToSend.avatar = { url: avatar, alt: "User avatar" };
    if (banner) dataToSend.banner = { url: banner, alt: "User banner" };

    if (Object.keys(dataToSend).length === 0) {
        console.error('No fields provided for update.');
        return null;
    }

    console.log("Sending data to API:", dataToSend);  

    const response = await fetch(`${API_BASE_URL}/profiles/${name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY,
        },
        body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
        const errorText = await response.text();  
        console.error(`Failed to update profile. Status: ${response.status}. Message: ${errorText}`);
        return null;
    }

    return await response.json();
}

export async function createPost(title, description, imageUrl, endsAt, amount) {
 
    if (!token) {
        console.error("no token is found in localStorage.");
        return null;
    }

    const postData = {
        title,
        description,  
        media: imageUrl ? [{ url: imageUrl, alt: "Post image" }] : [],
        endsAt: endsAt,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/listings`, {  
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,  
                "X-Noroff-API-Key": X_NOROFF_API_KEY,
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            console.error("Feil ved oppretting av post:", await response.text());
            return null;
        }

        return await response.json();  
    } catch (error) {
        console.error("Feil under forespørsel:", error);
        return null;
    }
}

export async function fetchListing(username) {
 
    if (!token) {
        console.error("no token is found in localStorage.");
        return null;
    }
    try {
        const url = `${API_BASE_URL}/profiles/${username}/listings`;
        console.log("Fetching from URL:", url); 
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY,
            "Content-Type": "application/json",
          },
        });
        
        console.log("Response status:", response.status); 
        
        if (!response.ok) throw new Error("Could not fetch user posts.");
        
        return await response.json();
    } catch (error) {
      console.error("Error fetching user posts:", error.message);
      throw error;
    }
  }

  export async function deleteUserPost(postId) {

    
    if (!token) {
      console.error("No token found in localStorage.");
      return null;
    }
  
    const response = await fetch(`${API_BASE_URL}/listings/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY, 
      },
    });
  
    if (!response.ok) {
      alert("Failed to delete post. Please try again.");
      return null;
    }
  
  }

  export async function editPost(postId, newTitle, newBody, newImageUrl) {
    if (!token) return;

    const updatedPost = {
        title: newTitle,
        description: newBody,
        media: newImageUrl ? [{ url: newImageUrl, alt: "Updated image" }] : [],
    };

    const response = await fetch(`${API_BASE_URL}/listings/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY,
        },
        body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
        console.error("Failed to update post.");
        return;
    }

    return await response.json();
}

export async function SeeWinningAuction() {
    if (!token) {
        console.error("No token found in localStorage.");
        return null;
    }

    const decoded = JSON.parse(
        window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    const username = decoded.name;

    if (!username) {
        console.error("Username not found in token.");
        return null;
    }

    const response = await fetch(`${API_BASE_URL}/profiles/${username}/wins`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY,
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch winning auctions.");
        return null;
    }

    return await response.json();
}