
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
  let fireworksAnimation = 0;
  let fireworks = [];
  let lastFireworksTime = 0;

  const totalPhotos = 42;
  const songs = [
    "song1.mp3",
    "song2.mp3",
    "song3.mp3",
    "song4.mp3",
    "song5.mp3"
  ];

  // Change this if your real files use .png, .webp, etc.
  const PHOTO_EXTENSION = "jpg";

  // Create the starry background.
  const starField = document.getElementById("starField");

  for (let i = 0; i < 95; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
    star.style.animationDelay = `${Math.random() * 4}s`;
    starField.appendChild(star);
  }

  // Floating hearts and petals continue throughout the chapters.
  const decor = document.getElementById("floatingDecor");

  function createFloatingDecor() {
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

  // Generate 42 photos from the MAIN repository folder.
  // Expected names: 1.jpg, 2.jpg ... 42.jpg.
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

        const errorMessage = document.createElement("div");
        errorMessage.className = "photo-error";
        errorMessage.textContent =
          `Photo ${i} couldn't load 💗 Check ${i}.${PHOTO_EXTENSION}`;

        card.appendChild(errorMessage);
        console.warn(`Photo not found: ${i}.${PHOTO_EXTENSION}`);
      }, { once: true });

      card.appendChild(img);
      gallery.appendChild(card);
      photoCards.push(img);
    }
  }

  // Music: browsers may block sound until the visitor interacts.
  bgMusic.loop = true;
  bgMusic.volume = 0.65;
  bgMusic.preload = "auto";

  function playCurrentSong() {
    if (!currentSong) return;

    bgMusic.play().catch(() => {
      // A user gesture may be required by the browser.
    });
  }

  function changeSong(index) {
    const filename = songs[index];
    if (!filename || filename === currentSong) {
      if (musicUnlocked) playCurrentSong();
      return;
    }

    currentSong = filename;
    bgMusic.src = filename;
    bgMusic.load();

    // Attempt autoplay when entering each chapter.
    playCurrentSong();
  }

  // Attempt autoplay on initial load.
  changeSong(0);

  // If autoplay was blocked, start after the first user interaction.
  function unlockMusic() {
    if (musicUnlocked) return;
    musicUnlocked = true;
    playCurrentSong();
  }

  document.addEventListener("pointerdown", unlockMusic, { once: true });
  document.addEventListener("keydown", unlockMusic, { once: true });

  // Chapter navigation.
  function showChapter(index) {
    currentChapter = Math.max(0, Math.min(chapters.length - 1, index));

    chapters.forEach((chapter, i) => {
      const active = i === currentChapter;
      chapter.classList.toggle("active", active);
      chapter.setAttribute("aria-hidden", String(!active));

      if (active) chapter.scrollTop = 0;
    });

    counter.textContent = `Chapter ${currentChapter + 1} of ${chapters.length}`;
    backButton.disabled = currentChapter === 0;
    nextButton.disabled = currentChapter === chapters.length - 1;

    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentChapter));

    changeSong(currentChapter);

    if (currentChapter === 4) {
      window.setTimeout(() => launchFireworks(8), 300);
      window.setTimeout(() => launchFireworks(8), 1400);
    }
  }

  backButton.addEventListener("click", () => showChapter(currentChapter - 1));
  nextButton.addEventListener("click", () => showChapter(currentChapter + 1));

  // Virtual hug button.
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

  // Photo lightbox.
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = document.getElementById("closeLightbox");
  const previousPhoto = document.getElementById("previousPhoto");
  const nextPhoto = document.getElementById("nextPhoto");

  function openPhoto(number) {
    currentPhoto = number;
    updateLightbox();
    lightbox.hidden = false;
  }

  function updateLightbox() {
    lightboxImage.src = `${currentPhoto}.${PHOTO_EXTENSION}`;
    lightboxImage.alt = `Lakshita memory ${currentPhoto}`;
  }

  function closePhoto() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
  }

  function movePhoto(amount) {
    currentPhoto =
      ((currentPhoto - 1 + amount + totalPhotos) % totalPhotos) + 1;
    updateLightbox();
  }

  closeLightbox.addEventListener("click", closePhoto);
  previousPhoto.addEventListener("click", () => movePhoto(-1));
  nextPhoto.addEventListener("click", () => movePhoto(1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closePhoto();
  });

  document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
  });

  // Fireworks for the final anniversary chapter.
  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");
  const fireworksButton = document.getElementById("fireworksButton");

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function launchFireworks(count = 5) {
    const rect = canvas.getBoundingClientRect();

    for (let burst = 0; burst < count; burst++) {
      const x = Math.random() * rect.width;
      const y = 40 + Math.random() * rect.height * 0.62;
      const hue = 285 + Math.random() * 70;
      const particleCount = 35 + Math.floor(Math.random() * 24);

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.1 + Math.random() * 4.2;

        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 50 + Math.random() * 35,
          maxLife: 85,
          hue: hue + Math.random() * 25,
          size: 1.3 + Math.random() * 2.1
        });
      }
    }

    if (!fireworksAnimation) {
      lastFireworksTime = 0;
      fireworksAnimation = requestAnimationFrame(drawFireworks);
    }
  }

  function drawFireworks(time) {
    fireworksAnimation = 0;

    const rect = canvas.getBoundingClientRect();
    const delta = lastFireworksTime ? Math.min((time - lastFireworksTime) / 16.67, 2) : 1;
    lastFireworksTime = time;

    ctx.clearRect(0, 0, rect.width, rect.height);

    fireworks = fireworks.filter(particle => particle.life > 0);

    for (const particle of fireworks) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 0.035 * delta;
      particle.vx *= 0.99;
      particle.life -= delta;

      const alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.beginPath();
      ctx.fillStyle = `hsla(${particle.hue}, 100%, 75%, ${alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${particle.hue}, 100%, 70%, ${alpha})`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    if (fireworks.length > 0) {
      fireworksAnimation = requestAnimationFrame(drawFireworks);
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
      lastFireworksTime = 0;
    }
  }

  if (fireworksButton) {
    fireworksButton.addEventListener("click", () => launchFireworks(12));
  }

  // Begin with the first chapter.
  showChapter(0);
});
