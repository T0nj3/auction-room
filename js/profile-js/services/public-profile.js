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
  const wrapper = document.createElement("a");
  wrapper.href = `../listings/detail-listing.html?id=${listing.id}`;
  wrapper.className = "block";

  const card = document.createElement("div");
  card.className =
    "bg-white border border-gray-300 rounded shadow-lg w-full max-w-[280px] h-[420px] flex flex-col items-center p-4";

  const imageBox = document.createElement("div");
  imageBox.className =
    "w-full h-[250px] flex items-center justify-center bg-white p-2";

  const img = document.createElement("img");
  img.src = listing.media[0]?.url || "https://placehold.co/240x240?text=No+Image";
  img.alt = listing.title;
  img.className = "w-full h-full object-cover rounded";

  imageBox.appendChild(img);

  const content = document.createElement("div");
  content.className =
  "flex flex-col justify-end items-center text-center px-2 pt-8 pb-4 mt-auto gap-1";

  const title = document.createElement("h3");
  title.className = "text-base font-bold";
  title.textContent = listing.title;

  const bid = document.createElement("p");
  bid.className = "text-sm text-gray-700";
  bid.textContent = listing.bids?.length
    ? `Highest bid: ${Math.max(...listing.bids.map((b) => b.amount))} credits`
    : "Highest bid: No bids yet";

  const time = document.createElement("p");
  time.className = "text-xs text-gray-500";
  time.textContent = `Time left: ${Math.max(
    Math.floor((new Date(listing.endsAt) - new Date()) / 3600000),
    0
  )}h`;

  content.append(title, bid, time);
  card.append(imageBox, content);
  wrapper.appendChild(card);
  return wrapper;
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
      activeTabBtn.classList.add("bg-brown");
      oldTabBtn.classList.remove("bg-brown");
      renderListings(activeListings);
    });
    
    oldTabBtn.addEventListener("click", () => {
      oldTabBtn.classList.add("bg-brown");
      activeTabBtn.classList.remove("bg-brown");
      renderListings(oldListings);
    });

  } catch (error) {
    console.error("Error rendering profile:", error);
  }
}

renderProfile();
accessProfile();