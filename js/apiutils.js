const API_BASE_URL = "https://v2.api.noroff.dev/auction";
const API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";

/**
 * Fetch a limited number of listings, sorted by a specific key and order.
 * @param {string} sort - Field to sort by, e.g. "created" or "endsAt".
 * @param {string} order - Sort order, "asc" or "desc".
 * @returns {Promise<Array>} - Array of listing objects.
 */
export async function fetchListings(sort = "created", order = "desc") {
  const url = `${API_BASE_URL}/listings?_bids=true&sort=${sort}&sortOrder=${order}&limit=3`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

/**
 * Fetch a single listing by ID, including seller and bids data.
 * @param {string} id - The listing ID.
 * @returns {Promise<Object>} - Listing data with seller and bids.
 */
export async function fetchListingById(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/listings/${id}?_seller=true&_bids=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();
  return data.data;
}

/**
 * Fetch all listings including bid information, sorted by newest.
 * @returns {Promise<Array>} - Array of listing objects.
 */
export async function fetchAllListings() {
  const url = `${API_BASE_URL}/listings?_bids=true&sort=created&sortOrder=desc`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

/**
 * Fetch listings with pagination.
 * @param {number} page - Page number (starting at 1).
 * @param {number} limit - Number of items per page.
 * @returns {Promise<Array>} - Array of listing objects.
 */
export async function fetchPaginatedListings(page = 1, limit = 12) {
  const url = `${API_BASE_URL}/listings?limit=${limit}&offset=${(page - 1) * limit}`;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error with paginated fetch:", error);
    return [];
  }
}

/**
 * Fetch a user's current credit balance.
 * @param {string} username - The username to fetch credits for.
 * @returns {Promise<number>} - Amount of credits the user has.
 */
export async function fetchCredits(username) {
  const token = localStorage.getItem("token");
  const url = `${API_BASE_URL}/profiles/${username}/credits`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch credits");
  }

  const data = await response.json();
  return data.data;
}

/**
 * Place a bid on a listing.
 * @param {string} listingId - The ID of the listing.
 * @param {number} amount - The amount to bid.
 * @returns {Promise<Object>} - Bid response.
 */
export async function placeBid(listingId, amount) {
  const token = localStorage.getItem("token");
  const url = `${API_BASE_URL}/listings/${listingId}/bids`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({ amount: Number(amount) }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.message || "Failed to place bid");
  }

  return await response.json();
}

/**
 * Fetch all listings created by a specific user.
 * @param {string} username - Username to look up.
 * @returns {Promise<Array>} - Array of the user's listings.
 */
export async function fetchListingsByUser(username) {
  const token = localStorage.getItem("token");
  const url = `${API_BASE_URL}/profiles/${username}/listings`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch user's listings");
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch a user's profile data.
 * @param {string} username - Username to look up.
 * @returns {Promise<Object>} - Profile data.
 */
export async function fetchProfile(username) {
  const token = localStorage.getItem("token");
  const url = `${API_BASE_URL}/profiles/${username}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch profile");
  }

  const data = await response.json();
  return data.data;
}
