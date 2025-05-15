/**
 * API config and authentication token
 */
export const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";
export const API_BASE_URL = "https://v2.api.noroff.dev/auction";
const token = localStorage.getItem("token");

/**
 * Get the currently logged in user's profile
 * @returns {Promise<Object|null>}
 */
export async function getUserProfile() {
  if (!token) {
    console.error("No access; the user is not logged in.");
    return null;
  }

  const decodedPayload = JSON.parse(
    window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
  );
  const name = decodedPayload.name;

  if (!name) {
    console.error("No 'name' found in token.");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${name}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch profile: ${response.status}`);
      console.error("Error response:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

/**
 * Update user profile data
 * @param {string} name
 * @param {string} bio
 * @param {string} avatar
 * @param {string} banner
 * @returns {Promise<Object|null>}
 */
export async function updateUserProfile(name, bio, avatar, banner) {
  if (!token) {
    console.error("Token is missing");
    return null;
  }

  const dataToSend = {};
  if (bio) dataToSend.bio = bio;
  if (avatar) dataToSend.avatar = { url: avatar, alt: "User avatar" };
  if (banner) dataToSend.banner = { url: banner, alt: "User banner" };

  if (Object.keys(dataToSend).length === 0) {
    console.error("No fields provided for update.");
    return null;
  }

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
    console.error(
      `Failed to update profile: ${response.status}`,
      await response.text(),
    );
    return null;
  }

  return await response.json();
}

/**
 * Create a new auction listing
 * @param {string} title
 * @param {string} description
 * @param {string} imageUrl
 * @param {string} endsAt
 * @returns {Promise<Object|null>}
 */
export async function createPost(title, description, imageUrl, endsAt) {
  if (!token) {
    console.error("No token in localStorage.");
    return null;
  }

  const postData = {
    title,
    description,
    media: imageUrl ? [{ url: imageUrl, alt: "Post image" }] : [],
    endsAt,
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
      console.error("Failed to create post:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Request error:", error);
    return null;
  }
}

/**
 * Fetch listings created by a specific user
 * @param {string} username
 * @returns {Promise<Object|null>}
 */
export async function fetchListing(username) {
  if (!token) {
    console.error("No token in localStorage.");
    return null;
  }

  try {
    const url = `${API_BASE_URL}/profiles/${username}/listings`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Could not fetch user posts.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    throw error;
  }
}

/**
 * Delete a listing by ID
 * @param {string} postId
 */
export async function deleteUserPost(postId) {
  if (!token) {
    console.error("No token found.");
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
    alert("Failed to delete post.");
    return null;
  }
}

/**
 * Edit/update an existing listing
 * @param {string} postId
 * @param {string} newTitle
 * @param {string} newBody
 * @param {string} newImageUrl
 * @returns {Promise<Object|undefined>}
 */
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

/**
 * Fetch auctions the user has won
 * @returns {Promise<Object|null>}
 */
export async function SeeWinningAuction() {
  if (!token) {
    console.error("No token in localStorage.");
    return null;
  }

  const decoded = JSON.parse(
    window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
  );
  const username = decoded.name;

  if (!username) {
    console.error("Username not found in token.");
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/profiles/${username}/wins`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch wins.");
    return null;
  }

  return await response.json();
}

/**
 * Fetch all bids the current user has placed
 * @returns {Promise<Object|null>}
 */
export async function yourOwnBids() {
  const username = localStorage.getItem("username");

  if (!token) {
    console.error("No token in localStorage.");
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/profiles/${username}/bids?_listings=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": X_NOROFF_API_KEY,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch your bids.");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bids:", error.message);
    return null;
  }
}
