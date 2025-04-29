import { fetchCredits } from "./apiUtils.js";

const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");

hamburgerBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Markerer aktiv side
const links = document.querySelectorAll("a[href]");
let currentPage = location.pathname.split("/").pop();
if (currentPage === "") currentPage = "index.html";

links.forEach(link => {
  let href = link.getAttribute("href").split("/").pop();
  href = href.replace(/^\.\/|^\.\.\//, ""); // fjerner ./ og ../ fra starten

  if (href === currentPage) {
    link.classList.add("text-lightblue", "hover:text-black");
  } else {
    link.classList.remove("text-lightblue", "hover:text-black");
  }
});


const userLinks = document.getElementById("user-links");
const mobileUserLinks = document.getElementById("mobile-user-links");

async function renderUserUI() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (token && username) {
    try {
      const { credits } = await fetchCredits(username);

      userLinks.innerHTML = `
        <a href="../profile/index.html" class="font-semibold hover:underline">${username}</a>
        <span>${credits} kr</span>
        <button id="logout-btn" class="text-red-600 hover:underline">Log out</button>
      `;

      mobileUserLinks.innerHTML = `
        <a href="../profile/index.html" class="font-semibold border-b pb-2">${username}</a>
        <span class="border-b pb-2">${credits} kr</span>
        <button id="mobile-logout-btn" class="text-red-600 border-b pb-2">Log out</button>
      `;

      document.getElementById("logout-btn").addEventListener("click", handleLogout);
      document.getElementById("mobile-logout-btn").addEventListener("click", handleLogout);
    } catch (error) {
      console.error("Feil ved henting av credits:", error);
    }
  } else {
    userLinks.innerHTML = `
      <a href="../auth/login.html" class="hover:underline">Login</a>
      <a href="../profile/index.html" class="hover:underline">Credits</a>
    `;

    mobileUserLinks.innerHTML = `
      <a href="../auth/login.html" class="hover:text-button-prime border-b pb-2">Login</a>
      <a href="../profile/index.html" class="hover:text-button-prime border-b pb-2">Credits</a>
    `;
  }
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

renderUserUI();