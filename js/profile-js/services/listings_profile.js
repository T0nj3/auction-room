import { fetchListing, deleteUserPost, editPost } from "../apiprofile.js"; 

export async function showUserListings(username) {
    try {
      const result = await fetchListing(username);
      const listings = result?.data || [];
  
      const productsContainer = document.getElementById("productsContainer");
      productsContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";
      productsContainer.innerHTML = "";
  
      listings.forEach((product) => {
  
        const card = document.createElement("div");
card.className = "product bg-white shadow-lg flex flex-col h-[460px] overflow-hidden";
  

        const img = document.createElement("img");
        img.src = product.media?.[0]?.url || "https://placehold.co/400x300?text=No+Image";
        img.alt = product.title;
        img.className = "w-full h-[300px] object-cover p-3";
  
 
        const titleContainer = document.createElement("div");
        titleContainer.className = "flex-grow flex items-center justify-center";
  
        const title = document.createElement("p");
        title.textContent = product.title;
        title.className = "text-center font-serif";
  

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "flex justify-center gap-2 pb-4";
  
        const editButton = createEditButton(product);
        const deleteButton = createDeleteButton(product.id);
  

        titleContainer.appendChild(title);
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
  
        card.appendChild(img);
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
    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await deleteUserPost(postId);

                const productElement = deleteButton.closest(".product");
                if (productElement) {
                    productElement.remove();
                }
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

        hideEditForm();
        await reloadListings();
        
        window.location.reload(); 
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