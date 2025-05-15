import { registerUser } from "../apiauth.js";
import { validateForm } from "../error/errorAuth.js";
import { ShowError } from "../error/errorAuth.js";

function showSuccess(message) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50";

  const box = document.createElement("div");
  box.className =
    "flex flex-col items-center gap-4 bg-white px-8 py-6 rounded-lg shadow-lg";

  const spinner = document.createElement("div");
  spinner.className =
    "w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin";

  const text = document.createElement("p");
  text.className = "text-center text-brown font-semibold";
  text.textContent = message;

  box.appendChild(spinner);
  box.appendChild(text);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
    window.location.href = "./login.html";
  }, 2000);
}

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

registerButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const registerData = getRegisterData();

  if (validateForm(registerData)) {
    const { email, username, password } = registerData;

    try {
      const result = await registerUser({ email, name: username, password });

      // Suksess!
      showSuccess("Registration successful. Redirecting...");
    } catch (error) {
      ShowError(error.message);
      console.error("Registrering feilet:", error.message);
    }
  }
});

const token = localStorage.getItem("token");
if (token) {
  window.location.href = "../index.html";
}
