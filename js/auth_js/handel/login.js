import { loginUser } from "../apiauth.js";
import { validateLoginForm } from "../error/errorAuth.js";

const emailInputField = document.querySelector("#email");
const passwordInputField = document.querySelector("#password");
const loginButton = document.querySelector("#login-button");

function getLoginData() {
  const email = emailInputField.value.trim();
  const password = passwordInputField.value.trim();
  return { email, password };
}

function ShowError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.innerText = message;
  errorMessage.style.display = "block";
  setTimeout(() => (errorMessage.style.display = "none"), 2000);
}

function clickLoginButton() {
  loginButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const userData = getLoginData();

    if (validateLoginForm(userData)) {
      try {
        const result = await loginUser(userData);

        if (result.data?.accessToken) {
          localStorage.setItem("token", result.data.accessToken);
          window.location.href = "../index.html";
        } else {
          ShowError("No access token received.");
        }
      } catch (error) {
        console.error("Feil under innlogging:", error.message);
        ShowError(error.message);
      }
    }
  });
}

clickLoginButton();
