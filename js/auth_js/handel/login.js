import { loginUser } from "../apiauth.js";
import { validateLoginForm } from "../error/errorAuth.js";
import { ShowError } from "../error/errorAuth.js";

const emailInputField = document.querySelector("#email");
const passwordInputField = document.querySelector("#password");
const loginButton = document.querySelector("#login-button");

function getLoginData() {
  const email = emailInputField.value.trim();
  const password = passwordInputField.value.trim();
  return { email, password };
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
          localStorage.setItem("username", result.data.name); 
          localStorage.setItem("credits", result.data.credits);
          showSuccess("Login successful. Redirecting...");
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

function showSuccess() {
  const spinnerWrapper = document.createElement("div");
  spinnerWrapper.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";

  const spinner = document.createElement("div");
  spinner.className = "border-4 border-white border-t-button-prime rounded-full w-12 h-12 animate-spin";
  
  const successMsg = document.createElement("p");
  successMsg.className = "text-white text-lg mt-4";
  successMsg.textContent = "Login successful! Redirecting...";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "flex flex-col items-center";
  contentWrapper.appendChild(spinner);
  contentWrapper.appendChild(successMsg);

  spinnerWrapper.appendChild(contentWrapper);
  document.body.appendChild(spinnerWrapper);

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1500);
}

clickLoginButton();

