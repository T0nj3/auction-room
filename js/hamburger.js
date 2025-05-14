import { fetchCredits } from "./apiUtils.js";

const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");

hamburgerBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Marker aktiv side
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

  userLinks.innerHTML = "";
  mobileUserLinks.innerHTML = "";

  if (token && username) {
    try {
      const { credits } = await fetchCredits(username);

      // Desktop
      const creditSpan = document.createElement("span");
      creditSpan.textContent = `${credits} kr`;

      const profileLink = document.createElement("a");
      profileLink.href = "../profile/index.html";
      profileLink.className = "font-semibold hover:underline";
      profileLink.textContent = username;

      const logoutBtn = document.createElement("button");
      logoutBtn.id = "logout-btn";
      logoutBtn.className = "text-red-600 hover:underline";
      logoutBtn.textContent = "Sign Out";
      logoutBtn.addEventListener("click", handleLogout);

      userLinks.appendChild(creditSpan);
      userLinks.appendChild(profileLink);
      userLinks.appendChild(logoutBtn);

    
      const mobileCredit = document.createElement("span");
      mobileCredit.className = "border-b pb-2 uppercase";
      mobileCredit.textContent = `${credits} kr`;

      const mobileProfile = document.createElement("a");
      mobileProfile.href = "../profile/index.html";
      mobileProfile.className = "font-semibold font-inter text-[15px] border-b pb-2";
      mobileProfile.textContent = username;

      const mobileLogout = document.createElement("button");
      mobileLogout.id = "mobile-logout-btn";
      mobileLogout.className = "text-red-600 border-b pb-2";
      mobileLogout.textContent = "Sign Out";
      mobileLogout.addEventListener("click", handleLogout);

      mobileUserLinks.appendChild(mobileCredit);
      mobileUserLinks.appendChild(mobileProfile);
      mobileUserLinks.appendChild(mobileLogout);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  } else {
    
    const loginLink = document.createElement("a");
    loginLink.href = "../auth/login.html";
    loginLink.className = "hover:underline";
    loginLink.textContent = "LOGIN";

    const registerLink = document.createElement("a");
    registerLink.href = "../auth/register.html";
    registerLink.className = "hover:underline";
    registerLink.textContent = "REGISTER";

    userLinks.appendChild(loginLink);
    userLinks.appendChild(registerLink);

    
    const mobileLogin = document.createElement("a");
    mobileLogin.href = "../auth/login.html";
    mobileLogin.className = "hover:text-button-prime border-b pb-2";
    mobileLogin.textContent = "LOGIN";

    const mobileRegister = document.createElement("a");
    mobileRegister.href = "../auth/register.html";
    mobileRegister.className = "hover:text-button-prime border-b pb-2";
    mobileRegister.textContent = "REGISTER";

    mobileUserLinks.appendChild(mobileLogin);
    mobileUserLinks.appendChild(mobileRegister);
  }
}

function handleLogout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

renderUserUI();
export { renderUserUI };