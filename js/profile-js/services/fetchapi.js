import { getUserProfile } from "../apiprofile.js";
import { updateUserProfile } from "../apiprofile.js";
import { createPost } from "../apiprofile.js";
import {
  showUserListings,
  displayWinningAuctions,
  showYourOwnBids,
} from "./listings_profile.js";

const token = localStorage.getItem("token");

/**
 * Redirects to home page if user is not authenticated.
 */
function accessProfile() {
  if (token === null) {
    alert("You need to log in to access this page.");
    window.location.href = "../index.html";
  }
}

/**
 * Loads user profile and updates DOM and localStorage.
 */
async function loadUserProfile() {
  try {
    const profile = await getUserProfile();
    if (profile) {
      localStorage.setItem("user", JSON.stringify(profile));
      displayUserImages(profile);
      displayName(profile);
      displayBio(profile);
    } else {
      console.log("Could not retrieve profile.");
    }
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
}

/**
 * Displays avatar and banner image in the DOM.
 * @param {Object} profile - User profile object.
 */
function displayUserImages(profile) {
  const avatarImg = document.getElementById("avatar");
  const bannerImg = document.getElementById("banner");

  if (profile.avatar?.url) {
    avatarImg.src = profile.avatar.url;
    avatarImg.alt = profile.avatar.alt || "User avatar";
  }

  if (profile.banner?.url) {
    bannerImg.src = profile.banner.url;
    bannerImg.alt = profile.banner.alt || "User banner";
  }
}

/**
 * Displays the user’s name in the DOM.
 * @param {Object} profile - User profile object.
 */
function displayName(profile) {
  const nameElement = document.getElementById("name");
  nameElement.textContent = profile.name || "No name found";
}

/**
 * Displays the user’s bio in the DOM.
 * @param {Object} profile - User profile object.
 */
function displayBio(profile) {
  const bioElement = document.getElementById("bio");
  bioElement.textContent = profile.bio || "No bio found";
}

/**
 * Retrieves the user object from localStorage.
 * @returns {Object|null} The user object or null if not found.
 */
function getuser() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.name) {
    console.error("Username not found in localStorage!");
    return null;
  }
  return user;
}

/**
 * Collects form values for profile update.
 * @returns {Object} Collected avatar, banner and bio.
 */
function collectProfileUpdateData() {
  return {
    avatar: document.getElementById("avatar-edit").value.trim(),
    banner: document.getElementById("banner-edit").value.trim(),
    bio: document.getElementById("bio-input").value.trim(),
  };
}

/**
 * Handles the profile update form submission.
 * @param {Event} event - Form submit event.
 */
async function handleProfileUpdate(event) {
  event.preventDefault();

  const user = getuser();
  if (!user) return;

  const { avatar, banner, bio } = collectProfileUpdateData();
  const response = await updateUserProfile(user.name, bio, avatar, banner);

  if (response) {
    updateLocalStorageUser(response);
    updateProfileDisplay(response);

    const successMsg = document.getElementById("edit-profile-success");
    if (successMsg) {
      successMsg.classList.remove("hidden");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } else {
    console.error("Profile update failed.");
  }
}

/**
 * Updates the localStorage with the new profile.
 * @param {Object} userData - The updated user data.
 */
function updateLocalStorageUser(userData) {
  localStorage.setItem("user", JSON.stringify(userData));
}

/**
 * Renders updated profile info in the DOM.
 * @param {Object} profile - Updated profile data.
 */
function updateProfileDisplay(profile) {
  displayUserImages(profile);
  displayName(profile);
  displayBio(profile);
}

/**
 * Initializes the profile page with data and listeners.
 */
async function initializeProfilePage() {
  const form = document.getElementById("profile-form");
  if (form) {
    form.addEventListener("submit", handleProfileUpdate);
  }

  accessProfile();
  await loadUserProfile();
  await loadUserListings();
}

initializeProfilePage();

/**
 * Collects form data for auction creation.
 * @returns {Object} Auction data.
 */
function getFormData() {
  return {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    imageUrl: document.getElementById("image").value,
    endsAt: document.getElementById("due-date").value,
  };
}

/**
 * Validates auction form input.
 * @param {Object} formData - Auction form input.
 * @returns {boolean} Whether form is valid.
 */
function validateInput({ title, description, imageUrl, endsAt }) {
  if (!title || !description || !imageUrl || !endsAt) {
    alert("Title, description, image and due date are required.");
    return false;
  }
  return true;
}

/**
 * Sends data to API to create new auction.
 * @param {string} title 
 * @param {string} description 
 * @param {string} imageUrl 
 * @param {string} endsAt 
 */
async function createAuction(title, description, imageUrl, endsAt) {
  const result = await createPost(title, description, imageUrl, endsAt);

  if (result) {
    const successMessage = document.getElementById("create-auction-success");
    successMessage.classList.remove("hidden");

    setTimeout(() => {
      successMessage.classList.add("hidden");
      window.location.reload();
    }, 1000);
  } else {
    alert("Something went wrong.");
  }
}

document
  .getElementById("create-auction-btn")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const formData = getFormData();
    if (!validateInput(formData)) return;

    await createAuction(
      formData.title,
      formData.description,
      formData.imageUrl,
      formData.endsAt,
    );
  });

/**
 * Loads user listings and renders them to the profile.
 */
async function loadUserListings() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.name) {
    await showUserListings(user.name);
  }
}

displayWinningAuctions();
showYourOwnBids();