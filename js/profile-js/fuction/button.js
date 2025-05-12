
function edtitProfile() {
  const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileForm = document.getElementById('edit-profile-form'); 

    if (editProfileBtn) {

      editProfileBtn.addEventListener('click', () => {

        editProfileForm.classList.toggle('hidden');
      });
    }
  }
  document.addEventListener('DOMContentLoaded', edtitProfile);

  function initEditProfile() {
    const createPost = document.getElementById('toggle-create-btn');
    const creatForm = document.getElementById('create-auction-form');
    
    if (createPost) {

      createPost.addEventListener('click', () => {

        creatForm.classList.toggle('hidden');
      });
    } 
  }
  document.addEventListener('DOMContentLoaded', initEditProfile);

  function setActivesection(section) {
    const activeSection = document.getElementById("active-auctions");
    const wonSection = document.getElementById("won-auctions");
    const bidsSection = document.getElementById("active-bids-section");
  
    const activeBtn = document.getElementById("active-auctions-btn");
    const wonBtn = document.getElementById("won-auctions-btn");
    const bidsBtn = document.getElementById("active-bids-btn");
  

    activeSection.classList.add("hidden");
    wonSection.classList.add("hidden");
    bidsSection.classList.add("hidden");
  
   
    activeBtn.classList.remove("bg-brown");
    wonBtn.classList.remove("bg-brown");
    bidsBtn.classList.remove("bg-brown");
  

    if (section === "active") {
      activeSection.classList.remove("hidden");
      activeBtn.classList.add("bg-brown");
    } else if (section === "won") {
      wonSection.classList.remove("hidden");
      wonBtn.classList.add("bg-brown");
    } else if (section === "bids") {
      bidsSection.classList.remove("hidden");
      bidsBtn.classList.add("bg-brown");
    }
  }

  function initAuctionsection() {
    const activeBtn = document.getElementById("active-auctions-btn");
    const wonBtn = document.getElementById("won-auctions-btn");
    const bidsBtn = document.getElementById("active-bids-btn");
  
    setActivesection("active");
  
    activeBtn.addEventListener("click", () => setActivesection("active"));
    wonBtn.addEventListener("click", () => setActivesection("won"));
    bidsBtn.addEventListener("click", () => setActivesection("bids"));
  }
  
  document.addEventListener("DOMContentLoaded", initAuctionsection);


 function closeFormButton() {
    const closeButton = document.getElementById("close-edit-form-btn");
    const formSection = document.getElementById("edit-form");
    const productsContainer = document.getElementById("productsContainer");

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            formSection.style.display = "none";
            productsContainer.style.display = "grid";
        });
    }
}

closeFormButton()