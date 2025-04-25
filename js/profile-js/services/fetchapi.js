import { getUserProfile } from "../apiprofile.js";

const token = localStorage.getItem("token");
function accessProfile() {
    if (token === null) {
        alert("Du må være innlogget for å få tilgang til profilen din."); //denne linjen er lagt til for å gi tilbakemelding til brukeren. vi bytter den ut med en annen når vi har laget en feilmelding.
        window.location.href = "../index.html";
    }
}

function loadUserProfile() {
    getUserProfile()
        .then(response => {
            if (response) {
                console.log("Brukerprofil:", response);
            } else {
                console.log("Kunne ikke hente brukerprofil.");
            }
        })
        .catch(error => {
            console.error("Feil ved henting av brukerprofil:", error);
        });
}

loadUserProfile();
accessProfile();

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

getUserProfile().then(profile => {
    if (profile) {
        displayUserImages(profile);
    }
});

function displayName(profile) {
    const nameElement = document.getElementById("name");
    const name = profile.name || "Ingen navn tilgjengelig";
    nameElement.textContent = name;
}
getUserProfile().then(profile => {
    if (profile) {
        displayName(profile);
    }
});
function displayBio(profile) {
    const bioElement = document.getElementById("bio");
    const bio = profile.bio || "Ingen bio tilgjengelig";
    bioElement.textContent = bio;
}
getUserProfile().then(profile => {
    if (profile) {
        displayBio(profile);
    }
});