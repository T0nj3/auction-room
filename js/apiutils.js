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