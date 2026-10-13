const grid = document.querySelector("#project-grid");

function assetUrl(path) {
  return /^(?:[a-z]+:|\/)/i.test(path || "") ? path : `/${path || ""}`;
}

function createProjectCard(project, index) {
  const article = document.createElement("article");
  article.className = `project-card${index === 0 ? " is-active" : ""}`;
  article.dataset.category = project.category || "";
  const link = document.createElement("a");
  link.className = "project-link";
  link.href = project.hasDetail ? `/project/${encodeURIComponent(project.slug)}` : "/contact.html";
  link.setAttribute("aria-label", `View ${project.title} ${project.area || ""} project`.trim());
  const media = document.createElement("span");
  media.className = "project-media";
  const image = document.createElement("img");
  image.src = assetUrl(project.cover);
  image.alt = `${project.title} project`;
  if (index > 5) image.loading = "lazy";
  media.append(image);
  const caption = document.createElement("span");
  caption.className = "project-caption";
  const title = document.createElement("span");
  title.className = "project-title";
  title.textContent = [project.title, project.area].filter(Boolean).join(" ｜ ");
  const note = document.createElement("span");
  note.className = "project-note";
  note.textContent = project.category || "Project note";
  caption.append(title, note);
  link.append(media, caption);
  article.append(link);
  return article;
}

function bindProjectCards() {
  const projectCards = [...document.querySelectorAll(".project-card")];
  const activateProject = (card) => {
    if (!card || card.classList.contains("is-active")) return;
    projectCards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
  };
  projectCards.forEach((card) => {
    const link = card.querySelector(".project-link");
    card.addEventListener("pointerenter", () => activateProject(card));
    link?.addEventListener("focus", () => activateProject(card));
    link?.addEventListener("click", (event) => {
      if (!link.getAttribute("href")?.startsWith("#")) return;
      event.preventDefault();
      activateProject(card);
    });
  });
}

async function loadProjects() {
  if (!grid) return;
  try {
    const response = await fetch("/content/projects/index.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Project index returned ${response.status}`);
    const data = await response.json();
    const projects = Array.isArray(data.projects) ? data.projects.filter((project) => project.published !== false) : [];
    if (!projects.length) throw new Error("Project index is empty");
    grid.replaceChildren(...projects.map(createProjectCard));
  } catch (error) {
    console.warn("Using the project page fallback markup.", error);
  }
  bindProjectCards();
}

loadProjects();

document.querySelectorAll(".projects-filter [data-category]").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelectorAll(".projects-filter [data-category]").forEach((item) => {
      if (item === filter) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
    document.querySelectorAll(".project-card").forEach((card) => {
      const category = card.dataset.category;
      card.hidden = filter.dataset.category !== "All" && category !== filter.dataset.category &&
        !(filter.dataset.category === "Residential" && category === "Private Villa");
    });
  });
});
