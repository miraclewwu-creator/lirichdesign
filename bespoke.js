const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const ease = (value) => value * value * (3 - 2 * value);

const introSection = document.querySelector(".bespoke-intro-scroll");
const introCopy = document.querySelector(".bespoke-intro-copy");
const driftImages = [...document.querySelectorAll(".drift-image")];
const linksSection = document.querySelector(".bespoke-links-scroll");
const linksTrack = document.querySelector(".bespoke-links-track");
const linkCards = [...document.querySelectorAll(".bespoke-link-card")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let ticking = false;

const sectionProgress = (section) => {
  const distance = Math.max(1, section.offsetHeight - window.innerHeight);
  return clamp(-section.getBoundingClientRect().top / distance);
};

const renderIntro = () => {
  if (!introSection || !introCopy) return;

  const progress = sectionProgress(introSection);
  const viewportHeight = window.innerHeight;
  const stageTop = introSection.querySelector(".bespoke-stage").getBoundingClientRect().top;
  const copyFade = clamp((0.96 - progress) / 0.2);
  introCopy.style.opacity = String(copyFade);
  introCopy.style.transform = `translate(-50%, calc(-50% + ${progress * -10}px))`;

  driftImages.forEach((figure) => {
    const start = Number(figure.dataset.start);
    const end = Number(figure.dataset.end);
    const localProgress = clamp((progress - start) / (end - start));
    const smoothed = ease(localProgress);
    const x = lerp(Number(figure.dataset.xStart), Number(figure.dataset.xEnd), smoothed);
    const y = lerp(Number(figure.dataset.yStart), Number(figure.dataset.yEnd), smoothed);
    // Fade while the image enters the visible stage, not during its offscreen travel.
    const imageTop = stageTop + figure.offsetTop + (y / 100) * viewportHeight;
    const imageBottom = imageTop + figure.offsetHeight;
    const fadeIn = ease(clamp((viewportHeight - imageTop) / (viewportHeight * 0.35)));
    const fadeOut = ease(clamp(imageBottom / (viewportHeight * 0.2)));

    figure.style.opacity = String(Math.min(fadeIn, fadeOut));
    figure.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;
  });
};

const renderLinks = () => {
  if (!linksSection || !linksTrack) return;

  const progress = sectionProgress(linksSection);
  const travel = window.innerWidth * 0.6 * Math.max(0, linkCards.length - 1);
  linksTrack.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;

  const cardPosition = progress * Math.max(1, linkCards.length - 1);
  linkCards.forEach((card, index) => {
    const relativePosition = cardPosition - index;
    const distance = Math.min(1, Math.abs(relativePosition));
    const titleShift = -relativePosition * window.innerWidth * 0.22;
    card.style.opacity = String(0.12 + (1 - distance) * 0.88);
    card.style.setProperty("--bespoke-title-shift", `${titleShift}px`);
  });
};

const render = () => {
  ticking = false;
  const desktop = window.innerWidth > 820 && !reducedMotion.matches;

  if (!desktop) {
    introCopy?.removeAttribute("style");
    driftImages.forEach((figure) => figure.removeAttribute("style"));
    linksTrack?.removeAttribute("style");
    linkCards.forEach((card) => {
      card.removeAttribute("style");
      card.style.removeProperty("--bespoke-title-shift");
    });
    return;
  }

  renderIntro();
  renderLinks();
};

const requestRender = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(render);
};

window.addEventListener("scroll", requestRender, { passive: true });
window.addEventListener("resize", requestRender);
reducedMotion.addEventListener?.("change", requestRender);
requestRender();
