import { fetchCredits } from "./apiUtils.js";

const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");

hamburgerBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
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
      const currentPath = window.location.pathname;

      const creditSpan = document.createElement("span");
      creditSpan.innerHTML = `
        <span class="flex items-center gap-1 text-accent font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-5 h-5 text-yellow-500">
        // <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/>
        // <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">$</text>
        // </svg>
          ${credits} Credits
        </span>
      `;

      const profileLink = document.createElement("a");
      profileLink.href = "../profile/index.html";
      profileLink.textContent = username;

      profileLink.className = "font-semibold hover:underline";
      if (currentPath.endsWith("/profile/index.html")) {
        profileLink.classList.add("text-button-prime");
      }

      const logoutBtn = document.createElement("button");
      logoutBtn.id = "logout-btn";
      logoutBtn.className = "text-red-600 hover:underline";
      logoutBtn.textContent = "Sign Out";
      logoutBtn.addEventListener("click", handleLogout);

      userLinks.appendChild(creditSpan);
      userLinks.appendChild(profileLink);
      userLinks.appendChild(logoutBtn);

      // Mobile
      const mobileCredit = document.createElement("span");
      mobileCredit.className = "border-b pb-2 uppercase";
      mobileCredit.textContent = `${credits} Credits`;

      const mobileProfile = document.createElement("a");
      mobileProfile.href = "../profile/index.html";
      mobileProfile.textContent = username;

      mobileProfile.className =
        "font-semibold font-inter text-[15px] border-b pb-2";
      if (currentPath.endsWith("/profile/index.html")) {
        mobileProfile.classList.add("text-button-prime");
      }

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
