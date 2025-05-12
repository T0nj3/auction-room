import { fetchListing, deleteUserPost, editPost, SeeWinningAuction, yourOwnBids} from "../apiprofile.js"; 

export async function showUserListings(username) {
    try {
      const result = await fetchListing(username);
      const listings = result?.data || [];

  
      const productsContainer = document.getElementById("productsContainer");
      productsContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
      productsContainer.innerHTML = "";
  
      listings.forEach((product) => {
        const card = document.createElement("div");
        card.className = "shadow-lg flex flex-col items-center aspect-[3/4] p-3";
  
        const imageWrapper = document.createElement("div");
        imageWrapper.className = "relative w-full h-2/3 overflow-hidden group";
  
        const img = document.createElement("img");
        img.src = product.media?.[0]?.url;
        img.alt = product.title;
        img.className = "w-full h-full object-cover transition duration-300 cursor-pointer hover:scale-105 group-hover:scale-105";

        img.addEventListener("click", () => {
            window.location.href = `/listings/detail-listing.html?id=${product.id}`;
          });
  
        const titleContainer = document.createElement("div");
        titleContainer.className = "flex-grow flex items-center justify-center";
  
        const title = document.createElement("p");
        title.textContent = product.title;
        title.className = "text-center font-body text-xl font-regular";
  
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex justify-center gap-1 pb-4";
  
        const editButton = createEditButton(product);
        const deleteButton = createDeleteButton(product.id);

        imageWrapper.appendChild(img);
  
        titleContainer.appendChild(title);
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
  
        card.appendChild(imageWrapper);
        card.appendChild(titleContainer);
        card.appendChild(buttonContainer);
  
        productsContainer.appendChild(card);
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
    container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer hover:bg-gray-100 transition duration-300"; 
    container.innerHTML = "";

    const response = await SeeWinningAuction();
    const winningAuctions = response?.data || [];

    if (winningAuctions.length === 0) {
        container.innerHTML = "<p>You have not won any auctions.</p>";
        return;
    }

    winningAuctions.forEach((auction) => {
        const card = document.createElement("div");
        card.className = "shadow-lg flex flex-col items-center aspect-[3/4] p-3";

        const image = document.createElement("img");
        image.src = auction.media?.[0]?.url || "https://placehold.co/400x300?text=No+Image";
        image.alt = auction.title;
        image.className = "w-full h-2/3 object-cover"

        const title = document.createElement("p");
        title.textContent = auction.title;
        title.className = "text-center font-body text-xl font-regular";

        const endInfo = document.createElement("p");
        endInfo.textContent = `Ended ${new Date(auction.endsAt).toLocaleString()}`;
        endInfo.className = "text-sm text-gray-600";

        const winningBid = document.createElement("p");
        winningBid.textContent = "Winning bid";
        winningBid.className = "text-sm text-green-600";

        const infoContainer = document.createElement("div");
        infoContainer.className = "flex-grow flex flex-col justify-center items-center space-y-1";
        infoContainer.appendChild(title);
        infoContainer.appendChild(winningBid);
        infoContainer.appendChild(endInfo);

        card.appendChild(image);
        card.appendChild(infoContainer);
        container.appendChild(card);
    });
}

export async function showYourOwnBids() {
    const container = document.getElementById("active-bids");
    container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"; 
    container.innerHTML = "";

    try {
        const response = await yourOwnBids();

        console.log("Full Response:", response); 

        const ownBids = Array.isArray(response?.data) ? response.data : [];

        if (ownBids.length === 0) {
            container.innerHTML = "<p>You have not placed any bids.</p>";
            return;
        }

        ownBids.forEach((bid) => {
            console.log("Bid data:", bid); 

            const card = document.createElement("div");
            card.className = "shadow-lg flex flex-col items-center aspect-[3/4] p-3 cursor-pointer hover:bg-gray-100 transition duration-300";

            const image = document.createElement("img");
            image.src = bid.listing?.media?.[0]?.url || "https://placehold.co/400x300?text=No+Image";
            image.alt = bid.listing?.title || "No title";
            image.className = "w-full h-2/3 object-cover";

            image.addEventListener("click", () => {
                window.location.href = `/listings/detail-listing.html?id=${bid.listing?.id}`;
            }
            );

            const title = document.createElement("p");
            title.textContent = bid.listing?.title || "No title";
            title.className = "text-center font-body text-xl font-regular";

            const endInfo = document.createElement("p");
            endInfo.textContent = `Ends ${new Date(bid.listing?.endsAt).toLocaleString()}`;
            endInfo.className = "text-sm text-gray-600";

            const bidAmount = document.createElement("p");
            bidAmount.textContent = `Bid: ${bid.amount}`;
            bidAmount.className = "text-sm text-blue-600";

            const infoContainer = document.createElement("div");
            infoContainer.className = "flex-grow flex flex-col justify-center items-center space-y-1";
            infoContainer.appendChild(title);
            infoContainer.appendChild(bidAmount);
            infoContainer.appendChild(endInfo);

            card.appendChild(image);
            card.appendChild(infoContainer);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching your bids:", error.message);
        container.innerHTML = "<p>There was an error loading your bids. Please try again later.</p>";
    }
}