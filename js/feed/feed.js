import { fetchAllListings } from "../apiUtils.js";

const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const listingGrid = document.getElementById("listing-grid");
const paginationContainer = document.getElementById("pagination");

let allListings = [];
let currentPage = 1;
const listingsPerPage = 12;
let currentFilter = "all";
let currentSearch = "";

function createCard(listing) {
  const wrapper = document.createElement("a");
  wrapper.href = `detail-listing.html?id=${listing.id}`;
  wrapper.className = "block";

  const card = document.createElement("div");
  card.className =
    "shadow-lg flex flex-col items-center aspect-[3/4] p-3 border border-brown-100 hover:shadow-xl transition bg-white hover:scale-105 cursor-pointer rounded-lg group";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "relative w-full h-2/3 overflow-hidden group border";

  const img = document.createElement("img");
  img.src =
    listing.media?.[0]?.url || "https://placehold.co/400x300?text=No+Image";
  img.alt = listing.media?.[0]?.alt || listing.title;
  img.className =
    "w-full h-full object-cover transition duration-300 cursor-pointer hover:scale-105 group-hover:scale-105";

  imageWrapper.appendChild(img);

  const infoContainer = document.createElement("div");
  infoContainer.className =
    "flex-grow flex flex-col items-center justify-center text-center gap-1";

  const title = document.createElement("p");
  title.textContent = listing.title;
  title.className = "text-center font-body text-xl font-regular text-brown-900";

  const timeLeft = document.createElement("p");
  const endsAt = new Date(listing.endsAt);
  const timeDiff = Math.max(endsAt - new Date(), 0);

  const days = parseInt(timeDiff / (1000 * 60 * 60 * 24));
  const hours = parseInt((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = parseInt((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

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

  timeLeft.textContent = `Time left: ${days}d ${hours}h ${minutes}m`;
  timeLeft.className = "text-sm text-gray-700 mt-2";

  infoContainer.appendChild(title);
  infoContainer.appendChild(timeLeft);
  infoContainer.appendChild(priceText);
  card.append(imageWrapper, infoContainer);
  wrapper.appendChild(card);

  return wrapper;
}

function renderFeed() {
  const now = new Date();
  const filtered = allListings.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(currentSearch.toLowerCase());

    const endsAt = new Date(item.endsAt);
    const isActive = endsAt > now;
    const isEnded = endsAt <= now;

    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && isActive) ||
      (currentFilter === "ended" && isEnded);

    return matchesSearch && matchesFilter;
  });

  const start = (currentPage - 1) * listingsPerPage;
  const end = start + listingsPerPage;
  const paginated = filtered.slice(start, end);

  listingGrid.innerHTML = "";
  paginated.forEach((listing) => listingGrid.appendChild(createCard(listing)));

  renderPaginationControls(filtered.length);
}

function renderPaginationControls(totalItems) {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(totalItems / listingsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `min-w-[40px] px-3 py-1 rounded text-sm border transition ${
      i === currentPage
        ? "bg-button-prime text-white border-button-prime"
        : "bg-white text-black border-gray-300 hover:bg-gray-100"
    }`;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderFeed();
    });
    paginationContainer.appendChild(btn);
  }
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    currentPage = 1;
    renderFeed();
  });
});

searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  currentPage = 1;
  renderFeed();
});

(async () => {
  allListings = await fetchAllListings();
  renderFeed();
})();
