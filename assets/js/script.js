const apiBase = window.location.protocol === "file:" ? "http://localhost:3000/api" : "/api";
const pagePath = window.location.pathname;
const isLandingPage = pagePath === "/" || pagePath.endsWith("/index.html");
const isEntryPage = pagePath.endsWith("/login.html") || pagePath.endsWith("/choose-role.html") || pagePath === "/";
if (isLandingPage && !window.location.pathname.endsWith("/pages/login.html")) {
  window.location.replace("./pages/login.html");
}
const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("scoutify_user") || "null");
  } catch {
    return null;
  }
})();

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("scoutify_user") || "null");
  } catch {
    return null;
  }
}

function updateSignedInUI() {
  const logoutButton = document.getElementById("logoutInButton") || document.getElementById("signInButton");
  const user = getSavedUser();

  if (!logoutButton) return;

  if (user?.name) {
    logoutButton.textContent = `${user.name} • logout`;
    logoutButton.title = `Signed in as ${user.name}. Click to log out.`;
    logoutButton.classList.add("is-logged-in");
    return;
  }

  logoutButton.textContent = "Logout";
  logoutButton.title = "Logout";
  logoutButton.classList.remove("is-logged-in");
}

function logoutCurrentUser() {
  localStorage.removeItem("scoutify_token");
  localStorage.removeItem("scoutify_user");
  localStorage.removeItem("scoutify_supabase_url");
  localStorage.removeItem("scoutify_supabase_anon_key");
  localStorage.removeItem("scoutify_player_stats");
  if (window.__scoutifySupabaseClient) {
    try {
      window.__scoutifySupabaseClient.auth.signOut();
    } catch {
      // no-op
    }
  }
  workspaceRole = null;
  updateSignedInUI();
  window.location.href = "pages/login.html";
}

if (!isEntryPage && !savedUser?.role) {
  window.location.replace("pages/login.html");
}

const defaultVideos = [
  { id: 1, title: "Elite football skills session: dribbling and quick feet", channel: "GoalZone", channelSlug: "goalzone", views: "2.1M", age: "3 days ago", duration: "12:48", category: "Football", accent: "linear-gradient(135deg, #0ea5e9, #2563eb)", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80", youtubeId: "ScMzIvxBSi4", comments: [{ user: "Ava", text: "This training routine is perfect for youth players chasing more agility." }, { user: "Dylan", text: "The quick-feet drills are great and easy to repeat in training sessions." }, { user: "Noah", text: "I need more of this type of football content on my feed." }] },
  { id: 2, title: "Top 10 tactical formations for rising teams", channel: "Tactical Edge", channelSlug: "tactical-edge", views: "890K", age: "5 days ago", duration: "18:22", category: "Training", accent: "linear-gradient(135deg, #f59e0b, #ef4444)", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80", youtubeId: "dQw4w9WgXcQ", comments: [{ user: "Mia", text: "Love the breakdown of the 4-3-3 and 3-2-5 transitions." }, { user: "Leo", text: "Very useful for players learning movement without the ball." }, { user: "Zoe", text: "That last formation idea could really help a smaller squad." }] },
  { id: 3, title: "Street football showdown: final minute drama", channel: "Street Football", channelSlug: "street-football", views: "1.4M", age: "1 week ago", duration: "9:15", category: "Football", accent: "linear-gradient(135deg, #22c55e, #16a34a)", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80", youtubeId: "ysz5S6PUM-U", comments: [{ user: "Sam", text: "That finish at the end was unreal. Pure composure." }, { user: "Tariq", text: "The crowd energy in this match makes it feel like a real finals atmosphere." }, { user: "Jade", text: "This is exactly the kind of content fans want more of." }] },
  { id: 4, title: "Build a high-performance training plan for players", channel: "Elite Academy", channelSlug: "elite-academy", views: "645K", age: "2 days ago", duration: "15:10", category: "Training", accent: "linear-gradient(135deg, #a855f7, #ec4899)", image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80", youtubeId: "M7lc1UVf-VE", comments: [{ user: "Emma", text: "The weekly structure is clear and easy to apply with a youth side." }, { user: "Kai", text: "I appreciate the focus on conditioning without overtraining." }, { user: "Riley", text: "This would work well for coaches building a full season cycle." }] },
  { id: 5, title: "Inside the life of a football scout", channel: "Premier Pulse", channelSlug: "premier-pulse", views: "1.8M", age: "6 days ago", duration: "11:34", category: "Player stories", accent: "linear-gradient(135deg, #f43f5e, #f97316)", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80", youtubeId: "aqz-KE-bpKQ", comments: [{ user: "Priya", text: "The behind-the-scenes info is really useful for anyone wanting to work in football." }, { user: "Mason", text: "This gives a realistic look at the process scouts go through every week." }, { user: "Nathan", text: "The advice on talent spotting and consistency is excellent." }] },
  { id: 6, title: "Football fans react to the weekend matches", channel: "FanZone", channelSlug: "fanzone", views: "523K", age: "4 hours ago", duration: "7:53", category: "Match footage", accent: "linear-gradient(135deg, #14b8a6, #0ea5e9)", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80", youtubeId: "ysz5S6PUM-U", comments: [{ user: "Hugo", text: "The match reactions make this a great watch for football fans." }, { user: "Ivy", text: "The reactions make the whole stream feel live and personal." }, { user: "Omar", text: "I came for the football talk and stayed for the community vibe." }] },
  { id: 7, title: "Best football moments from this weekend", channel: "Match Feed", channelSlug: "match-feed", views: "3.7M", age: "1 day ago", duration: "14:57", category: "Football", accent: "linear-gradient(135deg, #f97316, #ef4444)", image: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80", youtubeId: "ScMzIvxBSi4", comments: [{ user: "Luca", text: "This is a great recap of what was actually exciting this weekend." }, { user: "Faith", text: "The pace of the highlights is perfect for a quick sports fix." }, { user: "Jules", text: "This is the kind of clip I keep sending to my football group chat." }] },
  { id: 8, title: "Matchday warm-up routine for players", channel: "Pulse Studio", channelSlug: "pulse-studio", views: "410K", age: "8 hours ago", duration: "20:03", category: "Training", accent: "linear-gradient(135deg, #8b5cf6, #ec4899)", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80", youtubeId: "M7lc1UVf-VE", comments: [{ user: "Aiden", text: "Honestly this playlist is amazing for gym and field sessions." }, { user: "Chloe", text: "The energy level stays high all the way through." }, { user: "Seth", text: "This mix would be perfect for a team warm-up before a match." }] }
];
let videos = [...defaultVideos];
const defaultPlayerStats = { matchesPlayed: 0, goals: 0, assists: 0, rating: 4.8, pace: 88, position: "Forward" };

function getPlayerStats() {
  const user = getSavedUser();
  if (!user?.id) return { ...defaultPlayerStats };

  try {
    const raw = JSON.parse(localStorage.getItem("scoutify_player_stats") || "{}");
    return { ...defaultPlayerStats, ...(raw[user.id] || {}) };
  } catch {
    return { ...defaultPlayerStats };
  }
}

function savePlayerStats(nextStats) {
  const user = getSavedUser();
  if (!user?.id) return;

  try {
    const cache = JSON.parse(localStorage.getItem("scoutify_player_stats") || "{}");
    cache[user.id] = { ...defaultPlayerStats, ...nextStats };
    localStorage.setItem("scoutify_player_stats", JSON.stringify(cache));
  } catch {
    console.warn("Unable to save player stats.");
  }
}

function formatCompactNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "0";
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
  return `${number}`;
}

function formatStatValue(value) {
  return Number(value || 0).toFixed(value % 1 !== 0 ? 1 : 0);
}

const profiles = [
  { slug: "goalzone", name: "GoalZone", role: "Football coach and talent creator", location: "Johannesburg, South Africa", bio: "GoalZone helps young players sharpen their technical skills, build confidence, and understand the game beyond the basics.", stats: { videos: 128, subscribers: "45K", followers: "12K", rating: "4.9" }, tags: ["Dribbling", "Training", "Youth Development", "Football IQ"], featured: "Elite football skills session: dribbling and quick feet", banner: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80" },
  { slug: "tactical-edge", name: "Tactical Edge", role: "Analysis and coaching educator", location: "Cape Town, South Africa", bio: "Tactical Edge brings tactical breakdowns and weekly coaching ideas for players, coaches, and football analysts.", stats: { videos: 76, subscribers: "21K", followers: "8.7K", rating: "4.8" }, tags: ["Tactics", "Formations", "Strategy", "Team Play"], featured: "Top 10 tactical formations for rising teams", banner: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80" },
  { slug: "street-football", name: "Street Football", role: "Street football storyteller", location: "Durban, South Africa", bio: "Street Football captures the raw passion, creativity, and energy of community matches and local football culture.", stats: { videos: 212, subscribers: "89K", followers: "63K", rating: "4.9" }, tags: ["Local Matches", "Pressure Moments", "Community", "Skill"], featured: "Street football showdown: final minute drama", banner: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80" },
  { slug: "elite-academy", name: "Elite Academy", role: "Performance coach", location: "Pretoria, South Africa", bio: "Elite Academy focuses on high performance, sports science, and long-term development for ambitious players.", stats: { videos: 94, subscribers: "31K", followers: "16K", rating: "4.7" }, tags: ["Conditioning", "Academy", "Speed", "Recovery"], featured: "Build a high-performance training plan for players", banner: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80" }
];

const categories = ["All", "Football", "Training", "Match footage", "Player stories"];
const chipRow = document.getElementById("chipRow");
const videoGrid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const modal = document.getElementById("videoModal");
const modalContent = document.getElementById("modalContent");
const closeModalButton = document.getElementById("closeModal");
const profilePage = document.getElementById("profilePage");
const authModal = document.getElementById("authModal");
const roleChoiceModal = document.getElementById("roleChoiceModal");
const uploadModal = document.getElementById("uploadModal");
const authForm = document.getElementById("authForm");
const authStatus = document.getElementById("authStatus");
const uploadStatus = document.getElementById("uploadStatus");
let authMode = "login";
let workspaceRole = (() => {
  try {
    return JSON.parse(localStorage.getItem("scoutify_user") || "{}").role || null;
  } catch {
    return null;
  }
})();

function getProfileBySlug(slug) {
  return profiles.find((profile) => profile.slug === slug) || profiles[0];
}

function viewProfile(slug) {
  const profilePagePath = window.location.pathname.includes("/pages/") ? "./profile.html" : "./pages/profile.html";
  const target = new URL(`${profilePagePath}?profile=${encodeURIComponent(slug)}`, window.location.href).href;
  window.location.href = target;
}

function renderChips() {
  if (!chipRow) return;
  chipRow.innerHTML = categories.map((category, index) => `<button class="chip ${index === 0 ? "active" : ""}" data-category="${category}">${category}</button>`).join("");
}

async function loadYouTubeUploads() {
  try {
    const data = await apiRequest("/videos");
    const uploadedVideos = Array.isArray(data.videos) ? data.videos : [];
    if (!uploadedVideos.length) return;

    const mapped = uploadedVideos.map((video, index) => ({
      id: Number(`${Date.now()}${index}`),
      title: video.title || "Player upload",
      channel: "Player upload",
      channelSlug: "player-upload",
      views: "New",
      age: "just now",
      duration: "—",
      category: "Football",
      accent: "linear-gradient(135deg, #f97316, #ef4444)",
      image: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
      youtubeId: video.youtubeId,
      comments: []
    }));

    videos = [...defaultVideos, ...mapped];
    renderVideos();
  } catch (error) {
    console.warn("No uploaded videos to display yet.", error.message);
  }
}

function renderVideos() {
  if (!videoGrid || !searchInput) return;
  const activeCategory = document.querySelector(".chip.active")?.dataset.category || "All";
  const query = searchInput.value.trim().toLowerCase();
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === "All" || video.category === activeCategory;
    const haystack = `${video.title} ${video.channel} ${video.category}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });

  if (!filteredVideos.length) {
    videoGrid.innerHTML = `
      <div class="empty-state">
        <h3>No videos match your search.</h3>
        <p>Try another keyword or category.</p>
      </div>
    `;
    return;
  }

  videoGrid.innerHTML = filteredVideos.map((video) => `
    <article class="video-card" data-video-id="${video.id}" tabindex="0">
      <div class="thumbnail" style="background-image: url('${video.image}')">
        <span class="duration">${video.duration}</span>
      </div>
      <div class="video-body">
        <div class="channel-avatar" style="background: ${video.accent};">${video.channel.slice(0, 1)}</div>
        <div class="video-copy">
          <h3>${video.title}</h3>
          <p class="channel-name">${video.channel}</p>
          <p class="meta">${video.views} views • ${video.age}</p>
        </div>
        <div class="video-actions">
          <button class="view-profile-button" data-profile="${video.channelSlug}" aria-label="View ${video.channel} profile">View profile</button>
          <button class="more-button" aria-label="More options">⋮</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const profileButton = event.target.closest(".view-profile-button");
      if (profileButton) {
        event.stopPropagation();
        viewProfile(profileButton.dataset.profile);
        return;
      }
      if (event.target.closest(".more-button")) return;
      openModal(Number(card.dataset.videoId));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(Number(card.dataset.videoId));
      }
    });
  });
}

function openModal(videoId) {
  if (!modal || !modalContent) return;
  const selectedVideo = videos.find((video) => video.id === videoId);
  if (!selectedVideo) return;

  modalContent.innerHTML = `
    <div class="modal-content">
      <div class="modal-video-wrap">
        <iframe src="https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${selectedVideo.title}"></iframe>
      </div>
      <div class="modal-info">
        <h3>${selectedVideo.title}</h3>
        <div class="meta-row">
          <span>${selectedVideo.channel}</span>
          <span>•</span>
          <span>${selectedVideo.views} views</span>
          <span>•</span>
          <span>${selectedVideo.age}</span>
        </div>
        <div class="action-row">
          <button>👍 Like</button>
          <button>👎 Dislike</button>
          <button>🔖 Save</button>
          <button>⇩ Share</button>
        </div>
        <p class="description">Discover fresh football insight, elite player development, and standout moments from the current football scene. This video brings together coaching ideas, match energy, and content designed to inspire players, scouts, and fans alike.</p>
        <div class="comment-list">
          ${selectedVideo.comments.map((comment) => `
            <div class="comment-item">
              <div class="comment-avatar">${comment.user.slice(0, 1)}</div>
              <div>
                <div class="comment-user">${comment.user}</div>
                <div class="comment-body">${comment.text}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function renderProfilePage() {
  if (!profilePage) return;
  const params = new URLSearchParams(window.location.search);
  const activeProfile = getProfileBySlug(params.get("profile") || "goalzone");

  profilePage.innerHTML = `
    <section class="profile-hero">
      <div class="profile-cover" style="background-image: url('${activeProfile.banner}')"></div>
      <div class="profile-main">
        <div class="profile-avatar">${activeProfile.name.slice(0, 1)}</div>
        <div class="profile-header-details">
          <h1>${activeProfile.name}</h1>
          <p>${activeProfile.role}</p>
          <div class="profile-meta">
            <span>📍 ${activeProfile.location}</span>
            <span>⭐ ${activeProfile.stats.rating} rating</span>
          </div>
        </div>
        <div class="profile-actions">
          <button class="primary-button">Follow</button>
          <a class="soft-button" href="../index.html">Back to home</a>
        </div>
      </div>
    </section>
    <section class="profile-content-grid">
      <div class="profile-panel">
        <h2>About</h2>
        <p>${activeProfile.bio}</p>
        <div class="tag-list">${activeProfile.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
      <div class="profile-panel stats-panel">
        <h2>Stats</h2>
        <div class="stat-grid">
          <div><strong>${activeProfile.stats.videos}</strong><span>Videos</span></div>
          <div><strong>${activeProfile.stats.subscribers}</strong><span>Subscribers</span></div>
          <div><strong>${activeProfile.stats.followers}</strong><span>Followers</span></div>
          <div><strong>${activeProfile.stats.rating}</strong><span>Rating</span></div>
        </div>
      </div>
    </section>
    <section class="featured-panel">
      <h2>Featured video</h2>
      <div class="featured-card">
        <div class="featured-image" style="background-image: url('${videos.find((video) => video.channel === activeProfile.name)?.image || videos[0].image}')"></div>
        <div class="featured-copy">
          <h3>${activeProfile.featured}</h3>
          <p>${activeProfile.name} • football training & analysis</p>
        </div>
      </div>
    </section>
  `;
}

function currentToken() {
  return localStorage.getItem("scoutify_token");
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (currentToken()) headers.Authorization = `Bearer ${currentToken()}`;
  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

function showSurface(surface) {
  if (!surface) return;
  surface.classList.remove("hidden");
  surface.setAttribute("aria-hidden", "false");
}

function hideSurface(surface) {
  if (!surface) return;
  surface.classList.add("hidden");
  surface.setAttribute("aria-hidden", "true");
}

function updateAuthMode() {
  const registration = authMode === "register";
  const authTitle = document.getElementById("authTitle");
  const authName = document.getElementById("authName");
  const nameField = document.getElementById("nameField");
  const authModeButton = document.getElementById("authModeButton");
  if (!authTitle || !authName || !nameField || !authModeButton) return;

  authTitle.textContent = registration ? "Create your account" : "Sign in to your account";
  authName.toggleAttribute("required", registration);
  authName.classList.toggle("hidden", !registration);
  nameField.classList.toggle("hidden", !registration);
  authModeButton.textContent = registration ? "Already have an account? Sign in" : "Need an account? Create one";
}

function showRoleChoice() {
  if (authModal) hideSurface(authModal);
  if (roleChoiceModal) showSurface(roleChoiceModal);
}

function openUploadPanel() {
  if (!uploadModal) return;
  showSurface(uploadModal);
}

async function loadYouTubeStats() {
  try {
    const result = await apiRequest("/user/youtube-stats");
    window.scoutifyYoutubeStats = result;
  } catch (error) {
    console.warn("Could not load YouTube stats:", error.message);
    window.scoutifyYoutubeStats = { channelName: getSavedUser()?.name || "Player", views: 0, subscribers: 0, videos: 0, uploads: 0 };
  }
}

function renderWorkspace() {
  const isScout = workspaceRole === "scout";
  const workspaceTitle = document.getElementById("workspaceTitle");
  const workspaceDescription = document.getElementById("workspaceDescription");
  const rolePanel = document.getElementById("rolePanel");
  const user = getSavedUser();
  if (!workspaceTitle || !workspaceDescription || !rolePanel) return;

  const signedInName = user?.name || "Scoutify member";
  const youtubeStatus = user?.email ? `Connected as ${user.email}` : "Connected with YouTube";
  const youtubeStats = window.scoutifyYoutubeStats || { channelName: signedInName, views: 0, subscribers: 0, videos: 0, uploads: 0 };
  const playerStats = getPlayerStats();

  workspaceTitle.textContent = isScout ? `Scout view • ${signedInName}` : `Player view • ${signedInName}`;
  workspaceDescription.textContent = isScout
    ? `${signedInName} is reviewing players, watching footage, and messaging talent.`
    : `${signedInName} is uploading and sharing performance videos with the football community.`;

  const statsHtml = isScout
    ? `<div class="role-metrics"><div><strong>${formatCompactNumber(youtubeStats.views)}</strong><span>YouTube views</span></div><div><strong>${formatCompactNumber(youtubeStats.subscribers)}</strong><span>subs</span></div><div><strong>${formatStatValue(playerStats.rating)}</strong><span>rating</span></div></div>`
    : `<div class="role-metrics"><div><strong>${formatCompactNumber(youtubeStats.views)}</strong><span>YouTube views</span></div><div><strong>${formatCompactNumber(youtubeStats.videos)}</strong><span>uploads</span></div><div><strong>${playerStats.matchesPlayed}</strong><span>matches</span></div><div><strong>${formatStatValue(playerStats.pace)}</strong><span>pace</span></div></div>`;

  const playerStatsForm = isScout
    ? ""
    : `<form id="playerStatsForm" class="player-stats-form"><div class="inline-form-grid"><label>Matches played<input name="matchesPlayed" type="number" min="0" value="${playerStats.matchesPlayed}" /></label><label>Goals<input name="goals" type="number" min="0" value="${playerStats.goals}" /></label><label>Assists<input name="assists" type="number" min="0" value="${playerStats.assists}" /></label></div><div class="inline-form-grid"><label>Rating<input name="rating" type="number" min="0" max="10" step="0.1" value="${playerStats.rating}" /></label><label>Pace (km/h)<input name="pace" type="number" min="0" max="100" step="1" value="${playerStats.pace}" /></label><label>Position<input name="position" type="text" value="${playerStats.position}" /></label></div><button class="primary-button" type="submit">Save soccer stats</button></form>`;

  rolePanel.innerHTML = isScout
    ? `<article class="role-card role-card-primary"><span class="role-icon">🔎</span><div><h3>Scout talent</h3><p>Filter the feed by position, training, and match footage. This workspace is linked to ${signedInName} and the real YouTube stats from the connected account.</p></div><button class="primary-button role-message-button" type="button">Message a player</button></article>${statsHtml}`
    : `<article class="role-card role-card-primary"><span class="role-icon">⚽</span><div><h3>Build your player profile</h3><p>Upload match clips and training videos using the YouTube account connected to ${signedInName}. Scouts can view your real performance numbers and your player stats below.</p></div><button class="primary-button role-upload-button" type="button">Post a video</button></article>${statsHtml}${playerStatsForm}`;

  document.querySelector(".role-message-button")?.addEventListener("click", () => {
    window.location.href = "pages/messages.html";
  });

  document.querySelector(".role-upload-button")?.addEventListener("click", () => {
    openUploadPanel();
  });

  document.getElementById("playerStatsForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const nextStats = {
      matchesPlayed: Number(form.get("matchesPlayed") || 0),
      goals: Number(form.get("goals") || 0),
      assists: Number(form.get("assists") || 0),
      rating: Number(form.get("rating") || 0),
      pace: Number(form.get("pace") || 0),
      position: String(form.get("position") || "Forward").trim() || "Forward"
    };

    savePlayerStats(nextStats);
    renderWorkspace();
  });
}

if (chipRow) {
  chipRow.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach((button) => button.classList.remove("active"));
    chip.classList.add("active");
    renderVideos();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", renderVideos);
}

const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", renderVideos);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
}

if (closeModalButton && modal) {
  closeModalButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close='true']")) closeModal();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) closeModal();
});

renderChips();
renderVideos();
renderProfilePage();
loadYouTubeUploads();

document.querySelectorAll("[data-role-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    workspaceRole = button.dataset.roleChoice;
    const user = JSON.parse(localStorage.getItem("scoutify_user") || "{}");
    localStorage.setItem("scoutify_user", JSON.stringify({ ...user, role: workspaceRole }));
    if (roleChoiceModal) hideSurface(roleChoiceModal);
    renderWorkspace();
  });
});

const logoutTrigger = document.getElementById("logoutInButton") || document.getElementById("signInButton");
logoutTrigger?.addEventListener("click", () => {
  logoutCurrentUser();
});

document.getElementById("authModeButton")?.addEventListener("click", () => {
  authMode = authMode === "login" ? "register" : "login";
  updateAuthMode();
});

document.getElementById("googleButton")?.addEventListener("click", async () => {
  const client = window.__scoutifySupabaseClient || (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
    : null);

  if (client) {
    window.__scoutifySupabaseClient = client;
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/pages/choose-role.html`
      }
    });

    if (error) {
      if (authStatus) authStatus.textContent = error.message;
    }

    return;
  }

  if (authStatus) {
    authStatus.textContent = "Google login is not configured yet. Add your Supabase project URL and anon key.";
  }
});

authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (authStatus) authStatus.textContent = "Working...";

  const body = Object.fromEntries(new FormData(authForm));
  const endpoint = `/auth/${authMode === "register" ? "register" : "login"}`;

  try {
    const result = await apiRequest(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    localStorage.setItem("scoutify_token", result.token);
    localStorage.setItem("scoutify_user", JSON.stringify(result.user));
    workspaceRole = result.user.role || "player";
    const signInButton = document.getElementById("signInButton");
    if (signInButton) signInButton.textContent = result.user.name;
    if (authStatus) authStatus.textContent = "You are signed in.";
    setTimeout(() => showRoleChoice(), 300);
  } catch (error) {
    if (authStatus) authStatus.textContent = error.message;
  }
});

document.getElementById("createButton")?.addEventListener("click", () => {
  openUploadPanel();
});

document.getElementById("uploadForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (uploadStatus) uploadStatus.textContent = "Uploading to YouTube...";

  try {
    const result = await apiRequest("/videos/youtube", { method: "POST", body: new FormData(event.target) });
    if (uploadStatus) uploadStatus.textContent = `Uploaded successfully: ${result.video.title}`;
    event.target.reset();
    await loadYouTubeUploads();
    setTimeout(() => {
      const uploadSurface = document.getElementById("uploadModal");
      if (uploadSurface) hideSurface(uploadSurface);
    }, 600);
  } catch (error) {
    if (uploadStatus) uploadStatus.textContent = error.message;
  }
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const surface = document.getElementById(button.dataset.close);
    if (surface) hideSurface(surface);
  });
});

const callbackParams = new URLSearchParams(window.location.search);
if (callbackParams.get("token")) {
  localStorage.setItem("scoutify_token", callbackParams.get("token"));
  showRoleChoice();
  window.history.replaceState({}, document.title, window.location.pathname);
}
if (callbackParams.get("authError")) {
  authMode = "login";
  updateAuthMode();
  if (authModal) showSurface(authModal);
  if (authStatus) authStatus.textContent = callbackParams.get("authError");
}
const storedUser = getSavedUser();
if (storedUser?.name) {
  const logoutButton = document.getElementById("logoutInButton") || document.getElementById("signInButton");
  if (logoutButton) {
    logoutButton.textContent = `${storedUser.name} • logout`;
    logoutButton.title = `Signed in as ${storedUser.name}. Click to log out.`;
  }
}
updateSignedInUI();
updateAuthMode();
if (workspaceRole) renderWorkspace();
