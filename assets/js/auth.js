const apiBase = window.location.protocol === "file:" ? "http://localhost:3000/api" : "/api";
const authForm = document.getElementById("authForm");
const authStatus = document.getElementById("authStatus");
const nameField = document.getElementById("nameField");
const authTitle = document.getElementById("authTitle");
const modeButton = document.getElementById("modeButton");
let mode = "login";

function updateMode() {
  const registration = mode === "register";
  authTitle.textContent = registration ? "Create your player account" : "Welcome back";
  nameField.classList.toggle("hidden", !registration);
  document.getElementById("authName").required = registration;
  modeButton.textContent = registration ? "Already have an account? Sign in" : "New to Scoutify? Create an account";
}

modeButton.addEventListener("click", () => {
  mode = mode === "login" ? "register" : "login";
  updateMode();
  authStatus.textContent = "";
});

document.getElementById("googleButton")?.addEventListener("click", () => {
  window.location.href = `${apiBase}/auth/google`;
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  localStorage.setItem("scoutify_token", "demo-session");
  localStorage.setItem("scoutify_user", JSON.stringify({ id: "demo-user", name: "Scoutify user", email: "", role: null }));
  window.location.href = "choose-role.html";
});

updateMode();