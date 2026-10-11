
const TOTAL_PHOTOS = 42;
const PHOTO_EXTENSION = "jpg";

const chapters = Array.from(document.querySelectorAll(".chapter"));
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const chapterCount = document.getElementById("chapterCount");
const dots = Array.from(document.querySelectorAll(".dot"));
const musicButton = document.getElementById("musicButton");
const bgMusic = document.getElementById("bgMusic");

let currentChapter = 0;
let currentPhoto = 1;
let musicStartedByUser = false;
let currentSong = "";

const captions = [
  "My beautiful girl 💗",
  "That lovely smile 🌸",
  "My favourite face 🥹",
  "A little piece of magic ✨",
  "My pretty babby 💕",
  "The girl of my dreams 🌙",
  "My sunshine ☀️",
  "Too cute for this universe 🪐",
  "My favourite human 🫶",
  "A whole heart of love 💌",
  "My sweet Lakshita 🌷",
  "Beautiful inside and out 💖",
  "My reason to smile 😊",
  "Cutie forever 🎀",
  "My lovely girl 🌹",
  "The prettiest soul 🦋",
  "My happiness 💗",
  "A face I'll never tire of 🥹",
  "My princess 👑",
  "My favourite view 🌸",
  "A little angel 😇",
  "My heart's favourite 💞",
  "Simply unforgettable ✨",
  "My gorgeous girl 💋",
  "A dream come true 🌙",
  "My sweetest blessing 🫶",
  "My adorable babby 🧸",
  "The glow in my universe 🌟",
  "My forever favourite 💗",
  "A thousand butterflies 🦋",
  "My lovely sweetheart 💕",
  "Prettiness overload 🎀",
  "My world in one picture 🌎",
  "A smile worth a million stars ✨",
  "My one and only 💌",
  "My little moon 🌙",
  "My favourite kind of magic 🪄",
  "The sweetest girl ever 🌷",
  "My beautiful Lakshita 💖",
  "A memory to treasure 📸",
  "My heart, always 💗",
  "Forever special to me ♾️"
];

// Build the 42-photo gallery.
const gallery = document.getElementById("gallery");

for (let i = 1; i <= TOTAL_PHOTOS; i++) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "photo-card";
  card.setAttribute("aria-label", `Open photo ${i}: ${captions[i - 1]}`);

  const img = document.createElement("img");
  img.src = `photos/${i}.${PHOTO_EXTENSION}`;
  img.alt = captions[i - 1];
  img.loading = "lazy";
  img.decoding = "async";

  // If a file is missing, show a clear placeholder instead of a broken icon.
  img.addEventListener("error", () => {
    img.removeAttribute("src");
    img.alt = "Photo file not found";
    img.style.display = "none";

    const placeholder = document.createElement("div");
    placeholder.className = "photo-placeholder";
    placeholder.textContent = `Add photo ${i}`;
    placeholder.style.cssText =
      "aspect-ratio:3/4;display:grid;place-items:center;" +
      "padding:10px;background:#efd1e7;color:#71385f;" +
      "border-radius:7px;font-size:12px;text-align:center;";

    card.insertBefore(placeholder, caption);
  });

  const caption = document.createElement("span");
  caption.className = "photo-caption";
  caption.textContent = captions[i - 1];

  card.append(img, caption);
  card.addEventListener("click", () => openPhoto(i));
  gallery.appendChild(card);
}

// Chapter navigation.
function showChapter(index) {
  if (index < 0 || index >= chapters.length) return;

  currentChapter = index;

  chapters.forEach((chapter, i) => {
    chapter.classList.toggle("active", i === index);
    chapter.setAttribute("aria-hidden", String(i !== index));
  });

  chapterCount.textContent = `Chapter ${index + 1} of ${chapters.length}`;
  backButton.disabled = index === 0;

  nextButton.disabled = false;
  nextButton.textContent =
    index === chapters.length - 1 ? "Start again ↻" : "Next →";

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  // Return the chapter to its beginning.
  chapters[index].scrollTop = 0;

  // Change the soundtrack for the new chapter.
  changeSong(chapters[index].dataset.song);
}

function nextChapter() {
  if (currentChapter === chapters.length - 1) {
    showChapter(0);
    return;
  }

  showChapter(currentChapter + 1);
}

function previousChapter() {
  if (currentChapter > 0) {
    showChapter(currentChapter - 1);
  }
}

nextButton.addEventListener("click", nextChapter);
backButton.addEventListener("click", previousChapter);

// Five different songs, one per chapter.
function changeSong(songFile) {
  if (!songFile || currentSong === songFile) return;

  currentSong = songFile;
  bgMusic.pause();
  bgMusic.src = songFile;
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
  if (bgMusic.paused) {
    musicStartedByUser = true;

    try {
      await bgMusic.play();
      updateMusicButton();
    } catch (error) {
      musicButton.textContent = "♫ Try again";
    }
  } else {
    bgMusic.pause();
    updateMusicButton();
  }
});

bgMusic.addEventListener("ended", updateMusicButton);
bgMusic.addEventListener("pause", updateMusicButton);
bgMusic.addEventListener("play", updateMusicButton);

// Photo lightbox.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

function openPhoto(number) {
  currentPhoto = number;
  updateLightbox();
  lightbox.hidden = false;
  document.getElementById("closeLightbox").focus();
}

function updateLightbox() {
  lightboxImage.src = `photos/${currentPhoto}.${PHOTO_EXTENSION}`;
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
    ((currentPhoto - 1 + direction + TOTAL_PHOTOS) % TOTAL_PHOTOS) + 1;
  updateLightbox();
}

document.getElementById("closeLightbox").addEventListener("click", closePhoto);
document.getElementById("previousPhoto").addEventListener("click", () => movePhoto(-1));
document.getElementById("nextPhoto").addEventListener("click", () => movePhoto(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closePhoto();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.hidden) {
    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
  } else {
    if (event.key === "ArrowRight") nextChapter();
    if (event.key === "ArrowLeft") previousChapter();
  }
});

// Virtual hug.
document.getElementById("hugButton").addEventListener("click", () => {
  const message = document.getElementById("hugMessage");
  message.hidden = false;
  document.getElementById("hugButton").textContent = "Hug delivered! 💗";

  for (let i = 0; i < 12; i++) {
    createFloatingHeart();
  }
});

// Replay from the beginning.
document.getElementById("replayButton").addEventListener("click", () => {
  showChapter(0);
  chapters[0].scrollTop = 0;
});

// Floating hearts.
const floatingHearts = document.getElementById("floatingHearts");

function createFloatingHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = ["♥", "♡", "💗", "✧"][Math.floor(Math.random() * 4)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 19}px`;
  heart.style.animationDuration = `${5 + Math.random() * 5}s`;

  floatingHearts.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

setInterval(createFloatingHeart, 900);

// Start on Chapter 1.
showChapter(0);
