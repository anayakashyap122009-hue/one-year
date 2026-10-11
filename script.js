
"use strict";

// ===== CONFIGURATION =====
const TOTAL_PHOTOS = 42;
const PHOTO_EXTENSION = "jpg";

const captions = [
  "My beautiful girl 💗", "That lovely smile 🌸",
  "My favourite face 🥹", "A little piece of magic ✨",
  "My pretty babby 💕", "The girl of my dreams 🌙",
  "My sunshine ☀️", "Too cute for this universe 🪐",
  "My favourite human 🫶", "A whole heart of love 💌",
  "My sweet Lakshita 🌷", "Beautiful inside and out 💖",
  "My reason to smile 😊", "Cutie forever 🎀",
  "My lovely girl 🌹", "The prettiest soul 🦋",
  "My happiness 💗", "A face I'll never tire of 🥹",
  "My princess 👑", "My favourite view 🌸",
  "A little angel 😇", "My heart's favourite 💞",
  "Simply unforgettable ✨", "My gorgeous girl 💋",
  "A dream come true 🌙", "My sweetest blessing 🫶",
  "My adorable babby 🧸", "The glow in my universe 🌟",
  "My forever favourite 💗", "A thousand butterflies 🦋",
  "My lovely sweetheart 💕", "Prettiness overload 🎀",
  "My world in one picture 🌎", "A smile worth a million stars ✨",
  "My one and only 💌", "My little moon 🌙",
  "My favourite kind of magic 🪄", "The sweetest girl ever 🌷",
  "My beautiful Lakshita 💖", "A memory to treasure 📸",
  "My heart, always 💗", "Forever special to me ♾️"
];

// ===== CHAPTER NAVIGATION =====
const chapters = [...document.querySelectorAll(".chapter")];
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const chapterCount = document.getElementById("chapterCount");
const dots = [...document.querySelectorAll(".dot")];
const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

let currentChapter = 0;
let currentSong = "";
let musicStartedByUser = false;

function showChapter(index) {
  if (index < 0 || index >= chapters.length) return;

  currentChapter = index;

  chapters.forEach((chapter, i) => {
    chapter.classList.toggle("active", i === index);
    chapter.setAttribute("aria-hidden", String(i !== index));
  });

  chapterCount.textContent =
    `Chapter ${index + 1} of ${chapters.length}`;

  backButton.disabled = index === 0;
  nextButton.disabled = false;
  nextButton.textContent =
    index === chapters.length - 1 ? "Start again ↻" : "Next →";

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  chapters[index].scrollTop = 0;

  changeSong(chapters[index].dataset.song);

  // Tell the fireworks system that the active chapter has changed.
  window.dispatchEvent(new Event("chapterchange"));
}

function nextChapter() {
  if (currentChapter === chapters.length - 1) {
    showChapter(0);
  } else {
    showChapter(currentChapter + 1);
  }
}

function previousChapter() {
  if (currentChapter > 0) {
    showChapter(currentChapter - 1);
  }
}

backButton.addEventListener("click", previousChapter);
nextButton.addEventListener("click", nextChapter);

// ===== FIVE SONGS =====
function changeSong(filename) {
  if (!filename || filename === currentSong) return;

  currentSong = filename;
  bgMusic.pause();
  bgMusic.src = filename;
  bgMusic.load();

  if (musicStartedByUser) {
    bgMusic.play()
      .then(updateMusicButton)
      .catch(() => {
        musicButton.textContent = "♫ Tap to play";
      });
  } else {
    musicButton.textContent = "♫ Play music";
  }
}

function updateMusicButton() {
  musicButton.textContent = bgMusic.paused
    ? "♫ Play music"
    : "♫ Music on";
}

musicButton.addEventListener("click", async () => {
  if (!bgMusic.paused) {
    bgMusic.pause();
    updateMusicButton();
    return;
  }

  musicStartedByUser = true;

  try {
    await bgMusic.play();
    updateMusicButton();
  } catch (error) {
    musicButton.textContent = "♫ Try again";
  }
});

bgMusic.addEventListener("play", updateMusicButton);
bgMusic.addEventListener("pause", updateMusicButton);

// ===== BUILD ALL 42 PHOTOS =====
const gallery = document.getElementById("gallery");

for (let i = 1; i <= TOTAL_PHOTOS; i++) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "photo-card";
  card.setAttribute("aria-label", `View photo ${i}`);

  const img = document.createElement("img");
  img.src = `photos/${i}.${PHOTO_EXTENSION}`;
  img.alt = captions[i - 1];
  img.loading = "lazy";
  img.decoding = "async";

  const caption = document.createElement("span");
  caption.className = "photo-caption";
  caption.textContent = captions[i - 1];

  img.addEventListener("error", () => {
    img.style.display = "none";

    const placeholder = document.createElement("div");
    placeholder.className = "photo-placeholder";
    placeholder.textContent = `Please add ${i}.${PHOTO_EXTENSION}`;
    placeholder.style.cssText =
      "aspect-ratio:3/4;display:grid;place-items:center;" +
      "padding:10px;background:#efd1e7;color:#71385f;" +
      "border-radius:7px;font-size:12px;text-align:center;";

    card.insertBefore(placeholder, caption);
  });

  card.append(img, caption);
  card.addEventListener("click", () => openPhoto(i));
  gallery.appendChild(card);
}

// ===== PHOTO LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

let currentPhoto = 1;

function openPhoto(number) {
  currentPhoto = number;
  updateLightbox();
  lightbox.hidden = false;
  document.getElementById("closeLightbox").focus();
}

function updateLightbox() {
  lightboxImage.src =
    `photos/${currentPhoto}.${PHOTO_EXTENSION}`;
  lightboxImage.alt = captions[currentPhoto - 1];
  lightboxCaption.textContent =
    `${currentPhoto} / ${TOTAL_PHOTOS} — ${captions[currentPhoto - 1]}`;
}

function closePhoto() {
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
}

function movePhoto(direction) {
  currentPhoto =
    ((currentPhoto - 1 + direction + TOTAL_PHOTOS) %
      TOTAL_PHOTOS) + 1;
  updateLightbox();
}

document.getElementById("closeLightbox")
  .addEventListener("click", closePhoto);

document.getElementById("previousPhoto")
  .addEventListener("click", () => movePhoto(-1));

document.getElementById("nextPhoto")
  .addEventListener("click", () => movePhoto(1));

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closePhoto();
});

document.addEventListener("keydown", event => {
  if (!lightbox.hidden) {
    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
  } else if (event.key === "ArrowRight") {
    nextChapter();
  } else if (event.key === "ArrowLeft") {
    previousChapter();
  }
});

// ===== VIRTUAL HUG =====
document.getElementById("hugButton")
  .addEventListener("click", () => {
    document.getElementById("hugMessage").hidden = false;
    document.getElementById("hugButton").textContent =
      "BIGGEST HUGGG DELIVERED! 💗";

    for (let i = 0; i < 16; i++) {
      createFloatingHeart();
    }
  });

// ===== FLOATING HEARTS =====
const floatingHearts = document.getElementById("floatingHearts");

function createFloatingHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = ["♥", "♡", "💗", "✧"][
    Math.floor(Math.random() * 4)
  ];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 19}px`;
  heart.style.animationDuration = `${5 + Math.random() * 5}s`;

  floatingHearts.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

const heartTimer = window.setInterval(createFloatingHeart, 1100);

// ===== FINALE CONFETTI =====
const confettiBox = document.getElementById("finaleConfetti");
const confettiColors = [
  "#ffd76a", "#ff70b8", "#ffffff",
  "#cba4ff", "#7cf6ff", "#ff9d65"
];

let confettiTimer = null;

function createConfettiBurst(amount = 65) {
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.animationDuration = `${3 + Math.random() * 3}s`;
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiBox.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function startConfetti() {
  if (confettiTimer) return;

  createConfettiBurst(85);
  confettiTimer = window.setInterval(() => {
    if (confettiBox.childElementCount < 150) {
      createConfettiBurst(25);
    }
  }, 1800);
}

function stopConfetti() {
  if (confettiTimer) {
    clearInterval(confettiTimer);
    confettiTimer = null;
  }
  confettiBox.replaceChildren();
}

// ===== REAL PARTICLE FIREWORKS =====
const canvas = document.getElementById("fireworksCanvas");
const fireworksButton = document.getElementById("fireworksButton");
const chapter5 = document.getElementById("chapter5");
const ctx = canvas.getContext("2d");

let canvasWidth = 0;
let canvasHeight = 0;
let fireworksRunning = false;
let animationFrame = 0;
let lastAutomaticLaunch = 0;
let lastManualLaunch = 0;
let automaticShowTimer = null;

const rockets = [];
const particles = [];
const fireworkColors = [
  "#ffd76a", "#ff70b8", "#ffffff",
  "#cba4ff", "#7cf6ff", "#ff9d65"
];

function resizeCanvas() {
  const rect = chapter5.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvasWidth = rect.width;
  canvasHeight = rect.height;

  canvas.width = Math.round(canvasWidth * ratio);
  canvas.height = Math.round(canvasHeight * ratio);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function launchRocket(x, targetY) {
  rockets.push({
    x: x ?? randomBetween(canvasWidth * 0.08, canvasWidth * 0.92),
    y: canvasHeight + 5,
    targetY: targetY ?? randomBetween(canvasHeight * 0.12, canvasHeight * 0.52),
    speed: randomBetween(4.5, 7.3),
    color: fireworkColors[
      Math.floor(Math.random() * fireworkColors.length)
    ]
  });
}

function explode(x, y, color) {
  const count = Math.round(randomBetween(55, 90));

  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * i / count + randomBetween(-0.05, 0.05);
    const speed = randomBetween(1.1, 5);

    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: randomBetween(0.018, 0.055),
      alpha: 1,
      decay: randomBetween(0.009, 0.018),
      radius: randomBetween(1.1, 2.7),
      color: Math.random() < 0.25
        ? fireworkColors[Math.floor(Math.random() * fireworkColors.length)]
        : color
    });
  }
}

function grandFireworksShow() {
  if (!fireworksRunning) return;

  // A colorful row of explosions.
  for (let i = 0; i < 7; i++) {
    const x = canvasWidth * (0.08 + i * 0.14);
    const y = randomBetween(canvasHeight * 0.12, canvasHeight * 0.48);

    window.setTimeout(() => {
      if (fireworksRunning) {
        explode(x + randomBetween(-12, 12), y, fireworkColors[i % fireworkColors.length]);
      }
    }, i * 170);
  }

  // A second wave of rockets.
  window.setTimeout(() => {
    if (!fireworksRunning) return;

    for (let i = 0; i < 5; i++) {
      launchRocket(
        randomBetween(canvasWidth * 0.1, canvasWidth * 0.9),
        randomBetween(canvasHeight * 0.12, canvasHeight * 0.43)
      );
    }
  }, 500);
}

function animateFireworks(now) {
  if (!fireworksRunning) return;

  // Fade trails rather than clearing the entire canvas each frame.
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(8, 3, 19, 0.19)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalCompositeOperation = "lighter";

  // Gentle automatic fireworks between the grand bursts.
  if (now - lastAutomaticLaunch > 1300) {
    launchRocket();
    lastAutomaticLaunch = now;
  }

  for (let i = rockets.length - 1; i >= 0; i--) {
    const rocket = rockets[i];
    rocket.y -= rocket.speed;

    ctx.beginPath();
    ctx.moveTo(rocket.x, rocket.y + 12);
    ctx.lineTo(rocket.x, rocket.y);
    ctx.strokeStyle = rocket.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (rocket.y <= rocket.targetY) {
      explode(rocket.x, rocket.y, rocket.color);
      rockets.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.992;
    p.vy *= 0.992;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 9;
    ctx.shadowColor = p.color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";

  animationFrame = requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  if (fireworksRunning) return;

  fireworksRunning = true;
  resizeCanvas();
  lastAutomaticLaunch = performance.now();

  animationFrame = requestAnimationFrame(animateFireworks);
  grandFireworksShow();

  automaticShowTimer = window.setInterval(() => {
    if (fireworksRunning) grandFireworksShow();
  }, 4800);
}

function stopFireworks() {
  fireworksRunning = false;
  cancelAnimationFrame(animationFrame);

  if (automaticShowTimer) {
    clearInterval(automaticShowTimer);
    automaticShowTimer = null;
  }

  rockets.length = 0;
  particles.length = 0;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function updateFinale() {
  if (chapter5.classList.contains("active")) {
    startFireworks();
    startConfetti();
  } else {
    stopFireworks();
    stopConfetti();
  }
}

window.addEventListener("chapterchange", updateFinale);

window.addEventListener("resize", () => {
  if (fireworksRunning) resizeCanvas();
});

fireworksButton.addEventListener("click", () => {
  const now = performance.now();

  // Prevent a rapid series of taps from overwhelming a phone.
  if (now - lastManualLaunch < 650) return;
  lastManualLaunch = now;

  if (!fireworksRunning) startFireworks();

  grandFireworksShow();
  createConfettiBurst(75);
});

// ===== REPLAY EVERYTHING FROM THE BEGINNING =====
document.getElementById("replayButton").addEventListener("click", () => {
  showChapter(0);
});

// Start on the first chapter.
showChapter(0);
