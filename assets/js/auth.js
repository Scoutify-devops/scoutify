const apiBase = window.location.protocol === "file:" ? "http://localhost:3000/api" : "/api";
const authForm = document.getElementById("authForm");
const authStatus = document.getElementById("authStatus");
const nameField = document.getElementById("nameField");
const authTitle = document.getElementById("authTitle");
const modeButton = document.getElementById("modeButton");
const googleButton = document.getElementById("googleButton");
let mode = "login";

function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem("scoutify_token");
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${apiBase}${path}`, { ...options, headers }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }
    return data;
  });
}

function updateMode() {
  if (!authTitle || !modeButton || !nameField) return;

  const registration = mode === "register";
  authTitle.textContent = registration ? "Create your player account" : "Welcome back";
  nameField.classList.toggle("hidden", !registration);
  const authName = document.getElementById("authName");
  if (authName) authName.required = registration;
  modeButton.textContent = registration ? "Already have an account? Sign in" : "New to Scoutify? Create an account";
}

modeButton?.addEventListener("click", () => {
  mode = mode === "login" ? "register" : "login";
  updateMode();
  if (authStatus) authStatus.textContent = "";
});

googleButton?.addEventListener("click", () => {
  window.location.href = `${apiBase}/auth/google`;
});

authForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  window.location.href = "choose-role.html";
});

updateMode();