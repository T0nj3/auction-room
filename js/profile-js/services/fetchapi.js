import { getUserProfile } from "../apiprofile.js";
import { updateUserProfile } from "../apiprofile.js";

const token = localStorage.getItem("token");

function accessProfile() {
    if (token === null) {
        alert("Du må være innlogget for å få tilgang til profilen din.");
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
            console.log("Kunne ikke hente brukerprofil.");
        }
    } catch (error) {
        console.error("Feil ved henting av brukerprofil:", error);
    }
}

// Vis avatar og banner
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

// Vis brukernavn
function displayName(profile) {
    const nameElement = document.getElementById("name");
    const name = profile.name || "Ingen navn tilgjengelig";
    nameElement.textContent = name;
}

function displayBio(profile) {
    const bioElement = document.getElementById("bio");
    const bio = profile.bio || "Ingen bio tilgjengelig";
    bioElement.textContent = bio;
}

function getuser() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.name) {
        console.error("Brukernavn ikke funnet i localStorage!");
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