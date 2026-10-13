const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
const featureTrack = document.querySelector(".feature-track");
const previousButton = document.querySelector(".carousel-button--prev");
const nextButton = document.querySelector(".carousel-button--next");

let featureIndex = 0;
let heroSlideIndex = 0;
let heroCarouselTimer;

function showHeroSlide(index) {
  heroSlideIndex = index;
  heroSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === heroSlideIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
}

function stopHeroCarousel() {
  window.clearInterval(heroCarouselTimer);
  heroCarouselTimer = undefined;
}

function startHeroCarousel() {
  stopHeroCarousel();
  if (heroSlides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  heroCarouselTimer = window.setInterval(() => {
    showHeroSlide((heroSlideIndex + 1) % heroSlides.length);
  }, 7200);
}

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  header?.classList.toggle("menu-active", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

function updateHeader() {
  const alwaysSolid = header?.classList.contains("site-header--solid");
  const threshold = Math.max(40, (hero?.offsetHeight ?? 0) - 85);
  header?.classList.toggle("is-scrolled", alwaysSolid || window.scrollY >= threshold);
}

function updateCarousel() {
  if (!featureTrack || window.innerWidth > 820) {
    featureTrack?.style.removeProperty("transform");
    return;
  }

  const card = featureTrack.querySelector(".feature-card");
  const step = (card?.getBoundingClientRect().width ?? 0) + 40;
  featureTrack.style.transform = `translateX(${-featureIndex * step}px)`;
}

menuToggle?.addEventListener("click", () => {
  setMenu(!document.body.classList.contains("menu-open"));
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

previousButton?.addEventListener("click", () => {
  featureIndex = (featureIndex + 2) % 3;
  updateCarousel();
});

nextButton?.addEventListener("click", () => {
  featureIndex = (featureIndex + 1) % 3;
  updateCarousel();
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    setMenu(false);
    featureIndex = 0;
  }
  updateCarousel();
  updateHeader();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopHeroCarousel();
  else startHeroCarousel();
});

showHeroSlide(0);
startHeroCarousel();
updateHeader();
updateCarousel();
