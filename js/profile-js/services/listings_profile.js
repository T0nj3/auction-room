import { fetchListing } from "../apiprofile.js"; 

export async function showUserListings(username) {
    try {
      const result = await fetchListing(username);
      const listings = result?.data || result; 
  
      const productsContainer = document.getElementById("productsContainer");
      productsContainer.innerHTML = ""; 
  
      if (!listings || listings.length === 0) {
        const noProductsMessage = document.createElement("p");
        noProductsMessage.textContent = "Ingen produkter funnet for denne brukeren.";
        productsContainer.appendChild(noProductsMessage);  
        return;
      }
  
      listings.forEach((product) => {
        console.log("Produktdata:", product); 
  
        const productElement = document.createElement("div");
        productElement.className = "product";  
  
        const productImage = document.createElement("img");
        if (product.media && product.media.length > 0 && product.media[0].url) {
          productImage.src = product.media[0].url; 
          productImage.alt = product.title; 
          productImage.className = "product-image";  
        } 
    
        const productTitle = document.createElement("h3");
        productTitle.textContent = product.title;  
        productTitle.className = "product-title";  
  
  
        productElement.appendChild(productImage);
        productElement.appendChild(productTitle);

  
        productsContainer.appendChild(productElement);
      });
    } catch (error) {
      console.error("Feil ved henting av brukerens produkter:", error.message);
    }
  }