
document.addEventListener("DOMContentLoaded", () => {
  const chapters = [...document.querySelectorAll(".chapter")];
  const backButton = document.getElementById("backButton");
  const nextButton = document.getElementById("nextButton");
  const counter = document.getElementById("chapterCounter");
  const dots = [...document.querySelectorAll(".chapter-dots .dot")];
  const gallery = document.getElementById("photoGallery");
  const bgMusic = document.getElementById("bgMusic");

  let currentChapter = 0;
  let currentSong = "";
  let musicUnlocked = false;
  let currentPhoto = 1;

  const totalPhotos = 42;
  const songs = [
    "song1.mp3",
    "song2.mp3",
    "song3.mp3",
    "song4.mp3",
    "song5.mp3"
  ];

  const PHOTO_EXTENSION = "jpg";

  // STAR FIELD
  const starField = document.getElementById("starField");

  if (starField) {
    for (let i = 0; i < 95; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
      star.style.animationDelay = `${Math.random() * 4}s`;
      starField.appendChild(star);
    }
  }

  // FLOATING HEARTS AND PETALS
  const decor = document.getElementById("floatingDecor");

  function createFloatingDecor() {
    if (!decor) return;

    const item = document.createElement("span");
    const isHeart = Math.random() > 0.35;

    item.className = isHeart ? "floating-heart" : "floating-petal";
    item.textContent = isHeart
      ? ["♡", "♥", "ღ", "💗"][Math.floor(Math.random() * 4)]
      : ["✿", "❀", "🌸"][Math.floor(Math.random() * 3)];

    item.style.left = `${Math.random() * 100}%`;
    item.style.fontSize = `${12 + Math.random() * 19}px`;
    item.style.setProperty("--float-duration", `${7 + Math.random() * 7}s`);
    item.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);

    decor.appendChild(item);
    window.setTimeout(() => item.remove(), 15000);
  }

  window.setInterval(createFloatingDecor, 650);

  // 42 PHOTO GALLERY
  const photoCards = [];

  if (gallery) {
    gallery.replaceChildren();

    for (let i = 1; i <= totalPhotos; i++) {
      const card = document.createElement("div");
      card.className = "photo-card";
      card.style.setProperty("--delay", `${(i % 12) * 45}ms`);

      const img = document.createElement("img");
      img.src = `${i}.${PHOTO_EXTENSION}`;
      img.alt = `Lakshita memory ${i}`;
      img.loading = i <= 8 ? "eager" : "lazy";
      img.decoding = "async";

      img.addEventListener("click", () => openPhoto(i));

      img.addEventListener("error", () => {
        card.replaceChildren();

        const message = document.createElement("div");
        message.className = "photo-error";
        message.textContent =
          `Photo ${i} couldn't load 💗 Check ${i}.${PHOTO_EXTENSION}`;

        card.appendChild(message);
        console.warn(`Photo not found: ${i}.${PHOTO_EXTENSION}`);
      }, { once: true });

      card.appendChild(img);
      gallery.appendChild(card);
      photoCards.push(img);
    }
  }

  // BACKGROUND MUSIC
  if (bgMusic) {
    bgMusic.loop = true;
    bgMusic.volume = 0.65;
    bgMusic.preload = "auto";
  }

  function playCurrentSong() {
    if (!bgMusic || !currentSong) return;

    bgMusic.play().catch(() => {
      // Browsers can require a user gesture before audio playback.
    });
  }

  function changeSong(index) {
    const filename = songs[index];
    if (!filename || !bgMusic) return;

    if (filename === currentSong) {
      if (musicUnlocked) playCurrentSong();
      return;
    }

    currentSong = filename;
    bgMusic.src = filename;
    bgMusic.load();
    playCurrentSong();
  }

  changeSong(0);

  function unlockMusic() {
    if (musicUnlocked) return;
    musicUnlocked = true;
    playCurrentSong();
  }

  document.addEventListener("pointerdown", unlockMusic, { once: true });
  document.addEventListener("keydown", unlockMusic, { once: true });

  // =========================================
  // PAGE NAVIGATION
  // =========================================

  function showChapter(index) {
    if (!chapters.length) return;

    currentChapter = Math.max(
      0,
      Math.min(chapters.length - 1, index)
    );

    chapters.forEach((chapter, i) => {
      const active = i === currentChapter;

      chapter.classList.toggle("active", active);
      chapter.setAttribute("aria-hidden", String(!active));

      if (active) chapter.scrollTop = 0;
    });

    if (counter) {
      counter.textContent =
        `Chapter ${currentChapter + 1} of ${chapters.length}`;
    }

    if (backButton) backButton.disabled = currentChapter === 0;
    if (nextButton) {
      nextButton.disabled = currentChapter === chapters.length - 1;
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentChapter);
    });

    changeSong(currentChapter);

    // Start fireworks only on the last chapter.
    if (currentChapter === 4) {
      startFireworks();
    } else {
      stopFireworks();
    }
  }

  backButton?.addEventListener("click", () => {
    showChapter(currentChapter - 1);
  });

  nextButton?.addEventListener("click", () => {
    showChapter(currentChapter + 1);
  });

  // VIRTUAL HUG
  const hugButton = document.getElementById("hugButton");
  const hugMessage = document.getElementById("hugMessage");

  if (hugButton && hugMessage) {
    hugButton.addEventListener("click", () => {
      hugMessage.textContent =
        "HUUUUGGGGG!!! 🧸💗 Imagine your Rishuuu holding you close and sending a million kisses! 💋";

      for (let i = 0; i < 18; i++) {
        window.setTimeout(createFloatingDecor, i * 55);
      }
    });
  }

  // PHOTO LIGHTBOX
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = document.getElementById("closeLightbox");
  const previousPhoto = document.getElementById("previousPhoto");
  const nextPhoto = document.getElementById("nextPhoto");

  function openPhoto(number) {
    if (!lightbox || !lightboxImage) return;

    currentPhoto = number;
    updateLightbox();
    lightbox.hidden = false;
  }

  function updateLightbox() {
    if (!lightboxImage) return;

    lightboxImage.src = `${currentPhoto}.${PHOTO_EXTENSION}`;
    lightboxImage.alt = `Lakshita memory ${currentPhoto}`;
  }

  function closePhoto() {
    if (!lightbox || !lightboxImage) return;

    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
  }

  function movePhoto(amount) {
    currentPhoto =
      ((currentPhoto - 1 + amount + totalPhotos) % totalPhotos) + 1;

    updateLightbox();
  }

  closeLightbox?.addEventListener("click", closePhoto);
  previousPhoto?.addEventListener("click", () => movePhoto(-1));
  nextPhoto?.addEventListener("click", () => movePhoto(1));

  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closePhoto();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
  });

  // =========================================
  // PAGE 5 — OPTIMIZED FIREWORKS FINALE 🎆
  // =========================================

  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas?.getContext("2d");
  const fireworksButton = document.getElementById("fireworksButton");

  let fireworksAnimation = 0;
  let fireworks = [];
  let lastFireworksTime = 0;
  let fireworksRunning = false;
  let launchClock = 0;
  let lastResizeWidth = 0;
  let lastResizeHeight = 0;

  const MAX_PARTICLES = 320;
  const MAX_BURSTS_PER_CLICK = 5;
  const FIREWORK_COLORS = [
    "#ff4da6", "#ffd166", "#ffffff",
    "#c084fc", "#ff6b6b", "#7df9ff"
  ];

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    lastResizeWidth = rect.width || window.innerWidth;
    lastResizeHeight = rect.height || window.innerHeight;

    canvas.width = Math.max(1, Math.round(lastResizeWidth * dpr));
    canvas.height = Math.max(1, Math.round(lastResizeHeight * dpr));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function launchFireworks(count = 4) {
    if (!canvas || !ctx || !fireworksRunning) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    const burstCount = Math.min(count, MAX_BURSTS_PER_CLICK);

    for (let burst = 0; burst < burstCount; burst++) {
      const remaining = MAX_PARTICLES - fireworks.length;
      if (remaining <= 0) break;

      const x = Math.random() * width;
      const y = 40 + Math.random() * height * 0.58;
      const hue =
        FIREWORK_COLORS[
          Math.floor(Math.random() * FIREWORK_COLORS.length)
        ];

      const particleCount = Math.min(
        32 + Math.floor(Math.random() * 15),
        remaining
      );

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.1 + Math.random() * 3.7;

        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 48 + Math.random() * 25,
          maxLife: 73,
          color: hue,
          size: 1.2 + Math.random() * 1.8
        });
      }
    }

    // Start exactly one animation loop.
    if (!fireworksAnimation) {
      lastFireworksTime = 0;
      fireworksAnimation = requestAnimationFrame(drawFireworks);
    }
  }

  function drawFireworks(time) {
    fireworksAnimation = 0;

    if (!fireworksRunning || !ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const delta = lastFireworksTime
      ? Math.min((time - lastFireworksTime) / 16.67, 2)
      : 1;

    lastFireworksTime = time;

    ctx.clearRect(0, 0, rect.width, rect.height);

    for (let i = fireworks.length - 1; i >= 0; i--) {
      const particle = fireworks[i];

      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 0.035 * delta;
      particle.vx *= Math.pow(0.99, delta);
      particle.life -= delta;

      if (particle.life <= 0) {
        fireworks.splice(i, 1);
        continue;
      }

      const alpha = Math.max(
        0,
        Math.min(1, particle.life / particle.maxLife)
      );

      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (fireworks.length > 0 || fireworksRunning) {
      fireworksAnimation = requestAnimationFrame(drawFireworks);
    }
  }

  function startFireworks() {
    if (!canvas || !ctx || fireworksRunning || document.hidden) return;

    fireworksRunning = true;
    launchClock = 0;
    lastFireworksTime = 0;

    resizeCanvas();

    // A small opening show instead of two enormous bursts.
    launchFireworks(3);

    window.setTimeout(() => {
      if (fireworksRunning) launchFireworks(2);
    }, 500);

    // Controlled periodic launches while Page 5 is open.
    const launchLoop = () => {
      if (!fireworksRunning) return;

      launchClock += 1;

      if (launchClock >= 48) {
        launchClock = 0;
        launchFireworks(2);
      }

      window.setTimeout(launchLoop, 100);
    };

    window.setTimeout(launchLoop, 100);
  }

  function stopFireworks() {
    fireworksRunning = false;

    if (fireworksAnimation) {
      cancelAnimationFrame(fireworksAnimation);
      fireworksAnimation = 0;
    }

    fireworks.length = 0;
    lastFireworksTime = 0;
    launchClock = 0;

    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
    }
  }

  // Manual button: add a burst without creating another loop.
  fireworksButton?.addEventListener("click", () => {
    if (!fireworksRunning) {
      startFireworks();
    } else {
      launchFireworks(4);
    }
  });

  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopFireworks();
    } else if (currentChapter === 4) {
      startFireworks();
    }
  });

  // INITIALIZE
  showChapter(0);
});
