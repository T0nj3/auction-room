import { fetchListing, deleteUserPost, editPost } from "../apiprofile.js"; 

export async function showUserListings(username) {
    try {
        const result = await fetchListing(username);
        const listings = result?.data || []; // Sørg for at listings alltid er en liste

        const productsContainer = document.getElementById("productsContainer");
        productsContainer.innerHTML = "";

        listings.forEach((product) => {
            const productElement = document.createElement("div");
            productElement.className = "product";

            const productImage = document.createElement("img");
            productImage.src = product.media[0]?.url;
            productImage.alt = product.title;
            productImage.className = "product-image";

            const productTitle = document.createElement("h3");
            productTitle.textContent = product.title;
            productTitle.className = "product-title";

            const deleteButton = createDeleteButton(product.id);
            const editButton = createEditButton(product);

            productElement.appendChild(productImage);
            productElement.appendChild(productTitle);
            productElement.appendChild(deleteButton);
            productElement.appendChild(editButton);

            productsContainer.appendChild(productElement);
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
    editButton.className = "edit-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2";

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


document.getElementById("edit-auction-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("edit-form");
    const postId = form.dataset.postId;

    const newTitle = document.getElementById("auction-title-edit").value;
    const newDescription = document.getElementById("auction-description-edit").value;
    const newImageUrl = document.getElementById("image-edit").value;

    if (newTitle === "" || newDescription === "" || newImageUrl === "") {
        alert("All fields are required.");
        return;
    }

    try {

        await editPost(postId, newTitle, newDescription, newImageUrl);
        
        form.style.display = "none";  
        document.getElementById("productsContainer").style.display = "block"; 


        showUserListings();
        window.location.reload()
    } catch (error) {
        console.error("Error updating post:", error.message);
        alert("Failed to update the post.");
    }
});