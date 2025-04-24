import { fetchAllListings } from "../apiUtils.js";

const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const listingGrid = document.getElementById("listing-grid");
const paginationContainer = document.getElementById("pagination");

let allListings = [];
let currentPage = 1;
const listingsPerPage = 12;
let currentTag = "";
let currentSearch = "";

function createCard(listing) {
  const wrapper = document.createElement("a");
  wrapper.href = `detail-listing.html?id=${listing.id}`;
  wrapper.className = "shadow-lg hover:shadow-xl transition block bg-white rounded";

  const img = document.createElement("img");
  img.src = listing.media[0]?.url || "https://placehold.co/400x300?text=No+Image";
  img.alt = listing.media[0]?.alt || listing.title;
  img.className = "w-full h-60 object-cover";

  const title = document.createElement("p");
  title.textContent = listing.title;
  title.className = "text-center font-serif py-2";

  wrapper.appendChild(img);
  wrapper.appendChild(title);

  return wrapper;
}

function renderFeed() {
  const filtered = allListings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase());
    const matchesTag = currentTag === "" || item.tags.includes(currentTag);
    return matchesSearch && matchesTag;
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
    currentTag = btn.dataset.tag;
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