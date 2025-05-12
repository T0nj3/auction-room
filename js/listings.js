import { fetchListings } from "./apiUtils.js";

const newsMobile = document.getElementById("news-carousel");
const newsDesktop = document.getElementById("news-grid");
const oldMobile = document.getElementById("oldest-carousel");
const oldDesktop = document.getElementById("oldest-grid");

function createCardElement(listing) {
  const wrapper = document.createElement("a");
  wrapper.href = `./listings/detail-listing.html?id=${listing.id}`;
  wrapper.className = "block";

  const card = document.createElement("div");
  card.className =
    "bg-white border border-gray-300 rounded shadow-lg w-full max-w-[280px] h-[420px] flex flex-col items-center p-4";

  const imageBox = document.createElement("div");
  imageBox.className =
    "w-full h-[250px] flex items-center justify-center bg-white p-2";

  const img = document.createElement("img");
  img.src = listing.media?.[0]?.url || "https://placehold.co/240x240?text=No+Image";
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
