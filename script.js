/* =========================================================
   ALBUM KENANGAN
   JavaScript Lengkap
========================================================= */


/* =========================================================
   1. PERTANYAAN PEMBUKA
========================================================= */

const welcomeScreen = document.getElementById("welcomeScreen");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");


// Tombol "Mau"
if (yesBtn) {
  yesBtn.addEventListener("click", () => {

    welcomeScreen.classList.add("hide");

    // Setelah pertanyaan hilang,
    // tampilkan loader sebentar
    setTimeout(() => {
      welcomeScreen.style.display = "none";

      const loader = document.getElementById("loader");

      if (loader) {
        loader.classList.add("show");

        setTimeout(() => {
          loader.classList.add("hide");
        }, 1000);
      }

    }, 700);

  });
}


// Tombol "Tidak mau"
if (noBtn) {

  noBtn.addEventListener("click", () => {

    // Efek sederhana sebelum keluar
    welcomeScreen.classList.add("reject");

    setTimeout(() => {

      // Mengganti isi halaman
      document.body.innerHTML = `
        <div class="goodbye-screen">

          <div class="goodbye-box">

            <div class="goodbye-heart">
              💔
            </div>

            <h1>
              Yah... 😭
            </h1>

            <p>
              Berarti belum mau melihat kenangannya.
            </p>

            <p>
              Kalau berubah pikiran, silakan buka
              halaman ini lagi. 💜
            </p>

            <button
              onclick="location.reload()"
              class="welcome-btn yes">
              Coba Lagi 💜
            </button>

          </div>

        </div>
      `;

    }, 500);

  });

}


/* =========================================================
   2. LOADER
========================================================= */

window.addEventListener("load", () => {

  const loader = document.getElementById("loader");

  if (!loader) return;

  // Jika welcome screen masih ada,
  // loader tidak langsung ditampilkan.
  if (
    welcomeScreen &&
    !welcomeScreen.classList.contains("hide")
  ) {
    loader.classList.remove("show");
    loader.classList.remove("hide");
    return;
  }

  setTimeout(() => {
    loader.classList.add("hide");
  }, 1200);

});


/* =========================================================
   3. SCROLL KE SECTION
========================================================= */

function scrollToSection(sectionId) {

  const section = document.getElementById(sectionId);

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =========================================================
   4. NAVBAR SAAT SCROLL
========================================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

});


/* =========================================================
   5. SLIDESHOW
========================================================= */

const slides = document.querySelectorAll(".slide");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const dotsContainer = document.getElementById("dots");

let currentSlide = 0;
let slideTimer;


// Membuat dots otomatis
if (slides.length > 0 && dotsContainer) {

  slides.forEach((_, index) => {

    const dot = document.createElement("button");

    dot.classList.add("dot");

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.setAttribute(
      "aria-label",
      `Buka slide ${index + 1}`
    );

    dot.addEventListener("click", () => {
      showSlide(index);
      restartSlideTimer();
    });

    dotsContainer.appendChild(dot);

  });

}


function showSlide(index) {

  if (slides.length === 0) return;

  // Jika melewati slide terakhir
  if (index >= slides.length) {
    currentSlide = 0;
  }

  // Jika sebelum slide pertama
  else if (index < 0) {
    currentSlide = slides.length - 1;
  }

  else {
    currentSlide = index;
  }


  slides.forEach((slide, index) => {

    slide.classList.toggle(
      "active",
      index === currentSlide
    );

  });


  // Update dots
  const dots = document.querySelectorAll(".dot");

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentSlide
    );

  });

}


// Tombol sebelumnya
if (prevSlide) {

  prevSlide.addEventListener("click", () => {

    showSlide(currentSlide - 1);

    restartSlideTimer();

  });

}


// Tombol berikutnya
if (nextSlide) {

  nextSlide.addEventListener("click", () => {

    showSlide(currentSlide + 1);

    restartSlideTimer();

  });

}


// Slideshow otomatis
function startSlideTimer() {

  if (slides.length <= 1) return;

  slideTimer = setInterval(() => {

    showSlide(currentSlide + 1);

  }, 5000);

}


function restartSlideTimer() {

  clearInterval(slideTimer);

  startSlideTimer();

}


startSlideTimer();


/* =========================================================
   6. SWIPE FOTO DI HP
========================================================= */

const slidesContainer = document.getElementById("slides");

let touchStartX = 0;
let touchEndX = 0;

if (slidesContainer) {

  slidesContainer.addEventListener(
    "touchstart",
    (event) => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  slidesContainer.addEventListener(
    "touchend",
    (event) => {

      touchEndX =
        event.changedTouches[0].screenX;

      handleSwipe();

    },
    { passive: true }
  );

}


function handleSwipe() {

  const distance =
    touchEndX - touchStartX;


  // Swipe kiri
  if (distance < -50) {

    showSlide(currentSlide + 1);

    restartSlideTimer();

  }


  // Swipe kanan
  if (distance > 50) {

    showSlide(currentSlide - 1);

    restartSlideTimer();

  }

}


/* =========================================================
   7. MODAL ZOOM FOTO
========================================================= */

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const zoomReset = document.getElementById("zoomReset");

const zoomableImages =
  document.querySelectorAll(".zoomable");

let zoomLevel = 1;


/* Membuka foto */
zoomableImages.forEach((image) => {

  image.addEventListener("click", () => {

    if (!modal || !modalImage) return;

    modal.classList.add("show");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    modalImage.src = image.src;

    modalImage.alt = image.alt;

    zoomLevel = 1;

    updateZoom();

    document.body.classList.add("modal-open");

  });

});


/* Update ukuran zoom */
function updateZoom() {

  if (!modalImage) return;

  modalImage.style.transform =
    `scale(${zoomLevel})`;

}


/* Zoom in */
if (zoomIn) {

  zoomIn.addEventListener("click", () => {

    if (zoomLevel < 3) {

      zoomLevel += 0.25;

      updateZoom();

    }

  });

}


/* Zoom out */
if (zoomOut) {

  zoomOut.addEventListener("click", () => {

    if (zoomLevel > 0.5) {

      zoomLevel -= 0.25;

      updateZoom();

    }

  });

}


/* Reset */
if (zoomReset) {

  zoomReset.addEventListener("click", () => {

    zoomLevel = 1;

    updateZoom();

  });

}


/* Tutup modal */
function closeModal() {

  if (!modal) return;

  modal.classList.remove("show");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

  setTimeout(() => {

    if (modalImage) {
      modalImage.src = "";
    }

  }, 300);

}


if (modalClose) {

  modalClose.addEventListener(
    "click",
    closeModal
  );

}


// Klik area gelap untuk menutup
if (modal) {

  modal.addEventListener("click", (event) => {

    if (event.target === modal) {
      closeModal();
    }

  });

}


/* =========================================================
   8. KEYBOARD CONTROL
========================================================= */

document.addEventListener("keydown", (event) => {

  // ESC menutup zoom
  if (event.key === "Escape") {

    closeModal();

  }


  // Jika modal terbuka
  if (
    modal &&
    modal.classList.contains("show")
  ) {

    // +
    if (
      event.key === "+" ||
      event.key === "="
    ) {

      if (zoomLevel < 3) {

        zoomLevel += 0.25;

        updateZoom();

      }

    }


    // -
    if (event.key === "-") {

      if (zoomLevel > 0.5) {

        zoomLevel -= 0.25;

        updateZoom();

      }

    }

  }


  // Keyboard slideshow
  if (
    !modal ||
    !modal.classList.contains("show")
  ) {

    if (event.key === "ArrowLeft") {

      showSlide(currentSlide - 1);

      restartSlideTimer();

    }

    if (event.key === "ArrowRight") {

      showSlide(currentSlide + 1);

      restartSlideTimer();

    }

  }

});


/* =========================================================
   9. ZOOM DENGAN SCROLL MOUSE
========================================================= */

const zoomArea =
  document.getElementById("zoomArea");

if (zoomArea) {

  zoomArea.addEventListener(
    "wheel",
    (event) => {

      if (
        !modal ||
        !modal.classList.contains("show")
      ) {
        return;
      }

      event.preventDefault();

      if (event.deltaY < 0) {

        if (zoomLevel < 3) {
          zoomLevel += 0.1;
        }

      } else {

        if (zoomLevel > 0.5) {
          zoomLevel -= 0.1;
        }

      }

      updateZoom();

    },
    { passive: false }
  );

}


/* =========================================================
   10. 3 MUSIK
========================================================= */

const bgMusic =
  document.getElementById("bgMusic");

const musicBtn =
  document.getElementById("musicBtn");


// Daftar lagu
const songs = [
  "musik1.mp3",
  "musik2.mp3",
  "musik3.mp3"
];


// Nama lagu
const songNames = [
  "Lagu Kenangan #1",
  "Lagu Kenangan #2",
  "Lagu Kenangan #3"
];


let currentSong = 0;


/* Memuat lagu */
function loadSong(index, autoPlay = false) {

  if (!bgMusic) return;

  currentSong =
    (index + songs.length) %
    songs.length;

  bgMusic.src =
    songs[currentSong];

  bgMusic.load();


  if (autoPlay) {

    const playPromise =
      bgMusic.play();

    if (
      playPromise !== undefined
    ) {

      playPromise.catch(() => {
        // Browser mungkin memblokir autoplay.
      });

    }

  }

  updateMusicButton();

}


/* Update tombol musik */
function updateMusicButton() {

  if (!musicBtn || !bgMusic) return;

  if (!bgMusic.paused) {

    musicBtn.innerHTML = "❚❚";

    musicBtn.setAttribute(
      "aria-label",
      `Pause ${songNames[currentSong]}`
    );

    musicBtn.title =
      songNames[currentSong];

  } else {

    musicBtn.innerHTML = "♫";

    musicBtn.setAttribute(
      "aria-label",
      `Putar ${songNames[currentSong]}`
    );

    musicBtn.title =
      `Putar ${songNames[currentSong]}`;

  }

}


/* Tombol musik */
if (musicBtn) {

  musicBtn.addEventListener(
    "click",
    () => {

      if (!bgMusic) return;


      // Jika musik belum diputar
      if (bgMusic.paused) {

        if (!bgMusic.src) {

          loadSong(
            currentSong,
            true
          );

        } else {

          bgMusic.play()
            .catch(() => {});

        }

      }

      // Jika sedang diputar
      else {

        // Klik tombol ketika musik sedang berjalan
        // akan pindah ke lagu berikutnya
        nextSong();

      }

      updateMusicButton();

    }
  );

}


/* Lagu berikutnya */
function nextSong() {

  if (!bgMusic) return;

  currentSong++;

  if (
    currentSong >= songs.length
  ) {
    currentSong = 0;
  }

  loadSong(
    currentSong,
    true
  );

}


/* Ketika lagu selesai,
   otomatis pindah ke lagu berikutnya */
if (bgMusic) {

  bgMusic.addEventListener(
    "ended",
    () => {

      nextSong();

    }
  );


  bgMusic.addEventListener(
    "play",
    updateMusicButton
  );


  bgMusic.addEventListener(
    "pause",
    updateMusicButton
  );

}


// Lagu pertama disiapkan
loadSong(0, false);


/* =========================================================
   11. COUNTDOWN
========================================================= */


// GANTI TANGGAL INI
// Format:
// Tahun-Bulan-TanggalTJam:Menit:Detik

const targetDate =
  new Date("2027-01-01T00:00:00").getTime();


const daysElement =
  document.getElementById("days");

const hoursElement =
  document.getElementById("hours");

const minutesElement =
  document.getElementById("minutes");

const secondsElement =
  document.getElementById("seconds");

const targetDateText =
  document.getElementById(
    "targetDateText"
  );


/* Tampilkan tanggal target */
if (targetDateText) {

  const date =
    new Date(targetDate);

  targetDateText.textContent =
    "Menuju " +
    date.toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

}


/* Update countdown */
function updateCountdown() {

  const now =
    new Date().getTime();

  const distance =
    targetDate - now;


  if (distance <= 0) {

    if (daysElement)
      daysElement.textContent = "00";

    if (hoursElement)
      hoursElement.textContent = "00";

    if (minutesElement)
      minutesElement.textContent = "00";

    if (secondsElement)
      secondsElement.textContent = "00";

    if (targetDateText)
      targetDateText.textContent =
        "Hari yang ditunggu sudah tiba! 🎉";

    return;

  }


  const days =
    Math.floor(
      distance /
      (1000 * 60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (distance %
        (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );


  const minutes =
    Math.floor(
      (distance %
        (1000 * 60 * 60)) /
      (1000 * 60)
    );


  const seconds =
    Math.floor(
      (distance %
        (1000 * 60)) /
      1000
    );


  if (daysElement)
    daysElement.textContent =
      String(days).padStart(2, "0");


  if (hoursElement)
    hoursElement.textContent =
      String(hours).padStart(2, "0");


  if (minutesElement)
    minutesElement.textContent =
      String(minutes).padStart(2, "0");


  if (secondsElement)
    secondsElement.textContent =
      String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   12. REVEAL ANIMATION
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if (
  "IntersectionObserver"
  in window
) {

  const observer =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.15
      }
    );


  revealElements.forEach(
    (element) => {

      observer.observe(element);

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element.classList.add(
        "visible"
      );

    }
  );

}


/* =========================================================
   13. PRELOAD GAMBAR
========================================================= */

const allImages =
  document.querySelectorAll("img");


allImages.forEach((image) => {

  image.addEventListener(
    "error",
    () => {

      console.warn(
        "Gambar tidak ditemukan:",
        image.src
      );

    }
  );

});


/* =========================================================
   14. PREVENT IMAGE DRAG
========================================================= */

document
  .querySelectorAll("img")
  .forEach((image) => {

    image.addEventListener(
      "dragstart",
      (event) => {
        event.preventDefault();
      }
    );

  });


/* =========================================================
   SELESAI
========================================================= */

console.log(
  "💜 Album Kenangan berhasil dijalankan!"
);