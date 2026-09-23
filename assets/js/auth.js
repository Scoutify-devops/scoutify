const apiBase = window.location.protocol === "file:" ? "http://localhost:3000/api" : "/api";
const authForm = document.getElementById("authForm");
const authStatus = document.getElementById("authStatus");
const nameField = document.getElementById("nameField");
const authTitle = document.getElementById("authTitle");
const modeButton = document.getElementById("modeButton");
const googleButton = document.getElementById("googleButton");
let mode = "login";

function getSupabaseClient() {
  const url = window.SUPABASE_URL || localStorage.getItem("scoutify_supabase_url");
  const anonKey = window.SUPABASE_ANON_KEY || localStorage.getItem("scoutify_supabase_anon_key");

  if (!url || !anonKey) return null;

  if (!window.supabase) return null;

  if (!window.__scoutifySupabaseClient) {
    window.__scoutifySupabaseClient = window.supabase.createClient(url, anonKey);
  }

  return window.__scoutifySupabaseClient;
}

function saveSession(session) {
  if (session?.access_token) {
    localStorage.setItem("scoutify_token", session.access_token);
  }

  const user = session?.user || null;
  if (user) {
    localStorage.setItem("scoutify_user", JSON.stringify({
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Scoutify user",
      email: user.email,
      role: user.user_metadata?.role || "player"
    }));
  }
}

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

googleButton?.addEventListener("click", async () => {
  const client = getSupabaseClient();

  if (client) {
    if (authStatus) authStatus.textContent = "Redirecting to Google...";

    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/pages/choose-role.html`
      }
    });

    if (error) {
      if (authStatus) authStatus.textContent = error.message;
      return;
    }

    return;
  }

  if (authStatus) {
    authStatus.textContent = "Supabase is not configured yet. Add your project URL and anon key to login.html.";
  }
});

authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (authStatus) authStatus.textContent = "Signing in...";

  const formData = new FormData(authForm);
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const password = (formData.get("password") || "").toString();

  if (!email || !password || (mode === "register" && !name)) {
    if (authStatus) authStatus.textContent = "Please fill in all required fields.";
    return;
  }

  const client = getSupabaseClient();

  try {
    if (client) {
      const action = mode === "register" ? client.auth.signUp : client.auth.signInWithPassword;
      const result = mode === "register"
        ? await action({ email, password, options: { data: { name } } })
        : await action({ email, password });

      if (result.error) {
        throw result.error;
      }

      saveSession(result.data?.session || result.data || {});
      window.location.href = "choose-role.html";
      return;
    }

    const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
    const payload = mode === "register"
      ? { name, email, password }
      : { email, password };

    const result = await apiRequest(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    localStorage.setItem("scoutify_token", result.token);
    localStorage.setItem("scoutify_user", JSON.stringify(result.user));
    window.location.href = "choose-role.html";
  } catch (error) {
    if (authStatus) authStatus.textContent = error.message || "Authentication failed.";
  }
});

updateMode();