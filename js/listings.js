import { fetchListings } from "./apiUtils.js";

const newsMobile = document.getElementById("news-carousel");
const newsDesktop = document.getElementById("news-grid");
const oldMobile = document.getElementById("oldest-carousel");
const oldDesktop = document.getElementById("oldest-grid");

function createCardElement(listing) {
    const image =
      Array.isArray(listing.media) &&
      listing.media.length > 0 &&
      listing.media[0].url
        ? listing.media[0].url
        : "https://placehold.co/400x300?text=No+Image";
  
    const card = document.createElement("a");
    card.href = `./listings/detail-listing.html?id=${listing.id}`;
    card.className = "min-w-full md:min-w-0 snap-center bg-white shadow-lg block";
  
    const img = document.createElement("img");
    img.src = image;
    img.alt = listing.title;
    img.className = "w-full h-60 object-cover";
  
    const title = document.createElement("p");
    title.className = "text-center font-serif py-2";
    title.textContent = listing.title;
  
    card.appendChild(img);
    card.appendChild(title);
  
    return card;
  }
  
  function insertListings(listings, mobileContainer, desktopContainer) {
    if (mobileContainer) {
      mobileContainer.innerHTML = "";
      listings.slice(0, 3).forEach(listing => {
        mobileContainer.appendChild(createCardElement(listing));
      });
    }
  
    if (desktopContainer) {
      desktopContainer.innerHTML = "";
      listings.slice(0, 3).forEach(listing => {
        const card = createCardElement(listing);
        card.classList.remove("min-w-full", "snap-center");
        card.classList.add("bg-white", "shadow-lg");
        desktopContainer.appendChild(card);
      });
    }
  }
  

async function renderListings() {
  const newestListings = await fetchListings("created", "desc");
  const oldestListings = await fetchListings("created", "asc");

  insertListings(newestListings, newsMobile, newsDesktop);
  insertListings(oldestListings, oldMobile, oldDesktop);
}

renderListings();
