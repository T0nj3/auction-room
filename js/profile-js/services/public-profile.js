import { fetchProfile, fetchListingsByUser } from "../../apiutils.js";

const token = localStorage.getItem("token");

const username = new URLSearchParams(window.location.search).get("user");

const nameEl = document.getElementById("public-username");
const bioEl = document.getElementById("public-bio");
const avatarEl = document.getElementById("profile-avatar");
const bannerEl = document.getElementById("profile-banner");
const listingsEl = document.getElementById("user-listings");

const activeTabBtn = document.getElementById("active-tab");
const oldTabBtn = document.getElementById("old-tab");

function accessProfile() {
  if (token === null) {
      alert("You need to log in to access this page.");
      window.location.href = "../index.html";
  }
}


function createListingCard(listing) {
  const cardWrapper = document.createElement("div");
  cardWrapper.className = "bg-white rounded shadow-md hover:shadow-lg transition w-full max-w-sm p-3";

  const a = document.createElement("a");
  a.href = `../listings/detail-listing.html?id=${listing.id}`;
  a.className = "block";

  const img = document.createElement("img");
  img.src = listing.media[0]?.url || "https://placehold.co/400x300?text=No+Image";
  img.alt = listing.title;
  img.className = "w-full h-48 object-cover rounded-t";

  const title = document.createElement("div");
  title.className = "text-center font-body text-lg font-medium py-6";
  title.textContent = listing.title;

  a.appendChild(img);
  a.appendChild(title);
  cardWrapper.appendChild(a);

  return cardWrapper;
}

function renderListings(listings) {
  listingsEl.replaceChildren();
  listings.forEach((listing) => {
    listingsEl.appendChild(createListingCard(listing));
  });
}

async function renderProfile() {
  if (!username) return;

  try {
    const profile = await fetchProfile(username);
    const listings = await fetchListingsByUser(username);

    nameEl.textContent = profile.name || "Unknown";
    bioEl.textContent = profile.bio || "No bio available";
    avatarEl.src = profile.avatar?.url || "https://placehold.co/100x100?text=Avatar";
    avatarEl.alt = profile.avatar?.alt || profile.name || "User avatar";
    bannerEl.src = profile.banner?.url || "https://placehold.co/1200x300?text=Banner";
    bannerEl.alt = profile.banner?.alt || "Header banner";

    const now = new Date();
    const activeListings = listings.filter((l) => new Date(l.endsAt) > now);
    const oldListings = listings.filter((l) => new Date(l.endsAt) <= now);

   
    renderListings(activeListings);

    activeTabBtn.addEventListener("click", () => {
      activeTabBtn.classList.add("font-bold", "text-brown", "border-b-4", "border-brown");
      oldTabBtn.classList.remove("font-bold", "text-brown", "border-b-4", "border-brown");
      renderListings(activeListings);
    });

    oldTabBtn.addEventListener("click", () => {
      oldTabBtn.classList.add("font-bold", "text-brown", "border-b-4", "border-brown");
      activeTabBtn.classList.remove("font-bold", "text-brown", "border-b-4", "border-brown");
      renderListings(oldListings);
    });

  } catch (error) {
    console.error("Error rendering profile:", error);
  }
}

renderProfile();
accessProfile();