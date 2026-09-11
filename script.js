const videos = [
  {
    id: 1,
    title: "Elite football skills session: dribbling and quick feet",
    channel: "GoalZone",
    views: "2.1M",
    age: "3 days ago",
    duration: "12:48",
    category: "Football",
    accent: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80",
    youtubeId: "ScMzIvxBSi4",
    comments: [
      { user: "Ava", text: "This training routine is perfect for youth players chasing more agility." },
      { user: "Dylan", text: "The quick-feet drills are great and easy to repeat in training sessions." },
      { user: "Noah", text: "I need more of this type of football content on my feed." }
    ]
  },
  {
    id: 2,
    title: "Top 10 tactical formations for rising teams",
    channel: "Tactical Edge",
    views: "890K",
    age: "5 days ago",
    duration: "18:22",
    category: "Learning",
    accent: "linear-gradient(135deg, #f59e0b, #ef4444)",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
    youtubeId: "dQw4w9WgXcQ",
    comments: [
      { user: "Mia", text: "Love the breakdown of the 4-3-3 and 3-2-5 transitions." },
      { user: "Leo", text: "Very useful for players learning movement without the ball." },
      { user: "Zoe", text: "That last formation idea could really help a smaller squad." }
    ]
  },
  {
    id: 3,
    title: "Street football showdown: final minute drama",
    channel: "Street Football",
    views: "1.4M",
    age: "1 week ago",
    duration: "9:15",
    category: "Football",
    accent: "linear-gradient(135deg, #22c55e, #16a34a)",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80",
    youtubeId: "ysz5S6PUM-U",
    comments: [
      { user: "Sam", text: "That finish at the end was unreal. Pure composure." },
      { user: "Tariq", text: "The crowd energy in this match makes it feel like a real finals atmosphere." },
      { user: "Jade", text: "This is exactly the kind of content fans want more of." }
    ]
  },
  {
    id: 4,
    title: "Build a high-performance training plan for players",
    channel: "Elite Academy",
    views: "645K",
    age: "2 days ago",
    duration: "15:10",
    category: "Learning",
    accent: "linear-gradient(135deg, #a855f7, #ec4899)",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
    youtubeId: "M7lc1UVf-VE",
    comments: [
      { user: "Emma", text: "The weekly structure is clear and easy to apply with a youth side." },
      { user: "Kai", text: "I appreciate the focus on conditioning without overtraining." },
      { user: "Riley", text: "This would work well for coaches building a full season cycle." }
    ]
  },
  {
    id: 5,
    title: "Inside the life of a football scout",
    channel: "Premier Pulse",
    views: "1.8M",
    age: "6 days ago",
    duration: "11:34",
    category: "News",
    accent: "linear-gradient(135deg, #f43f5e, #f97316)",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80",
    youtubeId: "aqz-KE-bpKQ",
    comments: [
      { user: "Priya", text: "The behind-the-scenes info is really useful for anyone wanting to work in football." },
      { user: "Mason", text: "This gives a realistic look at the process scouts go through every week." },
      { user: "Nathan", text: "The advice on talent spotting and consistency is excellent." }
    ]
  },
  {
    id: 6,
    title: "Gaming night with football fans and live reactions",
    channel: "FanZone",
    views: "523K",
    age: "4 hours ago",
    duration: "7:53",
    category: "Gaming",
    accent: "linear-gradient(135deg, #14b8a6, #0ea5e9)",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    youtubeId: "ysz5S6PUM-U",
    comments: [
      { user: "Hugo", text: "The chat energy is incredible. This is exactly the kind of gaming content fans love." },
      { user: "Ivy", text: "The reactions make the whole stream feel live and personal." },
      { user: "Omar", text: "I came for the football talk and stayed for the community vibe." }
    ]
  },
  {
    id: 7,
    title: "Best football moments from this weekend",
    channel: "Match Feed",
    views: "3.7M",
    age: "1 day ago",
    duration: "14:57",
    category: "Football",
    accent: "linear-gradient(135deg, #f97316, #ef4444)",
    image:
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=900&q=80",
    youtubeId: "ScMzIvxBSi4",
    comments: [
      { user: "Luca", text: "This is a great recap of what was actually exciting this weekend." },
      { user: "Faith", text: "The pace of the highlights is perfect for a quick sports fix." },
      { user: "Jules", text: "This is the kind of clip I keep sending to my football group chat." }
    ]
  },
  {
    id: 8,
    title: "Music mix for intense training sessions",
    channel: "Pulse Studio",
    views: "410K",
    age: "8 hours ago",
    duration: "20:03",
    category: "Music",
    accent: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    youtubeId: "M7lc1UVf-VE",
    comments: [
      { user: "Aiden", text: "Honestly this playlist is amazing for gym and field sessions." },
      { user: "Chloe", text: "The energy level stays high all the way through." },
      { user: "Seth", text: "This mix would be perfect for a team warm-up before a match." }
    ]
  }
];

const categories = ["All", "Football", "Learning", "News", "Gaming", "Music"];
const chipRow = document.getElementById("chipRow");
const videoGrid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const modal = document.getElementById("videoModal");
const modalContent = document.getElementById("modalContent");
const closeModalButton = document.getElementById("closeModal");

function renderChips() {
  chipRow.innerHTML = categories
    .map(
      (category, index) =>
        `<button class="chip ${index === 0 ? "active" : ""}" data-category="${category}">${category}</button>`
    )
    .join("");
}

function renderVideos() {
  const activeCategory = document.querySelector(".chip.active")?.dataset.category || "All";
  const query = searchInput.value.trim().toLowerCase();

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === "All" || video.category === activeCategory;
    const haystack = `${video.title} ${video.channel} ${video.category}`.toLowerCase();
    const matchesSearch = haystack.includes(query);
    return matchesCategory && matchesSearch;
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

  videoGrid.innerHTML = filteredVideos
    .map(
      (video) => `
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
            <button class="more-button" aria-label="More options">⋮</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const target = event.target.closest(".more-button");
      if (target) {
        return;
      }
      const selectedId = Number(card.dataset.videoId);
      openModal(selectedId);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const selectedId = Number(card.dataset.videoId);
        openModal(selectedId);
      }
    });
  });
}

function openModal(videoId) {
  const selectedVideo = videos.find((video) => video.id === videoId);
  if (!selectedVideo) return;

  modalContent.innerHTML = `
    <div class="modal-content">
      <div class="modal-video-wrap">
        <iframe
          src="https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          title="${selectedVideo.title}"
        ></iframe>
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
        <p class="description">
          Discover fresh football insight, elite player development, and standout moments from the current football scene.
          This video brings together coaching ideas, match energy, and content designed to inspire players, scouts, and fans alike.
        </p>
        <div class="comment-list">
          ${selectedVideo.comments
            .map(
              (comment) => `
                <div class="comment-item">
                  <div class="comment-avatar">${comment.user.slice(0, 1)}</div>
                  <div>
                    <div class="comment-user">${comment.user}</div>
                    <div class="comment-body">${comment.text}</div>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

chipRow.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) return;

  document.querySelectorAll(".chip").forEach((button) => button.classList.remove("active"));
  chip.classList.add("active");
  renderVideos();
});

searchInput.addEventListener("input", renderVideos);
document.getElementById("searchBtn").addEventListener("click", renderVideos);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

closeModalButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close='true']")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

renderChips();
renderVideos();
