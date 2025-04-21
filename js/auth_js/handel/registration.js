import { registerUser } from '../apiauth.js';

const emailInputField = document.querySelector("#email");
const usernameInputField = document.querySelector("#username");
const passwordInputField = document.querySelector("#password");
const confirmPasswordInputField = document.querySelector("#password-confirm");
const registerButton = document.querySelector("#register-button");

function getRegisterData() {
  const email = emailInputField.value.trim();
  const username = usernameInputField.value.trim();
  const password = passwordInputField.value;
  const confirmPassword = confirmPasswordInputField.value;
  return { email, username, password, confirmPassword };
}

function validateForm() {
  const { email, username, password, confirmPassword } = getRegisterData();

  if (!email || !username || !password || !confirmPassword) {
    alert("Vennligst fyll inn alle felt.");
    return false;
  }

  if (!email.endsWith("@stud.noroff.no") && !email.endsWith("@noroff.no")) {
    alert("E-post må være en Noroff-adresse.");
    return false;
  }

  if (password.length < 8) {
    alert("Passord må være minst 8 tegn.");
    return false;
  }

  if (password !== confirmPassword) {
    alert("Passordene samsvarer ikke.");
    return false;
  }

  return true;
}

function clickRegisterButton() {
    registerButton.addEventListener("click", async (event) => {
      event.preventDefault();
  
      if (validateForm()) {
        const { email, username, password } = getRegisterData(); 
  
        try {
          const result = await registerUser({ email, name: username, password });
          console.log("Resultat fra registerUser:", result);

          if (result.data) {
            alert("Registrering vellykket! Vennligst logg inn.");
            window.location.href = "./login.html"; 
          } else {
            alert("Registrering feilet.");
          }
        } catch (error) {
          console.error("Registrering feilet:", error);
          alert("Registrering feilet: " + error.message);
        }
      }
    });
  }
//   
  

document.addEventListener("DOMContentLoaded", () => {
  clickRegisterButton();
});

// denne skal bort etter at vi har fått til å logget inn og ut
function forgetToken( ) {
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.removeItem("token");
  }
}
forgetToken();