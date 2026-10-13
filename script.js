// Tiny star field for a dreamy birthday-night effect.
const stars = document.getElementById("stars");
if (stars) {
  const symbols = ["✦", "·", "✧", "⋆"];
  for (let i = 0; i < 48; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.fontSize = `${8 + Math.random() * 13}px`;
    star.style.setProperty("--duration", `${3 + Math.random() * 5}s`);
    star.style.animationDelay = `${Math.random() * -8}s`;
    stars.appendChild(star);
  }
}

// Countdown to the next October 29 (works again next year, too).
function updateCountdown() {
  const now = new Date();
  let year = now.getFullYear();
  let birthday = new Date(year, 9, 29, 0, 0, 0); // Month 9 = October
  if (now >= birthday) birthday = new Date(year + 1, 9, 29, 0, 0, 0);
  const distance = Math.max(0, birthday.getTime() - now.getTime());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);
  const put = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value).padStart(2, "0");
  };
  put("days", days);
  put("hours", hours);
  put("minutes", minutes);
  put("seconds", seconds);
  const note = document.getElementById("countdownNote");
  if (note) note.textContent = days === 0 && hours === 0 && minutes === 0
    ? "IT’S YOUR DAY, CRYSTAL! Happy birthday! ✨"
    : "October 29 deserves its own little universe. ✨";
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal sections on scroll, with a graceful fallback for older browsers.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Detect when photos/videos have actually been added, and keep the pretty placeholder otherwise.
document.querySelectorAll(".memory-card").forEach(card => {
  const image = card.querySelector("img");
  const video = card.querySelector("video");
  if (image) {
    const checkImage = () => card.classList.toggle("has-media", image.complete && image.naturalWidth > 0);
    image.addEventListener("load", checkImage);
    image.addEventListener("error", checkImage);
    checkImage();
  }
  if (video) {
    const source = video.querySelector("source");
    if (source) {
      video.addEventListener("loadedmetadata", () => card.classList.add("has-media"));
      video.addEventListener("error", () => card.classList.remove("has-media"));
      // Avoid downloading the whole video just to make the thumbnail.
      video.load();
    }
  }
});

// Tap/click a memory to view it in the lightbox.
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const closeLightboxButton = document.getElementById("lightboxClose");
function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxContent.replaceChildren(); // Stops video playback when closing.
}
document.querySelectorAll(".memory-card").forEach(card => {
  card.addEventListener("click", () => {
    const kind = card.dataset.kind;
    const path = card.dataset.media;
    lightboxContent.replaceChildren();
    let media;
    if (kind === "video") {
      media = document.createElement("video");
      media.controls = true;
      media.autoplay = true;
      media.playsInline = true;
      media.src = path;
    } else {
      media = document.createElement("img");
      media.src = path;
      media.alt = card.querySelector("img")?.alt || "Birthday memory";
    }
    media.addEventListener("error", () => {
      closeLightbox();
      showToast(`Add your file at ${path} to use this memory slot.`);
    }, { once: true });
    lightboxContent.appendChild(media);
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeLightboxButton.focus();
  });
});
closeLightboxButton.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
});

// Sprinkle celebratory confetti when the surprise buttons are tapped.
const confettiLayer = document.getElementById("confettiLayer");
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function celebrate() {
  const colours = ["#ff8fc8", "#8ecbff", "#bda0ff", "#ffe2f1", "#a8f0e0", "#f8c6ff"];
  for (let i = 0; i < 85; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colours[Math.floor(Math.random() * colours.length)];
    piece.style.setProperty("--fall-duration", `${2 + Math.random() * 2.4}s`);
    piece.style.setProperty("--drift", `${Math.round((Math.random() - 0.5) * 230)}px`);
    piece.style.animationDelay = `${Math.random() * .45}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
  showToast("A little extra sparkle for you, Crystal! ✨💗");
}
document.getElementById("celebrateButton").addEventListener("click", celebrate);
document.getElementById("finalCelebrate").addEventListener("click", celebrate);

document.getElementById("year")?.append(String(new Date().getFullYear()));

/* ===== CRYSTAL'S BIRTHDAY MUSIC PLAYER ===== */

const birthdayAudio = document.getElementById("birthdayAudio");
const musicPlayBtn = document.getElementById("musicPlayBtn");
const musicStatus = document.getElementById("musicStatus");
const musicProgress = document.getElementById("musicProgress");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
const birthdayPlayer = document.getElementById("birthdayPlayer");

// Format seconds as minutes:seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Play or pause music
musicPlayBtn.addEventListener("click", async () => {
    if (birthdayAudio.paused) {
        try {
            await birthdayAudio.play();
        } catch (error) {
            musicStatus.textContent =
                "Couldn't play audio — check the file path";
            console.error("Audio playback error:", error);
        }
    } else {
        birthdayAudio.pause();
    }
});

// Update button and animation
birthdayAudio.addEventListener("play", () => {
    musicPlayBtn.textContent = "Ⅱ";
    musicPlayBtn.setAttribute("aria-label", "Pause music");
    musicStatus.textContent = "Now playing for Crystal ♡";
    birthdayPlayer.classList.add("playing");
});

birthdayAudio.addEventListener("pause", () => {
    musicPlayBtn.textContent = "▶";
    musicPlayBtn.setAttribute("aria-label", "Play music");
    musicStatus.textContent = "Paused";
    birthdayPlayer.classList.remove("playing");
});

// Display song duration
birthdayAudio.addEventListener("loadedmetadata", () => {
    durationLabel.textContent = formatTime(birthdayAudio.duration);
});

// Update progress while the music plays
birthdayAudio.addEventListener("timeupdate", () => {
    currentTimeLabel.textContent = formatTime(birthdayAudio.currentTime);

    const progress = birthdayAudio.duration
        ? (birthdayAudio.currentTime / birthdayAudio.duration) * 100
        : 0;

    musicProgress.style.width = `${progress}%`;
});

// Handle missing or unsupported audio
birthdayAudio.addEventListener("error", () => {
    musicStatus.textContent = "Audio unavailable — check your MP3";
});