import { fetchListings, fetchAllListings } from "./apiUtils.js";

const newsMobile = document.getElementById("news-carousel");
const newsDesktop = document.getElementById("news-grid");
const popularMobile = document.getElementById("popular-carousel");
const popularDesktop = document.getElementById("popular-grid");

function createCardElement(listing) {
  const image =
    Array.isArray(listing.media) && listing.media[0]?.url
      ? listing.media[0].url
      : "https://placehold.co/400x300?text=No+Image";

  const card = document.createElement("a");
  card.href = `./listings/detail-listing.html?id=${listing.id}`;
  card.className =
    "min-w-full md:min-w-0 snap-center bg-white shadow-xl flex flex-col h-[420px] overflow-hidden border border-brown-100 hover:shadow-xl transition";

  const img = document.createElement("img");
  img.src = image;
  img.alt = listing.title;
  img.className = "w-full h-[300px] object-cover p-3 border border-white";

  const titleWrapper = document.createElement("div");
  titleWrapper.className =
    "flex-grow flex flex-col items-center justify-center"; // Changed to flex-col for vertical stacking

  const title = document.createElement("p");
  title.className = "text-center font-serif";
  title.textContent = listing.title;

  const timeLeft = document.createElement("p");
  const endsAt = new Date(listing.endsAt);
  const timeDiff = Math.max(endsAt - new Date(), 0);
  const days = parseInt(timeDiff / (1000 * 60 * 60 * 24));
  const hours = parseInt((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = parseInt((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  timeLeft.textContent = `Time left: ${days}d ${hours}h ${minutes}m`;
  timeLeft.className = "text-sm text-gray-700 mt-2";
  if (timeDiff <= 0) {
    timeLeft.textContent = "Auction ended";
    timeLeft.className = "text-sm text-red-700 mt-2";
  }

  const price = listing.bids?.length
    ? Math.max(...listing.bids.map((b) => b.amount))
    : 0;
  const priceText = document.createElement("p");
  priceText.textContent = `Highest bid: ${price} credits`;
  priceText.className = "text-sm text-gray-700";
  if (price === 0) {
    priceText.textContent = "No bids yet";
    priceText.className = "text-sm text-brown-700";
  }

  titleWrapper.appendChild(title);
  titleWrapper.appendChild(timeLeft);
  titleWrapper.appendChild(priceText);
  card.appendChild(img);
  card.appendChild(titleWrapper);

  return card;
}

function insertListings(listings, mobileContainer, desktopContainer) {
  if (mobileContainer) {
    mobileContainer.innerHTML = "";
    listings.slice(0, 3).forEach((listing) => {
      mobileContainer.appendChild(createCardElement(listing));
    });
  }

  if (desktopContainer) {
    desktopContainer.innerHTML = "";
    listings.slice(0, 3).forEach((listing) => {
      const card = createCardElement(listing);
      card.classList.remove("min-w-full", "snap-center");
      card.classList.add("bg-white", "shadow-lg");
      desktopContainer.appendChild(card);
    });
  }
}

async function renderListings() {
try {
  const newestListings = await fetchListings("created", "desc");
  const allListings = await fetchAllListings();

  const popularListings = allListings
    .filter((listing) => listing.bids && listing.bids.length > 0)
    .sort((a, b) => b.bids.length - a.bids.length);

  insertListings(newestListings, newsMobile, newsDesktop);
  insertListings(popularListings, popularMobile, popularDesktop);
}
catch (error) {
  console.error("Error rendering listings:", error);
}
}

renderListings();
