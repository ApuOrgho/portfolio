let currentIndex = 0;

function scrollAwards(direction) {
  const scrollTrack = document.getElementById("scroll-track");
  const cards = scrollTrack.querySelectorAll(".award-card");

  if (!cards.length) return;

  const cardStyle = getComputedStyle(cards[0]);
  const cardWidth = cards[0].offsetWidth;
  const gap = 20;
  const visibleArea = document.getElementById("scroll-wrapper").offsetWidth;
  const cardsPerScreen = Math.floor((visibleArea + gap) / (cardWidth + gap));
  const maxIndex = cards.length - cardsPerScreen;

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  const translateX = -(currentIndex * (cardWidth + gap));
  scrollTrack.style.transform = `translateX(${translateX}px)`;
}

const carousel = document.querySelector("#carousel");
const slides = [...carousel.children];
let slideWidth = slides[0].offsetWidth + 25; // slide width + gap
let totalWidth = slideWidth * slides.length;

let posX = 0;
const speed = 3.5; // Adjust speed for smoothness (px per frame)

function animate() {
  posX -= speed;

  // When we've scrolled past half the total width (original slides),
  // reset posX to 0 to create infinite scrolling effect without jump
  if (Math.abs(posX) >= totalWidth / 2) {
    posX += totalWidth / 2;
  }

  carousel.style.transform = `translateX(${posX}px)`;

  // Optional: add scale/opacity effect on center slide here if needed

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  slideWidth = slides[0].offsetWidth + 25;
  totalWidth = slideWidth * slides.length;
});

requestAnimationFrame(animate);

document.addEventListener("DOMContentLoaded", function () {
  const typed = new Typed(".typing-text", {
    strings: [
      "Aspiring Competitive Programmer",
      "Problem Setter",
      "Competitive Programming Trainer",
      "Tech Geek 💻",
      "AI Enthusiast",
    ],
    typeSpeed: 80, // Typing speed in milliseconds
    backSpeed: 40, // Backspacing speed in milliseconds
    loop: true,
    loopCount: Infinity, // Set to Infinity for infinite loop
    showCursor: true, // Display the typing cursor
    cursorChar: "|", // Typing cursor character
    autoInsertCss: true, // Automatically insert CSS for cursor and blink styles

    // Callback function for when the typing animation is finished
    onComplete: function (self) {
      // Add any code you want to run after the animation completes
      // For example, you can remove or hide the cursor after the animation is finished.
      self.cursor.remove();
    },
  });

  // Pause and play the animation when the header content is hovered
  const headerContent = document.querySelector(".header-content");
  headerContent.addEventListener("mouseenter", function () {
    typed.pause();
  });

  headerContent.addEventListener("mouseleave", function () {
    typed.start();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // ✅ Safe Nav Toggle
  const nav = document.querySelector("nav");
  const toggleBtn = document.getElementById("nav-toggle-btn");
  const navIcon = document.getElementById("nav-icon");
  const navLabel = document.getElementById("nav-label");

  if (nav && toggleBtn && navIcon && navLabel) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = nav.classList.toggle("nav-hidden");
      toggleBtn.classList.toggle("rotate", isHidden);
      navIcon.className = isHidden ? "fas fa-angle-down" : "fas fa-angle-up";
      navLabel.textContent = isHidden ? "Show Nav" : "Hide Nav";
    });
  }

  // ✅ Safe Carousel Animation (Only if carousel and slides exist)
  const carousel = document.getElementById("carousel");
  if (carousel && carousel.children.length > 0) {
    const slides = [...carousel.children];
    let slideWidth = slides[0].offsetWidth + 25;
    let totalWidth = slideWidth * slides.length;
    let posX = 0;
    const speed = 3.5;

    function animate() {
      posX -= speed;
      if (Math.abs(posX) >= totalWidth / 2) {
        posX += totalWidth / 2;
      }
      carousel.style.transform = `translateX(${posX}px)`;
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
      slideWidth = slides[0].offsetWidth + 25;
      totalWidth = slideWidth * slides.length;
    });

    requestAnimationFrame(animate);
  }
});
