let currentIndex = 0;

function scrollAwards(direction) {
  const scrollTrack = document.getElementById("scroll-track");
  if (!scrollTrack) return;
  const cards = scrollTrack.querySelectorAll(".award-card");

  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 20;
  const visibleArea = document.getElementById("scroll-wrapper").offsetWidth;
  const cardsPerScreen = Math.floor((visibleArea + gap) / (cardWidth + gap));
  const maxIndex = Math.max(0, cards.length - cardsPerScreen);

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  const translateX = -(currentIndex * (cardWidth + gap));
  scrollTrack.style.transform = `translateX(${translateX}px)`;
}

// Main DOM-ready initialization
document.addEventListener("DOMContentLoaded", function () {
  // --- Typed.js header animation (safe init) ---
  if (window.Typed) {
    const typed = new Typed(".typing-text", {
      strings: [
        "Aspiring Competitive Programmer",
        "Problem Setter",
        "Competitive Programming Trainer",
        "Tech Geek 💻",
        "AI Enthusiast",
      ],
      typeSpeed: 80,
      backSpeed: 40,
      loop: true,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
    });

    const headerContent = document.querySelector(".header-content");
    if (headerContent) {
      headerContent.addEventListener("mouseenter", function () {
        typed.pause();
      });
      headerContent.addEventListener("mouseleave", function () {
        typed.start();
      });
    }
  }

  // --- Mobile hamburger / mobile menu (use actual IDs from HTML) ---
  const hamburgerBtn = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileMenuOverlay");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      if (mobileOverlay) mobileOverlay.classList.toggle("active");
      document.body.style.overflow = mobileMenu.classList.contains("active")
        ? "hidden"
        : "";
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener("click", () => {
        hamburgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    }

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        if (mobileOverlay) mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        hamburgerBtn.classList.remove("active");
        mobileMenu.classList.remove("active");
        if (mobileOverlay) mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // --- Skills carousel: layered cinematic carousel ---
  const skillsCarousel = document.getElementById("skillsCarousel");
  const dotsContainer = document.getElementById("skillsDots");

  if (skillsCarousel && skillsCarousel.children.length > 0) {
    const slides = Array.from(skillsCarousel.children);
    const slidesCount = slides.length;
    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
    let current = 0;
    const autoplayDelay = 635; // 1.5x faster (953 / 1.5 ≈ 635ms)
    let autoplayTimer = null;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchDeltaX = 0;
    const transitionTime = 350; // smooth 350ms transition

    // Update slide layering (z-index, scale, opacity)
    function updateSlides() {
      slides.forEach((slide, i) => {
        const isActive = i === current;
        const isNext = i === (current + 1) % slidesCount;
        const isPrev = i === (current - 1 + slidesCount) % slidesCount;

        // z-index: active in front (30), next behind (20), prev (10), others (0)
        if (isActive) {
          slide.style.zIndex = "30";
          slide.style.transform = "scale(1) translateX(0px)";
          slide.style.opacity = "1";
        } else if (isNext) {
          slide.style.zIndex = "20";
          slide.style.transform = "scale(0.92) translateX(80px)";
          slide.style.opacity = "0.65";
        } else if (isPrev) {
          slide.style.zIndex = "10";
          slide.style.transform = "scale(0.88) translateX(-80px)";
          slide.style.opacity = "0.4";
        } else {
          slide.style.zIndex = "0";
          slide.style.opacity = "0";
          slide.style.pointerEvents = "none";
        }
      });
      updateDots();
    }

    function updateDots() {
      if (!dots.length) return;
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    function goToSlide(n, userInitiated = false) {
      if (isTransitioning) return;
      isTransitioning = true;
      current = ((n % slidesCount) + slidesCount) % slidesCount;
      updateSlides();
      if (userInitiated) restartAutoplay();
      setTimeout(() => {
        isTransitioning = false;
      }, transitionTime);
    }

    function next() {
      goToSlide(current + 1, false);
    }

    // dots navigation
    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          goToSlide(i, true);
        });
      });
    }

    // autoplay
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        next();
      }, autoplayDelay);
    }
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
    function restartAutoplay() {
      stopAutoplay();
      setTimeout(() => startAutoplay(), 500);
    }

    // pause on hover
    const wrapper =
      skillsCarousel.closest(".carousel-wrapper") || skillsCarousel;
    if (wrapper) {
      wrapper.addEventListener("mouseenter", () => {
        stopAutoplay();
      });
      wrapper.addEventListener("mouseleave", () => {
        restartAutoplay();
      });
    }

    // visibility
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else restartAutoplay();
    });

    // touch / swipe support
    skillsCarousel.addEventListener(
      "touchstart",
      (e) => {
        stopAutoplay();
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
      },
      { passive: true }
    );

    skillsCarousel.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches && e.touches.length > 0) {
          touchDeltaX = e.touches[0].clientX - touchStartX;
        }
      },
      { passive: true }
    );

    skillsCarousel.addEventListener("touchend", (e) => {
      const threshold = 50; // pixel threshold
      if (Math.abs(touchDeltaX) > threshold) {
        if (touchDeltaX > 0) {
          // swiped right -> prev
          goToSlide(current - 1, true);
        } else {
          // swiped left -> next
          goToSlide(current + 1, true);
        }
      }
      restartAutoplay();
    });

    // initialize
    updateSlides();
    setTimeout(() => {
      startAutoplay();
    }, 300);
  }
});

/* Contact Form Handler */
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", function (e) {
      // Show loading state
      submitBtn.disabled = true;
      document.querySelector(".btn-text").style.display = "none";
      document.querySelector(".btn-spinner").style.display = "inline-block";
    });
  }
});
