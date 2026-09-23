const apiBase = window.location.protocol === "file:" ? "http://localhost:3000/api" : "/api";
const demoKey = "scoutify_demo_messages";
const conversations = [
  { id: "goalzone", name: "GoalZone", role: "Football coach", avatar: "G", color: "avatar-blue", preview: "Your dribbling clip has real potential.", time: "2m" },
  { id: "tactical-edge", name: "Tactical Edge", role: "Performance analyst", avatar: "T", color: "avatar-orange", preview: "Can you send your latest match footage?", time: "1h" },
  { id: "street-football", name: "Street Football", role: "Player showcase", avatar: "S", color: "avatar-green", preview: "That tournament is a great opportunity.", time: "3h" }
];
const seededMessages = {
  goalzone: [{ from: "them", text: "Hi, I watched your latest football clip.", time: "10:42" }, { from: "them", text: "Your dribbling clip has real potential. Are you playing in the October tournament?", time: "10:43" }],
  "tactical-edge": [{ from: "them", text: "Can you send your latest match footage?", time: "09:18" }],
  "street-football": [{ from: "them", text: "That tournament is a great opportunity for developing players.", time: "Yesterday" }]
};
let activeId = conversations[0].id;

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("scoutify_user") || "{}") || {};
  } catch {
    return {};
  }
}

function readMessages() {
  return JSON.parse(localStorage.getItem(demoKey) || JSON.stringify(seededMessages));
}

function writeMessages(messages) {
  localStorage.setItem(demoKey, JSON.stringify(messages));
}

function currentToken() {
  return localStorage.getItem("scoutify_token");
}

function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (currentToken()) headers.Authorization = `Bearer ${currentToken()}`;
  return fetch(`${apiBase}${path}`, { ...options, headers }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    return data;
  });
}

async function loadMessagesFromServer() {
  try {
    const serverMessages = await apiRequest("/messages");
    if (!Array.isArray(serverMessages)) return;

    const merged = { ...readMessages() };
    serverMessages.forEach((message) => {
      const partnerId = message.from === getCurrentUser().id ? message.to : message.from;
      const key = partnerId || activeId;
      const item = {
        from: message.from === getCurrentUser().id ? "me" : "them",
        text: message.text,
        time: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      merged[key] = [...(merged[key] || []), item];
    });
    writeMessages(merged);
  } catch (error) {
    console.warn("Server messages unavailable; using local messages only.", error.message);
  }
}

function getConversationMessages(chatId) {
  const saved = readMessages();
  return saved[chatId] || [];
}

function renderConversations(filter = "") {
  const query = filter.toLowerCase();
  const list = conversations.filter((chat) => `${chat.name} ${chat.preview}`.toLowerCase().includes(query));

  document.getElementById("conversationList").innerHTML = list.map((chat) => {
    const messages = getConversationMessages(chat.id);
    const preview = messages[messages.length - 1]?.text || chat.preview;
    const lastTime = messages[messages.length - 1]?.time || chat.time;
    return `<button class="conversation ${chat.id === activeId ? "active" : ""}" data-chat="${chat.id}"><span class="dm-avatar ${chat.color}">${chat.avatar}</span><span class="conversation-copy"><strong>${chat.name}</strong><small>${preview}</small></span><time>${lastTime}</time></button>`;
  }).join("") || "<p class='empty-state'>No conversations found.</p>";

  document.querySelectorAll("[data-chat]").forEach((button) => button.addEventListener("click", () => { activeId = button.dataset.chat; renderConversations(document.getElementById("conversationSearch").value); renderChat(); }));
}

function renderChat() {
  const chat = conversations.find((item) => item.id === activeId) || conversations[0];
  const messages = getConversationMessages(chat.id);
  document.getElementById("activeAvatar").className = `dm-avatar ${chat.color}`;
  document.getElementById("activeAvatar").textContent = chat.avatar;
  document.getElementById("activeName").textContent = chat.name;
  document.getElementById("activeMeta").textContent = `${chat.role} · Active now`;
  document.getElementById("chatInput").placeholder = `Message ${chat.name}...`;
  document.getElementById("chatMessages").innerHTML = `<div class="chat-day">Today</div>${messages.map((message) => `<div class="bubble-row ${message.from === "me" ? "mine" : ""}"><div class="chat-bubble">${message.text}<time>${message.time}</time></div></div>`).join("")}`;
  const messagesBox = document.getElementById("chatMessages");
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

document.getElementById("conversationSearch").addEventListener("input", (event) => renderConversations(event.target.value));
document.getElementById("chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  try {
    await apiRequest("/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: activeId, text })
    });
  } catch (error) {
    console.warn("API message send failed, storing locally instead.", error.message);
    const messages = readMessages();
    messages[activeId] = [...(messages[activeId] || []), { from: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }];
    writeMessages(messages);
  }

  input.value = "";
  await loadMessagesFromServer();
  renderConversations(document.getElementById("conversationSearch").value);
  renderChat();
});

document.getElementById("newChatButton").addEventListener("click", () => document.getElementById("conversationSearch").focus());
(async function initMessages() {
  await loadMessagesFromServer();
  renderConversations();
  renderChat();
})();