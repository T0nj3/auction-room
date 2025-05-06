import { getUserProfile } from "../apiprofile.js";
import { updateUserProfile } from "../apiprofile.js";
import {createPost} from "../apiprofile.js";
import {showUserListings} from "./listings_profile.js";
import{SeeWinningAuction} from "../apiprofile.js";


const token = localStorage.getItem("token");

function accessProfile() {
    if (token === null) {
        alert("You need to log in to access this page.");
        window.location.href = "../index.html";
    }
}

async function loadUserProfile() {
    try {
        const profile = await getUserProfile();
        if (profile) {
            console.log("Brukerprofil:", profile);
            localStorage.setItem("user", JSON.stringify(profile)); 
            displayUserImages(profile);
            displayName(profile);
            displayBio(profile);
        } else {
            console.log("coud not get your profile.");
        }
    } catch (error) {
        console.error("fail with loading your profile:", error);
    }
}

function displayUserImages(profile) {
    const avatarImg = document.getElementById("avatar");
    const bannerImg = document.getElementById("banner");

    if (profile.avatar && profile.avatar.url) {
        avatarImg.src = profile.avatar.url;
        avatarImg.alt = profile.avatar.alt || "User avatar";

        avatarImg.style.width = "8rem";
        avatarImg.style.height = "8rem";

        if (window.innerWidth >= 640) {
            avatarImg.style.width = "10rem";
            avatarImg.style.height = "10rem";
        }
    }

    if (profile.banner && profile.banner.url) {
        bannerImg.src = profile.banner.url;
        bannerImg.alt = profile.banner.alt || "User banner";
    }
}

function displayName(profile) {
    const nameElement = document.getElementById("name");
    const name = profile.name || "No name found";
    nameElement.textContent = name;
}

function displayBio(profile) {
    const bioElement = document.getElementById("bio");
    const bio = profile.bio || "No bio found";
    bioElement.textContent = bio;
}

function getuser() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.name) {
        console.error("user name not fount in localstorage!");
        return null;
    }
    return user;
}

function collectProfileUpdateData() {
    const avatar = document.getElementById("avatar-edit").value.trim();
    const banner = document.getElementById("banner-edit").value.trim();
    const bio = document.getElementById("bio-input").value.trim();

    return { avatar, banner, bio };
}

async function handleProfileUpdate(event) {
    event.preventDefault();

    const user = getuser();
    if (user === null) return;

    const { avatar, banner, bio } = collectProfileUpdateData();

    const response = await updateUserProfile(user.name, bio, avatar, banner);

    if (response ) {
        updateLocalStorageUser(response);
        updateProfileDisplay(response);
        window.location.reload();
    } else {
        console.error("could not update profile");
    }
}

function updateLocalStorageUser(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
}

function updateProfileDisplay(profile) {
    displayUserImages(profile);
    displayName(profile);
    displayBio(profile);
}

function initializeProfilePage() {
    const form = document.getElementById("profile-form");
    if (form) {
        form.addEventListener("submit", handleProfileUpdate);
    }

    accessProfile();
    loadUserProfile();
}

initializeProfilePage();

function getFormData() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const imageUrl = document.getElementById("image").value;
    const endsAt = document.getElementById("due-date").value;

    return { title, description, imageUrl, endsAt,};
}

function validateInput({ title, description, imageUrl, endsAt }) {
    if (title === "" || description === "" || imageUrl === ""|| endsAt === "") {
        alert("Tittel, Description image and due date are required.");
        return false;
    }
    return true;
}

async function createAuction(title, description, imageUrl, endsAt,) {
    const result = await createPost(title, description, imageUrl, endsAt,);

    if (result) {
        alert("Auction created successfully!");
        console.log(result);  
        window.location.reload();
    } else {
        alert("something went wrong.");
    }
}
document.getElementById("create-auction-btn").addEventListener("click", async function (e) {
    e.preventDefault();

    const formData = getFormData();

    if (validateInput(formData) === false) return;

    await createAuction(formData.title, formData.description, formData.imageUrl, formData.endsAt);
});

async function loadUserListings() {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user && user.name) {
      await showUserListings(user.name); // Vent på at listen skal lastes
    }
  }
  loadUserListings();

  async function displayWinningAuctions() {
    const container = document.getElementById("winning_bid");
    container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"; 
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


displayWinningAuctions();