import { fetchListing, deleteUserPost, editPost, SeeWinningAuction, yourOwnBids} from "../apiprofile.js"; 

export async function showUserListings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name;

  if (!username) {
    console.error("Username not found in localStorage.");
    return;
  }

  try {
    const result = await fetchListing(username);
    const listings = result?.data || [];

    const productsContainer = document.getElementById("productsContainer");
    productsContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
    productsContainer.innerHTML = "";

    listings.forEach((product) => {
      const wrapper = document.createElement("div");
      wrapper.className = "bg-white border border-gray-300 rounded shadow-lg w-full h-[420px] flex flex-col p-4 cursor-pointer";

      const imageBox = document.createElement("div");
      imageBox.className = "w-full h-[250px] flex items-center justify-center bg-white p-2";

      const img = document.createElement("img");
      img.src = product.media?.[0]?.url || "https://placehold.co/240x240?text=No+Image";
      img.alt = product.title;
      img.className = "w-full h-full object-cover rounded";
      img.addEventListener("click", () => {
        window.location.href = `/listings/detail-listing.html?id=${product.id}`;
      });

      imageBox.appendChild(img);

      const content = document.createElement("div");
      content.className = "flex flex-col justify-end items-center text-center px-2 pt-6 pb-4 mt-auto gap-1";

      const title = document.createElement("h3");
      title.className = "text-base font-bold";
      title.textContent = product.title;

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "flex gap-2 mt-2";

      const editButton = createEditButton(product);
      const deleteButton = createDeleteButton(product.id);

      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);

      content.append(title, buttonContainer);
      wrapper.append(imageBox, content);
      productsContainer.appendChild(wrapper);
    });
  } catch (error) {
    console.error("Error fetching user products:", error.message);
  }
}
  

function createDeleteButton(postId) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.color = "red";
  deleteButton.className = "px-4 py-2 rounded hover:bg-brown-300";

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
    editButton.className = "text-black px-4 py-2 rounded hover:bg-brown-300";

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
      }, 1000);
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

  winningAuctions.forEach((auction) => {
    const wrapper = document.createElement("div");
    wrapper.className =
      "bg-white border border-gray-300 rounded shadow-lg w-full h-[420px] flex flex-col p-4 cursor-pointer";

    wrapper.addEventListener("click", () => {
      window.location.href = `/listings/detail-listing.html?id=${auction.id}`;
    });

    const imageBox = document.createElement("div");
    imageBox.className =
      "w-full h-[250px] flex items-center justify-center bg-white p-2";

    const img = document.createElement("img");
    img.src = auction.media?.[0]?.url || "https://placehold.co/240x240?text=No+Image";
    img.alt = auction.title;
    img.className = "w-full h-full object-cover rounded";

    imageBox.appendChild(img);

    const content = document.createElement("div");
    content.className =
      "flex flex-col justify-end items-center text-center px-2 pt-6 pb-4 mt-auto gap-1";

    const title = document.createElement("h3");
    title.className = "text-base font-bold";
    title.textContent = auction.title;

    const status = document.createElement("p");
    status.className = "text-sm text-green-600";
    status.textContent = "Won Auction!";

    const endDate = document.createElement("p");
    endDate.className = "text-xs text-gray-500";
    endDate.textContent = `Ended ${new Date(auction.endsAt).toLocaleDateString()}`;

    content.append(title, status, endDate);
    wrapper.append(imageBox, content);
    container.appendChild(wrapper);
  });
}

export async function showYourOwnBids() {
  const container = document.getElementById("active-bids");
  container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
  container.innerText = "";

  try {
    const response = await yourOwnBids();
    const ownBids = Array.isArray(response?.data) ? response.data : [];

    if (ownBids.length === 0) {
      container.innerHTML = "<p>You have not placed any bids.</p>";
      return;
    }

    ownBids.forEach((bid) => {
      const card = document.createElement("div");
      card.className = "bg-white border border-gray-300 rounded shadow-lg w-full h-[420px] flex flex-col p-4 cursor-pointer";
      card.addEventListener("click", () => {
        window.location.href = `/listings/detail-listing.html?id=${bid.listing?.id}`;
      });

      const imageWrapper = document.createElement("div");
      imageWrapper.className = "relative w-full h-2/3 overflow-hidden group border";

      const img = document.createElement("img");
      img.src = bid.listing?.media?.[0]?.url || "https://placehold.co/400x300?text=No+Image";
      img.alt = bid.listing?.title || "No title";
      img.className = "w-full h-full object-cover transition duration-300 cursor-pointer";

      imageWrapper.appendChild(img);

      const infoContainer = document.createElement("div");
      infoContainer.className = "flex-grow flex flex-col items-center justify-center text-center gap-1";

      const title = document.createElement("p");
      title.textContent = bid.listing?.title || "No title";
      title.className = "text-center font-body text-xl font-regular";

      const bidAmount = document.createElement("p");
      bidAmount.className = "text-sm text-blue-600";
      bidAmount.textContent = `Your bid: ${bid.amount}`;


      const endsAt = new Date(bid.listing?.endsAt);
      const timeDiff = endsAt - new Date(); 
      const daysLeft = parseInt(timeDiff / (1000 * 60 * 60 * 24)); 
      const hoursLeft = parseInt((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 

      const endInfo = document.createElement("p");
      endInfo.className = "text-sm text-body";
      endInfo.textContent = `Ends in: ${daysLeft} days and ${hoursLeft} hours`;

      infoContainer.append(title, bidAmount, endInfo);

      card.append(imageWrapper, infoContainer);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching your bids:", error.message);
    container.innerHTML = "<p>There was an error loading your bids. Please try again later.</p>";
  }
}