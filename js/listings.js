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
  card.className = "min-w-full md:min-w-0 snap-center bg-white shadow-xl flex flex-col h-[420px] overflow-hidden border border-brown-100 hover:shadow-xl transition";

  const img = document.createElement("img");
  img.src = image;
  img.alt = listing.title;
  img.className = "w-full h-[300px] object-cover p-3 border border-white";

  const titleWrapper = document.createElement("div");
  titleWrapper.className = "flex-grow flex items-center justify-center";

  const title = document.createElement("p");
  title.className = "text-center font-serif";
  title.textContent = listing.title;

  titleWrapper.appendChild(title);
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
  const newestListings = await fetchListings("created", "desc");
  const allListings = await fetchAllListings();

  const popularListings = allListings
    .filter(listing => listing.bids && listing.bids.length > 0)
    .sort((a, b) => b.bids.length - a.bids.length);

  insertListings(newestListings, newsMobile, newsDesktop);
  insertListings(popularListings, popularMobile, popularDesktop);
}

renderListings();