import { registerUser } from "../apiauth.js";
import { validateForm } from "../error/errorAuth.js";

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

function clickRegisterButton() {
  registerButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const registerData = getRegisterData();

    if (validateForm(registerData)) {
      const { email, username, password } = registerData;

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

function forgetToken() {
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.removeItem("token");
  }
}

forgetToken();
clickRegisterButton();
