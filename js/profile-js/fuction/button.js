
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
    const activeBtn = document.getElementById("active-auctions-btn");
    const wonBtn = document.getElementById("won-auctions-btn");
  
    if (section === "active") {
      activeSection.classList.remove("hidden");
      wonSection.classList.add("hidden");
  
      activeBtn.classList.add("bg-brown");
      wonBtn.classList.remove("bg-brown");
    } else if (section === "won") {
      wonSection.classList.remove("hidden");
      activeSection.classList.add("hidden");
  
      wonBtn.classList.add("bg-brown");
      activeBtn.classList.remove("bg-brown");
    }
  }

  function initAuctionsection() {
    const activeBtn = document.getElementById("active-auctions-btn");
    const wonBtn = document.getElementById("won-auctions-btn");
  
    setActivesection("active");
  
  
    activeBtn.addEventListener("click", () => setActivesection("active"));
    wonBtn.addEventListener("click", () => setActivesection("won"));
  }
  
  document.addEventListener("DOMContentLoaded", initAuctionsection);