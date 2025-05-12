import { getUserProfile } from "../apiprofile.js";
import { updateUserProfile } from "../apiprofile.js";
import { createPost } from "../apiprofile.js";
import {
  showUserListings,
  displayWinningAuctions,
  showYourOwnBids,
} from "./listings_profile.js";

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

function getFormData() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const imageUrl = document.getElementById("image").value;
  const endsAt = document.getElementById("due-date").value;

  return { title, description, imageUrl, endsAt };
}

function validateInput({ title, description, imageUrl, endsAt }) {
  if (title === "" || description === "" || imageUrl === "" || endsAt === "") {
    alert("Tittel, Description image and due date are required.");
    return false;
  }
  return true;
}

async function createAuction(title, description, imageUrl, endsAt) {
  const result = await createPost(title, description, imageUrl, endsAt);

  if (result) {
    const successMessage = document.getElementById("create-auction-success");
    successMessage.classList.remove("hidden");

    console.log(result);

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

    if (validateInput(formData) === false) return;

    await createAuction(
      formData.title,
      formData.description,
      formData.imageUrl,
      formData.endsAt,
    );
  });

async function loadUserListings() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name) {
    await showUserListings(user.name);
  }
}

displayWinningAuctions();
showYourOwnBids();