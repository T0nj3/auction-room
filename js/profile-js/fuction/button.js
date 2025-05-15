function edtitProfile() {
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const editProfileForm = document.getElementById("edit-profile-form");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      editProfileForm.classList.toggle("hidden");
    });
  }
}
document.addEventListener("DOMContentLoaded", edtitProfile);

function initEditProfile() {
  const createPost = document.getElementById("toggle-create-btn");
  const creatForm = document.getElementById("create-auction-form");

  if (createPost) {
    createPost.addEventListener("click", () => {
      creatForm.classList.toggle("hidden");
    });
  }
}
document.addEventListener("DOMContentLoaded", initEditProfile);

function setActivesection(section) {
  const sections = {
    active: document.getElementById("active-auctions"),
    won: document.getElementById("won-auctions"),
    bids: document.getElementById("active-bids-section"),
  };

  const buttons = {
    active: document.getElementById("active-auctions-btn"),
    won: document.getElementById("won-auctions-btn"),
    bids: document.getElementById("active-bids-btn"),
  };

  Object.values(sections).forEach((el) => el.classList.add("hidden"));
  Object.values(buttons).forEach((btn) => {
    btn.classList.remove("bg-button-prime", "text-white");
    btn.classList.add("bg-brown", "text-white");
  });

  sections[section].classList.remove("hidden");
  buttons[section].classList.remove("bg-brown");
  buttons[section].classList.add("bg-button-prime");
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

closeFormButton();
