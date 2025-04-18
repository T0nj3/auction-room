import { loginUser } from '../apiauth.js';

const emailInputField = document.querySelector("#email");
const passwordInputField = document.querySelector("#password");
const loginButton = document.querySelector("#login-button");

function getLoginData() {
  const email = emailInputField.value;
  const password = passwordInputField.value;
  return { email, password };
}

function validateForm() {
  const { email, password } = getLoginData();
  if (email === "" || password === "") {
    alert("Please fill in all fields");
    return false;
  } else if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return false;
  }
  return true;
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

    if (validateForm()) {
      const userData = getLoginData();
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

document.addEventListener("DOMContentLoaded", () => {
  clickLoginButton();
});