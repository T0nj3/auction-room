export function getRegisterData() {
  const email = document.querySelector("#email").value.trim();
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#password-confirm").value;
  return { email, username, password, confirmPassword };
}

export function validateForm() {
  const { email, username, password, confirmPassword } = getRegisterData(); // Nå kaller vi getRegisterData her
  let isValid = true;

  // Skjul eksisterende feilmeldinger
  [
    "email-error",
    "username-error",
    "password-error",
    "confirm-password-error",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  if (!email) {
    document.getElementById("email-error").textContent =
      "Vennligst fyll inn e-post.";
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  } else if (
    !email.endsWith("@stud.noroff.no") &&
    !email.endsWith("@noroff.no")
  ) {
    document.getElementById("email-error").textContent =
      "E-post må være en Noroff-adresse.";
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  }

  if (username === "") {
    document.getElementById("username-error").textContent =
      "Vennligst fyll inn brukernavn.";
    document.getElementById("username-error").classList.remove("hidden");
    isValid = false;
  }

  if (password === "") {
    document.getElementById("password-error").textContent =
      "Vennligst fyll inn passord.";
    document.getElementById("password-error").classList.remove("hidden");
    isValid = false;
  } else if (password.length < 8) {
    document.getElementById("password-error").textContent =
      "Passord må være minst 8 tegn.";
    document.getElementById("password-error").classList.remove("hidden");
    isValid = false;
  }

  if (confirmPassword === "") {
    document.getElementById("password-confirm-error").textContent =
      "Vennligst bekreft passordet.";
    document
      .getElementById("password-confirm-error")
      .classList.remove("hidden");
    isValid = false;
  } else if (password !== confirmPassword) {
    document.getElementById("password-confirm-error").textContent =
      "Passordene samsvarer ikke.";
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
      "Vennligst fyll inn e-post.";
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  } else if (
    !email.endsWith("@stud.noroff.no") &&
    !email.endsWith("@noroff.no")
  ) {
    document.getElementById("email-error").textContent =
      "E-post må være en Noroff-adresse.";
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  }

  if (password === "") {
    document.getElementById("password-error").textContent =
      "Vennligst fyll inn passord.";
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
