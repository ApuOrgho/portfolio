document.addEventListener("DOMContentLoaded", function () {
  const ROOT_ID = "tpsx-root";
  const MANIFEST = "awards/team-posters-manifest.json";
  const IMAGE_DIR = "images/awards/";
  const INTERVAL_MS = 1200;

  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  function isPoster(name) {
    return /(?:iupc|icpc|ncpc)/i.test(name);
  }

  function buildSlide(name, idx) {
    const el = document.createElement("div");
    el.className = "tpsx-slide";
    el.dataset.index = idx;

    const img = document.createElement("img");
    img.src = IMAGE_DIR + name;
    img.alt = name.replace(/[-_.]/g, " ");
    img.loading = "lazy";
    el.appendChild(img);

    return el;
  }

  function applyClasses(slides, current) {
    const len = slides.length;
    slides.forEach((s, i) => {
      s.classList.remove("tpsx-back", "tpsx-prev", "tpsx-active", "tpsx-next");
      if (i === current) s.classList.add("tpsx-active");
      else if (i === (current + 1) % len) s.classList.add("tpsx-next");
      else if (i === (current - 1 + len) % len) s.classList.add("tpsx-prev");
      else s.classList.add("tpsx-back");
    });
  }

  function startAutoplay(slides) {
    let idx = 0;
    applyClasses(slides, idx);
    let timer = setInterval(() => {
      idx = (idx + 1) % slides.length;
      applyClasses(slides, idx);
    }, INTERVAL_MS);

    root.addEventListener("mouseenter", () => clearInterval(timer));
    root.addEventListener("mouseleave", () => {
      timer = setInterval(() => {
        idx = (idx + 1) % slides.length;
        applyClasses(slides, idx);
      }, INTERVAL_MS);
    });

    // keyboard control
    root.tabIndex = 0;
    root.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight") {
        idx = (idx + 1) % slides.length;
        applyClasses(slides, idx);
      } else if (ev.key === "ArrowLeft") {
        idx = (idx - 1 + slides.length) % slides.length;
        applyClasses(slides, idx);
      }
    });
  }

  fetch(MANIFEST)
    .then((r) => r.json())
    .catch(() => null)
    .then((list) => {
      // fallback list if manifest missing or invalid
      const fallback = [
        "iut_iupc24.jpg",
        "kuet_iupc25.jpg",
        "icpc22.jpg",
        "icpc23.jpg",
        "icpc24.jpg",
        "ncpc24.jpg",
      ];
      const files = (Array.isArray(list) ? list : fallback).filter(isPoster);
      if (!files.length) return;

      // create slides
      const slides = files.map((f, i) => buildSlide(f, i));
      slides.forEach((s) => root.appendChild(s));

      // small initial animation delay for better visual entrance
      requestAnimationFrame(() => {
        root.classList.add("tpsx-ready");
      });

      // ensure images are loaded (so contain fits) then start autoplay
      const imgs = Array.from(root.querySelectorAll("img"));
      Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((res) => {
            img.onload = img.onerror = res;
          });
        })
      ).then(() => startAutoplay(slides));
    });
});
