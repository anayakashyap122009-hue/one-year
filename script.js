
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // OUR FOREVER UNIVERSE 💗
  // Fireworks removed — navigation stays smooth!
  // ==========================================

  const chapters = Array.from(document.querySelectorAll(".chapter"));
  const backButton = document.getElementById("backButton");
  const nextButton = document.getElementById("nextButton");
  const counter = document.getElementById("chapterCounter");
  const dots = Array.from(document.querySelectorAll(".chapter-dots .dot"));
  const photoGallery = document.getElementById("photoGallery");
  const bgMusic = document.getElementById("bgMusic");
  const floatingDecor = document.getElementById("floatingDecor");
  const starField = document.getElementById("starField");

  const hugButton = document.getElementById("hugButton");
  const hugMessage = document.getElementById("hugMessage");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = document.getElementById("closeLightbox");
  const previousPhoto = document.getElementById("previousPhoto");
  const nextPhoto = document.getElementById("nextPhoto");

  let currentChapter = 0;
  let currentPhoto = 0;
  let musicStarted = false;

  const totalChapters = chapters.length;

  // Change these names only if your actual files differ.
  const photos = Array.from(
    { length: 42 },
    (_, index) => `${index + 1}.jpg`
  );

  const songs = [
    "song1.mp3",
    "song2.mp3",
    "song3.mp3",
    "song4.mp3",
    "song5.mp3"
  ];

  const hugMessages = [
    "A biiiggg warm hug for my babbyjaan! 🧸💗",
    "Muaahhh! One forehead kiss and a thousand cuddles! 💋",
    "Your Rishuuu is sending you the softest hug everrr! 🫂💕",
    "Imagine me holding you close and telling you that you matter! 💗",
    "One more huggg, because one is never enough for my cutieee! 🧸",
    "Sending flowers, kisses, and unlimited love to my Lakshitaaa! 🌷💋"
  ];

  // ==========================================
  // FLOATING HEARTS AND FLOWERS
  // ==========================================

  function createFloatingDecor() {
    if (!floatingDecor) return;

    floatingDecor.replaceChildren();

    const decorations = ["♡", "♥", "💕", "🌸", "🌷", "✿", "💗"];

    for (let i = 0; i < 22; i++) {
      const item = document.createElement("span");

      item.className = "floating-item";
      item.textContent =
        decorations[Math.floor(Math.random() * decorations.length)];

      item.style.left = `${Math.random() * 100}%`;
      item.style.animationDelay = `${Math.random() * 15}s`;
      item.style.animationDuration = `${10 + Math.random() * 12}s`;
      item.style.fontSize = `${12 + Math.random() * 18}px`;
      item.style.opacity = `${0.3 + Math.random() * 0.6}`;

      floatingDecor.appendChild(item);
    }
  }

  // ==========================================
  // BACKGROUND STARS
  // ==========================================

  function createStars() {
    if (!starField) return;

    starField.replaceChildren();

    for (let i = 0; i < 65; i++) {
      const star = document.createElement("span");

      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${2 + Math.random() * 4}s`;

      starField.appendChild(star);
    }
  }

  // ==========================================
  // PHOTO GALLERY — 42 PHOTOS
  // ==========================================

  function createGallery() {
    if (!photoGallery) return;

    photoGallery.replaceChildren();

    photos.forEach((filename, index) => {
      const card = document.createElement("button");

      card.type = "button";
      card.className = "photo-card";
      card.setAttribute("aria-label", `Open photo ${index + 1}`);

      const image = document.createElement("img");

      image.src = filename;
      image.alt = `Lakshita memory ${index + 1}`;
      image.loading = index < 6 ? "eager" : "lazy";
      image.decoding = "async";

      image.addEventListener("error", () => {
        card.classList.add("photo-missing");
        card.setAttribute(
          "aria-label",
          `Photo ${index + 1} could not be loaded. Check filename ${filename}`
        );
      });

      card.appendChild(image);

      const number = document.createElement("span");
      number.className = "photo-number";
      number.textContent = `${String(index + 1).padStart(2, "0")} ♡`;

      card.appendChild(number);

      card.addEventListener("click", () => {
        openLightbox(index);
      });

      photoGallery.appendChild(card);
    });
  }

  // ==========================================
  // PHOTO LIGHTBOX
  // ==========================================

  function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;

    currentPhoto = (index + photos.length) % photos.length;

    lightboxImage.src = photos[currentPhoto];
    lightboxImage.alt = `Lakshita memory ${currentPhoto + 1}`;

    lightbox.hidden = false;
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");

    if (closeLightbox) closeLightbox.focus();
  }

  function closePhotoViewer() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
  }

  function changePhoto(direction) {
    currentPhoto =
      (currentPhoto + direction + photos.length) % photos.length;

    if (lightboxImage) {
      lightboxImage.src = photos[currentPhoto];
      lightboxImage.alt = `Lakshita memory ${currentPhoto + 1}`;
    }
  }

  if (closeLightbox) {
    closeLightbox.addEventListener("click", closePhotoViewer);
  }

  if (previousPhoto) {
    previousPhoto.addEventListener("click", () => changePhoto(-1));
  }

  if (nextPhoto) {
    nextPhoto.addEventListener("click", () => changePhoto(1));
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closePhotoViewer();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") {
      closePhotoViewer();
    } else if (event.key === "ArrowLeft") {
      changePhoto(-1);
    } else if (event.key === "ArrowRight") {
      changePhoto(1);
    }
  });

  // ==========================================
  // CHAPTER MUSIC
  // ==========================================

  function playChapterMusic(index) {
    if (!bgMusic || index < 0 || index >= songs.length) return;

    const nextSong = songs[index];
    const currentSong = bgMusic.getAttribute("src");

    if (currentSong !== nextSong) {
      bgMusic.src = nextSong;
      bgMusic.load();
    }

    // Browsers may require a user interaction before audio can play.
    if (musicStarted) {
      bgMusic.play().catch(() => {
        musicStarted = false;
      });
    }
  }

  function startMusicFromInteraction() {
    if (!bgMusic || musicStarted) return;

    musicStarted = true;
    playChapterMusic(currentChapter);

    bgMusic.play().catch(() => {
      musicStarted = false;
    });
  }

  document.addEventListener("pointerdown", startMusicFromInteraction, {
    once: true
  });

  document.addEventListener("keydown", startMusicFromInteraction, {
    once: true
  });

  // ==========================================
  // CHAPTER NAVIGATION — NO FIREWORKS
  // ==========================================

  function showChapter(index) {
    if (!Number.isFinite(index)) return;

    const safeIndex = Math.max(
      0,
      Math.min(index, totalChapters - 1)
    );

    currentChapter = safeIndex;

    chapters.forEach((chapter, chapterIndex) => {
      const isActive = chapterIndex === currentChapter;

      chapter.classList.toggle("active", isActive);
      chapter.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentChapter);
    });

    if (counter) {
      counter.textContent = `Chapter ${currentChapter + 1} of ${totalChapters}`;
    }

    if (backButton) {
      backButton.disabled = currentChapter === 0;
    }

    if (nextButton) {
      nextButton.disabled = currentChapter === totalChapters - 1;

      nextButton.textContent =
        currentChapter === totalChapters - 1
          ? "Our Forever ♡"
          : "Next →";
    }

    playChapterMusic(currentChapter);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Important: Chapter 5 simply displays the finale.
    // No canvas, fireworks loop, or animation loop is started here.
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (currentChapter > 0) {
        showChapter(currentChapter - 1);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentChapter < totalChapters - 1) {
        showChapter(currentChapter + 1);
      }
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showChapter(index));

    dot.style.cursor = "pointer";
    dot.setAttribute("role", "button");
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("aria-label", `Go to chapter ${index + 1}`);

    dot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showChapter(index);
      }
    });
  });

  // ==========================================
  // TEDDY HUG BUTTON
  // ==========================================

  if (hugButton) {
    hugButton.addEventListener("click", () => {
      const message =
        hugMessages[Math.floor(Math.random() * hugMessages.length)];

      if (hugMessage) {
        hugMessage.textContent = message;
        hugMessage.classList.remove("hug-message-pop");

        // Restart the small message animation.
        void hugMessage.offsetWidth;

        hugMessage.classList.add("hug-message-pop");
      }

      // A few floating hearts — no fireworks.
      if (floatingDecor) {
        const heart = document.createElement("span");

        heart.className = "floating-item hug-heart";
        heart.textContent = "💗";
        heart.style.left = `${25 + Math.random() * 50}%`;
        heart.style.animationDuration = "4s";

        floatingDecor.appendChild(heart);

        window.setTimeout(() => {
          heart.remove();
        }, 4500);
      }
    });
  }

  // ==========================================
  // TOUCH SUPPORT FOR PHOTO VIEWER
  // ==========================================

  let touchStartX = 0;

  if (lightbox) {
    lightbox.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      (event) => {
        const touchEndX = event.changedTouches[0].screenX;
        const difference = touchEndX - touchStartX;

        if (Math.abs(difference) < 50 || lightbox.hidden) return;

        changePhoto(difference > 0 ? -1 : 1);
      },
      { passive: true }
    );
  }

  // ==========================================
  // INITIALISE WEBSITE
  // ==========================================

  createFloatingDecor();
  createStars();
  createGallery();
  showChapter(0);
});
