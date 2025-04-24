import { getUserProfile } from "../apiprofile.js";

const token = localStorage.getItem("token");

function accessProfile() {
    if (token === null) {
        window.location.href = "../index.html";
    } else {
        // Eksempel på hvordan du kan bruke getUserProfile
        const username = "andreas_l"; // For eksempel, brukernavnet du ønsker å hente profilen for
        getUserProfile(username)
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
}

console.log("Token:", token);
accessProfile();