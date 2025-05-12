import { fetchListing, deleteUserPost, editPost, SeeWinningAuction, yourOwnBids} from "../apiprofile.js"; 

export async function showUserListings(username) {
    try {
      const result = await fetchListing(username);
      const listings = result?.data || [];
  
      const productsContainer = document.getElementById("productsContainer");
      productsContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
      productsContainer.innerHTML = "";
  
      listings.forEach((listing) => {
        const wrapper = document.createElement("div");
        wrapper.className = "bg-white border border-gray-300 rounded shadow-lg w-full max-w-[280px] h-[420px] flex flex-col items-center p-4";
  
        const imageBox = document.createElement("div");
        imageBox.className = "w-full h-[250px] flex items-center justify-center bg-white p-2";
  
        const img = document.createElement("img");
        img.src = listing.media?.[0]?.url || "https://placehold.co/240x240?text=No+Image";
        img.alt = listing.title;
        img.className = "w-full h-full object-cover rounded";
        imageBox.appendChild(img);
  
        const content = document.createElement("div");
        content.className = "flex flex-col justify-end items-center text-center px-2 pt-8 pb-4 mt-auto gap-1";
  
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
        wrapper.appendChild(imageBox);
        wrapper.appendChild(content);
        productsContainer.appendChild(wrapper);
      });
    } catch (error) {
      console.error("Error fetching user products:", error.message);
    }
  }
  

function createDeleteButton(postId) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "text-black px-4 py-2 rounded hover:bg-gray-300";

    deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await deleteUserPost(postId);

                const productElement = deleteButton.closest(".product");
                if (productElement) {
                    productElement.remove();
                }
                location.reload();
            } catch (error) {
                console.error("Error deleting post:", error.message);
                alert("Failed to delete the post.");
            }
        }
    });

    return deleteButton;
}

function createEditButton(product) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "text-black px-4 py-2 rounded hover:bg-gray-300";

    editButton.addEventListener("click", () => {
        document.getElementById("productsContainer").style.display = "none";

        const formSection = document.getElementById("edit-form");
        formSection.style.display = "block";

        document.getElementById("auction-title-edit").value = product.title || "";
        document.getElementById("auction-description-edit").value = product.description || "";
        document.getElementById("image-edit").value = product.media[0]?.url || "";

        formSection.dataset.postId = product.id;
    });

    return editButton;
}


function validateForm(newTitle, newDescription, newImageUrl) {
    if (newTitle === "" || newDescription === "" || newImageUrl === "") {
        alert("All fields are required.");
        return false;
    }
    return true;
}


function getFormInputValues() {
    const newTitle = document.getElementById("auction-title-edit").value;
    const newDescription = document.getElementById("auction-description-edit").value;
    const newImageUrl = document.getElementById("image-edit").value;

    return { newTitle, newDescription, newImageUrl };
}


function hideEditForm() {
    document.getElementById("edit-form").style.display = "none";  
    document.getElementById("productsContainer").style.display = "block"; 
}

async function reloadListings() {
    await showUserListings();
}

async function submitPostUpdate(postId, newTitle, newDescription, newImageUrl) {
    try {
      await editPost(postId, newTitle, newDescription, newImageUrl);
  

      const successMessage = document.getElementById("edit-success");
      successMessage.classList.remove("hidden");
  
      setTimeout(() => {
        hideEditForm();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating post:", error.message);
      alert("Failed to update the post.");
    }
  }


document.getElementById("edit-auction-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = document.getElementById("edit-form");
    const postId = form.dataset.postId;

    
    const formData = getFormInputValues();
    const { newTitle, newDescription, newImageUrl } = formData;

  
    if (validateForm(newTitle, newDescription, newImageUrl) === false) {
        return;
    }

    try {
  
        await submitPostUpdate(postId, newTitle, newDescription, newImageUrl);
    } catch (error) {
        console.error("Error submitting the post update:", error.message);
    }
});

export async function displayWinningAuctions() {
    const container = document.getElementById("winning_bid");
    container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
    container.innerHTML = "";
  
    const response = await SeeWinningAuction();
    const winningAuctions = response?.data || [];
  
    if (winningAuctions.length === 0) {
      container.innerHTML = "<p>You have not won any auctions.</p>";
      return;
    }
  
    winningAuctions.forEach((auction) => {
      const wrapper = document.createElement("div");
      wrapper.className = "bg-white border border-gray-300 rounded shadow-lg w-full max-w-[280px] h-[420px] flex flex-col items-center p-4";
  
      const imageBox = document.createElement("div");
      imageBox.className = "w-full h-[250px] flex items-center justify-center bg-white p-2";
  
      const img = document.createElement("img");
      img.src = auction.media?.[0]?.url || "https://placehold.co/240x240?text=No+Image";
      img.alt = auction.title;
      img.className = "w-full h-full object-cover rounded";
      imageBox.appendChild(img);
  
      const content = document.createElement("div");
      content.className = "flex flex-col justify-end items-center text-center px-2 pt-8 pb-4 mt-auto gap-1";
  
      const title = document.createElement("h3");
      title.className = "text-base font-bold";
      title.textContent = auction.title;
  
      const winningBid = document.createElement("p");
      winningBid.className = "text-sm text-green-600";
      winningBid.textContent = "Winning bid";
  
      const endInfo = document.createElement("p");
      endInfo.className = "text-xs text-gray-500";
      endInfo.textContent = `Ended ${new Date(auction.endsAt).toLocaleString()}`;
  
      content.append(title, winningBid, endInfo);
      wrapper.append(imageBox, content);
      container.appendChild(wrapper);
    });
  }

  export async function showYourOwnBids() {
    const container = document.getElementById("active-bids");
    container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
    container.innerHTML = "";
  
    try {
      const response = await yourOwnBids();
      const ownBids = Array.isArray(response?.data) ? response.data : [];
  
      if (ownBids.length === 0) {
        container.innerHTML = "<p>You have not placed any bids.</p>";
        return;
      }
  
      ownBids.forEach((bid) => {
        const wrapper = document.createElement("div");
        wrapper.className = "bg-white border border-gray-300 rounded shadow-lg w-full max-w-[280px] h-[420px] flex flex-col items-center p-4 cursor-pointer";
  
        const imageBox = document.createElement("div");
        imageBox.className = "w-full h-[250px] flex items-center justify-center bg-white p-2";
  
        const img = document.createElement("img");
        img.src = bid.listing?.media?.[0]?.url || "https://placehold.co/240x240?text=No+Image";
        img.alt = bid.listing?.title || "No title";
        img.className = "w-full h-full object-cover rounded";
        img.addEventListener("click", () => {
          window.location.href = `/listings/detail-listing.html?id=${bid.listing?.id}`;
        });
  
        imageBox.appendChild(img);
  
        const content = document.createElement("div");
        content.className = "flex flex-col justify-end items-center text-center px-2 pt-8 pb-4 mt-auto gap-1";
  
        const title = document.createElement("h3");
        title.className = "text-base font-bold";
        title.textContent = bid.listing?.title || "No title";
  
        const bidAmount = document.createElement("p");
        bidAmount.className = "text-sm text-blue-600";
        bidAmount.textContent = `Your bid: ${bid.amount}`;
  
        const endInfo = document.createElement("p");
        endInfo.className = "text-xs text-gray-500";
        endInfo.textContent = `Ends ${new Date(bid.listing?.endsAt).toLocaleString()}`;
  
        content.append(title, bidAmount, endInfo);
        wrapper.append(imageBox, content);
        container.appendChild(wrapper);
      });
    } catch (error) {
      console.error("Error fetching your bids:", error.message);
      container.innerHTML = "<p>There was an error loading your bids. Please try again later.</p>";
    }
  }