export function getRegisterData() {
  const email = document.querySelector("#email").value.trim();
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#password-confirm").value;
  return { email, username, password, confirmPassword };
}

export function validateForm() {
  const { email, username, password, confirmPassword } = getRegisterData();
  let isValid = true;

  [
    "email-error",
    "username-error",
    "password-error",
    "confirm-password-error",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  if (email === "") {
    const emailError = document.getElementById("email-error");
    emailError.textContent = "Vennligst fyll inn e-post.";
    emailError.classList.remove("hidden");
    emailError.classList.add("text-red-500"); 
    isValid = false;
  } else if (
    !email.endsWith("@stud.noroff.no") &&
    !email.endsWith("@noroff.no")
  ) {
    document.getElementById("email-error").textContent =
      "email need to be a Noroff domain.";
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  }

  if (username === "") {
    document.getElementById("username-error").textContent =
      "please fill in Username.";
    document.getElementById("username-error").classList.remove("hidden");
    isValid = false;
  }

  if (password === "") {
    document.getElementById("password-error").textContent =
      "please fill in your password.";
    document.getElementById("password-error").classList.remove("hidden");
    isValid = false;
  } else if (password.length < 8) {
    document.getElementById("password-error").textContent =
      "password need to be a least 8 letters.";
    document.getElementById("password-error").classList.remove("hidden");
    isValid = false;
  }

  if (confirmPassword === "") {
    document.getElementById("password-confirm-error").textContent =
      "please confirm your password.";
    document
      .getElementById("password-confirm-error")
      .classList.remove("hidden");
    isValid = false;
  } else if (password !== confirmPassword) {
    document.getElementById("password-confirm-error").textContent =
      "Password does not match.";
    document
      .getElementById("password-confirm-error")
      .classList.remove("hidden");
    isValid = false;
  }

  return isValid;
}

export function validateLoginForm(userData) {
  const { email, password } = userData; 
  let isValid = true;


  ["email-error", "password-error"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  if (email === "") {
    document.getElementById("email-error").textContent =
      "Please fill in your email.";
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  } else if (
    !email.endsWith("@stud.noroff.no") &&
    !email.endsWith("@noroff.no")
  ) {
    document.getElementById("email-error").textContent =
      "email need to be a Noroff domain.";
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  }

  if (password === "") {
    document.getElementById("password-error").textContent =
      "please fill in your password.";
    document.getElementById("password-error").classList.remove("hidden");
    isValid = false;
  }

  return isValid;
}

export function ShowError(message) {
  const errorBox = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  const closeBtn = document.getElementById("close-error");

  if (!errorBox || !errorText || !closeBtn) return;

  errorText.textContent = message;
  errorBox.classList.remove("hidden");

  closeBtn.addEventListener("click", () => {
    errorBox.classList.add("hidden");
  });
}
