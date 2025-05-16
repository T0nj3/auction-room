import { fetchListingById, placeBid } from "./apiUtils.js";
import { renderUserUI } from "./hamburger.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const titleEl = document.getElementById("listing-title");
const imageEl = document.getElementById("listing-image");
const descriptionEl = document.getElementById("listing-description");

const sellerNameEl = document.getElementById("seller-name");
const sellerEmailEl = document.getElementById("seller-email");

const timeLeftEl = document.getElementById("time-left");
const startPriceEl = document.getElementById("start-price");
const currentBidEl = document.getElementById("current-bid");

const leaderNameEl = document.getElementById("leader-name");
const leaderPriceEl = document.getElementById("leader-price");
const leaderAvatarEl = document.getElementById("leader-avatar");

const bidHistoryEl = document.getElementById("bid-history");

function calculateTimeLeft(endsAt) {
  const end = new Date(endsAt);
  const now = new Date();
  const diff = end - now;
  if (diff <= 0) return "Auction ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}min`;
}

function formatAmount(amount) {
  return new Intl.NumberFormat("no-NO").format(amount);
}

async function renderListingDetail() {
  try {
    const listing = await fetchListingById(id);

    titleEl.textContent = listing.title;
    descriptionEl.textContent = listing.description;
    imageEl.src =
      listing.media[0]?.url || "https://placehold.co/400x300?text=No+Image";
    imageEl.alt = listing.media[0]?.alt || listing.title;

    sellerNameEl.innerHTML = "";
    if (listing.seller?.name) {
      const sellerLink = document.createElement("a");
      sellerLink.href = `../profile/public-profile.html?user=${listing.seller.name}`;
      sellerLink.className = "text-blue-700 underline";
      sellerLink.textContent = listing.seller.name;
      sellerNameEl.appendChild(sellerLink);
    } else {
      sellerNameEl.textContent = "Unknown";
    }
    sellerEmailEl.remove();

    timeLeftEl.textContent = calculateTimeLeft(listing.endsAt);

    const sortedBids = Array.isArray(listing.bids)
      ? listing.bids.sort((a, b) => b.amount - a.amount)
      : [];
    const highestBid = sortedBids[0];
    const startAmount = sortedBids.length
      ? sortedBids[sortedBids.length - 1].amount
      : 0;

    startPriceEl.textContent = formatAmount(startAmount || 0);
    currentBidEl.textContent = highestBid
      ? formatAmount(highestBid.amount)
      : "No bids yet";

    if (highestBid?.bidder) {
      leaderNameEl.textContent = highestBid.bidder.name || "Unknown";
      leaderPriceEl.textContent = formatAmount(highestBid.amount);
      leaderAvatarEl.src =
        highestBid.bidder.avatar?.url ||
        "https://placehold.co/100x100?text=Avatar";
      leaderAvatarEl.alt =
        highestBid.bidder.avatar?.alt || highestBid.bidder.name || "Avatar";
    } else {
      leaderNameEl.textContent = "–";
      leaderPriceEl.textContent = "–";
      leaderAvatarEl.src = "https://placehold.co/100x100?text=No+Bidder";
      leaderAvatarEl.alt = "No bidder";
    }

    bidHistoryEl.replaceChildren();

    sortedBids.forEach((bid) => {
      const wrapper = document.createElement("div");
      wrapper.className =
        "bg-gray-400 p-4 rounded-md flex items-center gap-4 max-w-md";

      const img = document.createElement("img");
      img.src =
        bid.bidder?.avatar?.url || "https://placehold.co/100x100?text=Avatar";
      img.alt = bid.bidder?.avatar?.alt || bid.bidder?.name || "Avatar";
      img.className = "w-10 h-10 rounded-full";

      const text = document.createElement("div");

      const nameLine = document.createElement("div");
      const nameLabel = document.createElement("span");
      nameLabel.className = "font-medium";
      nameLabel.textContent = "Name:";
      nameLine.appendChild(nameLabel);

      if (bid.bidder?.name) {
        const bidderLink = document.createElement("a");
        bidderLink.href = `../profile/public-profile.html?user=${bid.bidder.name}`;
        bidderLink.textContent = ` ${bid.bidder.name}`;
        bidderLink.className = "text-blue-700 underline ml-1";
        nameLine.appendChild(bidderLink);
      } else {
        nameLine.append(" Unknown");
      }

      const priceLine = document.createElement("div");
      const priceLabel = document.createElement("span");
      priceLabel.className = "font-medium";
      priceLabel.textContent = "Price:";
      priceLine.appendChild(priceLabel);
      priceLine.append(` ${formatAmount(bid.amount)} Credits`);

      text.appendChild(nameLine);
      text.appendChild(priceLine);

      wrapper.appendChild(img);
      wrapper.appendChild(text);
      bidHistoryEl.appendChild(wrapper);
    });
  } catch (error) {
    console.error("Error rendering listing detail:", error);
  }
}

renderListingDetail();


const bidButton = document.getElementById("bid-toggle-btn");
const bidForm = document.createElement("div");
bidForm.className = "mt-4 space-y-2 hidden";

const bidInput = document.createElement("input");
bidInput.type = "number";
bidInput.placeholder = "Enter your bid";
bidInput.className = "border rounded px-3 py-2 w-full";

const submitBtn = document.createElement("button");
submitBtn.textContent = "Submit Bid";
submitBtn.className =
  "bg-button-prime hover:bg-white hover:text-button-prime text-white font-bold px-6 py-2 rounded-md border border-button-prime transition w-full";

bidForm.appendChild(bidInput);
bidForm.appendChild(submitBtn);
bidButton.insertAdjacentElement("afterend", bidForm);

bidButton.addEventListener("click", () => {
  bidForm.classList.toggle("hidden");
});

submitBtn.addEventListener("click", async () => {
  const amount = bidInput.value;

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert("Please enter a valid bid amount.");
    return;
  }

  try {
    await placeBid(id, amount);
    alert("Bid placed successfully!");
    bidInput.value = "";
    bidForm.classList.add("hidden");

    renderListingDetail();
    renderUserUI();
  } catch (error) {
    alert("Error placing bid: " + error.message);
  }
});
