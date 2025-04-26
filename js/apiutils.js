const API_BASE_URL = "https://v2.api.noroff.dev/auction";
const API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";

/**
 * @param {string} sort - 'created' eller annet
 * @param {string} order - 'asc' eller 'desc'
 * @returns {Promise<Array>} - Liste med poster
 */
export async function fetchListings(sort = "created", order = "desc") {
    const url = `${API_BASE_URL}/listings?sort=${sort}&sortOrder=${order}&limit=3`;

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
    console.error("Feil ved henting av data:", error);
    return [];
  }
}

export async function fetchListingById(id) {
    const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${id}`);
    const data = await response.json();
    return data.data;
  }

  export async function fetchAllListings() {
    const url = "https://v2.api.noroff.dev/auction/listings?_bids=true&sort=created&sortOrder=desc";
  
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "580b33a9-04f3-4da3-bb38-de9adcf9d9f8",
        },
      });
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  }

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
      console.error("Feil ved paginert henting:", error);
      return [];
    }
  }

  export async function fetchCredits(username) {
    const token = localStorage.getItem("token");
    const url = `https://v2.api.noroff.dev/auction/profiles/${username}/credits`;
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });
  
    if (!response.ok) {
      throw new Error("Kunne ikke hente credits");
    }
  
    const data = await response.json();
    return data.data;
  }