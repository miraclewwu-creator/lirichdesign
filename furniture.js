const grid = document.querySelector("#furniture-grid");
const FURNITURE_UPDATE_CHANNEL = "lirich-studio-furniture-updates";
const furnitureUpdateChannel = "BroadcastChannel" in window
  ? new BroadcastChannel(FURNITURE_UPDATE_CHANNEL)
  : null;

function assetUrl(path) {
  return /^(?:[a-z]+:|\/)/i.test(path || "") ? path : `/${path || ""}`;
}

function createFurnitureCard(item, index) {
  const article = document.createElement("article");
  article.className = `project-card${index === 0 ? " is-active" : ""}`;

  const link = document.createElement("a");
  link.className = "project-link";
  link.href = `#${item.slug}`;
  link.setAttribute("aria-label", `View ${item.title} furniture`);

  const media = document.createElement("span");
  media.className = "project-media";
  const image = document.createElement("img");
  image.src = assetUrl(item.cover);
  image.alt = item.alt || `${item.title} furniture`;
  if (index > 5) image.loading = "lazy";
  media.append(image);

  const caption = document.createElement("span");
  caption.className = "project-caption";
  const title = document.createElement("span");
  title.className = "project-title";
  title.textContent = item.title;
  const note = document.createElement("span");
  note.className = "project-note";
  note.textContent = item.category || item.collection || "Furniture";
  caption.append(title, note);
  link.append(media, caption);
  article.append(link);
  return article;
}

function bindFurnitureCards() {
  const cards = [...document.querySelectorAll(".project-card")];
  const activate = (card) => {
    if (!card || card.classList.contains("is-active")) return;
    cards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
  };

  cards.forEach((card) => {
    const link = card.querySelector(".project-link");
    card.addEventListener("pointerenter", () => activate(card));
    link?.addEventListener("focus", () => activate(card));
    link?.addEventListener("click", (event) => {
      event.preventDefault();
      activate(card);
    });
  });

  const requestedSlug = decodeURIComponent(window.location.hash.slice(1));
  const requestedCard = requestedSlug
    ? cards.find((card) => card.querySelector(".project-link")?.getAttribute("href") === `#${requestedSlug}`)
    : null;
  if (requestedCard) activate(requestedCard);
}

function renderComingSoon() {
  grid.classList.add("is-coming-soon");
  const message = document.createElement("div");
  message.className = "furniture-coming-soon";
  message.setAttribute("role", "status");
  message.setAttribute("aria-label", "COMING SOON");

  const image = document.createElement("img");
  image.className = "furniture-coming-soon-image";
  image.src = "/assets/images/furniture-coming-soon-study.jpg.webp";
  image.alt = "";
  image.setAttribute("aria-hidden", "true");

  const line = document.createElement("span");
  line.className = "furniture-coming-soon-line";
  line.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "furniture-coming-soon-text";
  text.textContent = "COMING SOON";
  line.append(text);

  [["ON", "on"], ["CO", "co"]].forEach(([content, position]) => {
    const shadow = document.createElement("span");
    shadow.className = `furniture-coming-soon-shadow furniture-coming-soon-shadow--${position}`;
    shadow.dataset.text = content;
    shadow.setAttribute("aria-hidden", "true");
    shadow.textContent = content;
    line.append(shadow);
  });

  message.append(image, line);
  grid.replaceChildren(message);
}

async function loadFurniture() {
  if (!grid) return;
  try {
    const response = await fetch("/content/furniture/index.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Furniture index returned ${response.status}`);
    const data = await response.json();
    const furniture = Array.isArray(data.furniture)
      ? data.furniture.filter((item) => item.published !== false)
      : [];
    if (!furniture.length) {
      renderComingSoon();
      return;
    }
    grid.classList.remove("is-coming-soon");
    grid.replaceChildren(...furniture.map(createFurnitureCard));
  } catch (error) {
    console.warn("Showing the furniture coming-soon state.", error);
    renderComingSoon();
    return;
  }
  bindFurnitureCards();
}

loadFurniture();

furnitureUpdateChannel?.addEventListener("message", (event) => {
  if (event.data?.type === "furniture-updated") loadFurniture();
});

window.addEventListener("storage", (event) => {
  if (event.key === FURNITURE_UPDATE_CHANNEL) loadFurniture();
});

window.addEventListener("focus", loadFurniture);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) loadFurniture();
});
