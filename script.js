
(() => {
  const TOTAL_PHOTOS = 50;
  const EXTENSION = "jpg"; // Change to "png" or "webp" if all photos use that format.

  const captions = [
    "my prettiest girl ♡", "that lovely smile", "my whole heart",
    "my cutuuu", "my favourite human", "the girl I adore",
    "pretty in every way", "my sunshine", "my sweetest thought",
    "my Lakshita", "a face I could never tire of", "my soft spot",
    "my beautiful babby", "my favourite view", "pure magic",
    "my heart says you", "the cutest ever", "my little universe",
    "my forever girl", "my happy place", "all kinds of pretty",
    "my reason to smile", "my sweetheart", "my favourite person",
    "a little bit of heaven", "my precious girl", "the prettiest soul",
    "my comfort person", "my favourite notification", "my one and only",
    "the girl in my dreams", "my beautiful wifey", "my reason to grin",
    "the one I choose", "my lovely girl", "my world in one photo",
    "my babbyygurl", "my heart's favourite", "you, always you",
    "my sweetest blessing", "my little star", "a thousand butterflies",
    "my forever crush", "the girl I keep choosing", "my everything",
    "my favourite kind of beautiful", "my heart's home",
    "the love of my life", "one year, endless love", "forever looks like you ♡"
  ];

  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const largePhoto = document.getElementById("largePhoto");
  const photoCaption = document.getElementById("photoCaption");
  let current = 0;

  function renderGallery() {
    for (let i = 1; i <= TOTAL_PHOTOS; i++) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "photo-card";
      card.style.setProperty("--tilt", `${[-1, .8, -.5, 1.1, .3][(i - 1) % 5]}deg`);
      card.setAttribute("aria-label", `Open photo ${i}`);

      const img = document.createElement("img");
      img.src = `photos/${i}.${EXTENSION}`;
      img.alt = `Lakshita, photo ${i}`;
      img.loading = i <= 6 ? "eager" : "lazy";
      img.decoding = "async";
      img.onerror = () => {
        card.classList.add("missing");
        img.onerror = null;
        img.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#38213d"/><text x="200" y="230" fill="#f7c5ff" font-size="28" text-anchor="middle">Photo ${i}</text><text x="200" y="270" fill="#ff9dce" font-size="20" text-anchor="middle">photos/${i}.${EXTENSION}</text><text x="200" y="330" fill="#ff9dce" font-size="40" text-anchor="middle">♡</text></svg>`
        );
      };

      const number = document.createElement("span");
      number.className = "number";
      number.textContent = String(i).padStart(2, "0");

      const caption = document.createElement("span");
      caption.className = "caption";
      caption.textContent = captions[i - 1];

      card.append(img, number, caption);
      card.addEventListener("click", () => openPhoto(i - 1));
      gallery.appendChild(card);
    }
  }

  function openPhoto(index) {
    current = (index + TOTAL_PHOTOS) % TOTAL_PHOTOS;
    largePhoto.src = `photos/${current + 1}.${EXTENSION}`;
    largePhoto.alt = `Lakshita, photo ${current + 1}`;
    photoCaption.textContent = `${captions[current]} · ${current + 1} / ${TOTAL_PHOTOS}`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closePhoto() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.getElementById("closePhoto").addEventListener("click", closePhoto);
  document.getElementById("prevPhoto").addEventListener("click", () => openPhoto(current - 1));
  document.getElementById("nextPhoto").addEventListener("click", () => openPhoto(current + 1));

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closePhoto();
  });

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closePhoto();
    if (e.key === "ArrowLeft") openPhoto(current - 1);
    if (e.key === "ArrowRight") openPhoto(current + 1);
  });

  // Floating hearts
  const heartLayer = document.getElementById("hearts");

  function spawnHeart() {
    if (document.hidden) return;
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > .5 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 17}px`;
    heart.style.setProperty("--duration", `${7 + Math.random() * 5}s`);
    heartLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 13000);
  }

  for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 400);
  setInterval(spawnHeart, 1300);

  // Virtual hug
  const hugs = [
    "Biggg warm hug for my babbyyy 🫂💗",
    "You're loved more than you know, cutuuu ♡",
    "One little breath at a time, my sweetheart ✨",
    "Your Rishuuu is cheering for you always 💞"
  ];

  document.getElementById("hugButton").addEventListener("click", () => {
    document.getElementById("hugMessage").textContent =
      hugs[Math.floor(Math.random() * hugs.length)];
    for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 100);
  });

  document.getElementById("loveButton").addEventListener("click", () => {
    document.getElementById("finalMessage").textContent =
      "I loveeeee youuu, my Lakshitaaa. Today, tomorrow, and all the little days after that. 💗";
    for (let i = 0; i < 15; i++) setTimeout(spawnHeart, i * 90);
  });

  // Music starts after a tap because most browsers block autoplay.
  const music = document.getElementById("bgMusic");
  const musicButton = document.getElementById("musicButton");

  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicButton.textContent = "♫ Music on";
      } catch {
        musicButton.textContent = "♫ Check song.mp3";
      }
    } else {
      music.pause();
      musicButton.textContent = "♫ Our song";
    }
  });

  renderGallery();
})();
