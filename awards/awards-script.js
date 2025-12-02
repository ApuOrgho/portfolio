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
