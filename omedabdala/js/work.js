(() => {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const grid = document.getElementById("workGrid");
  const emptyState = document.getElementById("emptyState");
  const projectCount = document.getElementById("projectCount");
  const filters = [...document.querySelectorAll(".filter")];

  const viewer = document.getElementById("viewer");
  const stage = document.getElementById("viewerStage");
  const image = document.getElementById("viewerImage");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerNumber = document.getElementById("viewerNumber");
  const viewerDescription = document.getElementById("viewerDescription");
  const viewerCategory = document.getElementById("viewerCategory");
  const viewerYear = document.getElementById("viewerYear");
  const viewerClose = document.getElementById("viewerClose");
  const viewerTheme = document.getElementById("viewerTheme");
  const previousSlide = document.getElementById("previousSlide");
  const nextSlide = document.getElementById("nextSlide");
  const slideCounter = document.getElementById("slideCounter");
  const timeline = document.getElementById("viewerTimeline");
  const thumbs = document.getElementById("viewerThumbs");
  const zoomRange = document.getElementById("zoomRange");
  const zoomIn = document.getElementById("zoomIn");
  const zoomOut = document.getElementById("zoomOut");
  const resetZoom = document.getElementById("resetZoom");

  let currentProject = 0;
  let currentSlide = 0;
  let scale = 1;
  let position = { x: 0, y: 0 };
  let pointerStart = { x: 0, y: 0 };
  let dragStart = { x: 0, y: 0 };
  let dragging = false;
  let currentImages = [];
  let activeFilter = "all";

  function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }

  function getProjectImages(project) {
    if (!project) return [];

    const explicitImages = currentTheme() === "light"
      ? project.imagesLight
      : project.imagesDark;

    if (Array.isArray(explicitImages) && explicitImages.length) {
      return explicitImages;
    }

    const legacyImages = Array.isArray(project.images) ? project.images : [];
    const themeMarker = currentTheme() === "light" ? "-light." : "-dark.";
    const matchingImages = legacyImages.filter((source) =>
      source.toLowerCase().includes(themeMarker)
    );

    if (matchingImages.length) {
      return matchingImages;
    }

    const fallbackCover = currentTheme() === "light"
      ? project.coverLight
      : project.coverDark;

    return fallbackCover ? [fallbackCover] : [];
  }

  function syncViewerTheme() {
    viewer?.classList.toggle("is-light", currentTheme() === "light");
  }

  if (projectCount) {
    projectCount.textContent = `${String(projects.length).padStart(2, "0")} PROJECTS`;
  }

  function renderGrid(filter = "all") {
    if (!grid) return;

    const visible = filter === "all"
      ? projects
      : projects.filter((project) => project.categories.includes(filter));

    grid.innerHTML = visible.map((project) => `
      <article class="work-card reveal" tabindex="0" role="button"
        aria-label="Open ${project.title}" data-project="${project.id}">
        <div class="work-card__media">
          <img
            src="${document.documentElement.dataset.theme === "light" ? project.coverLight : project.coverDark}"
            srcset="${document.documentElement.dataset.theme === "light"
              ? project.coverLightSrcset
              : project.coverDarkSrcset}"
            sizes="(max-width: 767px) calc(100vw - 36px),
                   (max-width: 1050px) calc((100vw - 90px) / 2),
                   min(31vw, 470px)"
            data-dark-src="${project.coverDark}"
            data-light-src="${project.coverLight}"
            data-dark-srcset="${project.coverDarkSrcset}"
            data-light-srcset="${project.coverLightSrcset}"
            alt="${project.title} project cover"
            decoding="async"
            loading="lazy">
        </div>

        <div class="work-card__body">
          <div class="work-card__eyebrow">
            <span>${project.number}</span>
            <span>${project.year}</span>
          </div>

          <h2>${project.title}</h2>

          <div class="work-card__footer">
            <span>${project.subtitle}</span>
            <span class="work-card__open">+</span>
          </div>
        </div>
      </article>
    `).join("");

    if (emptyState) emptyState.style.display = visible.length ? "none" : "block";

    grid.querySelectorAll(".work-card").forEach((card) => {
      const activate = () => {
        const index = projects.findIndex((project) => project.id === card.dataset.project);
        openViewer(index, 0);
      };

      card.addEventListener("click", activate);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        activate();
      });

      requestAnimationFrame(() => card.classList.add("is-visible"));
    });
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderGrid(button.dataset.filter);
    });
  });

  function openViewer(projectIndex, slideIndex = 0) {
    if (!projects[projectIndex] || !viewer) return;

    currentProject = projectIndex;
    currentSlide = slideIndex;

    const project = projects[currentProject];
    currentImages = getProjectImages(project);
    currentSlide = Math.min(currentSlide, Math.max(0, currentImages.length - 1));
    syncViewerTheme();

    viewerTitle.textContent = project.title;
    viewerNumber.textContent = project.number;
    viewerDescription.textContent = project.description;
    viewerCategory.textContent = project.subtitle;
    viewerYear.textContent = project.year;

    buildNavigation(project);
    loadSlide();

    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
    history.replaceState(null, "", `#${project.id}`);
  }

  function closeViewer() {
    if (!viewer) return;

    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");
    history.replaceState(null, "", location.pathname);
  }

  function buildNavigation(project) {
    currentImages = getProjectImages(project);

    timeline.innerHTML = currentImages.map((_, index) => `
      <button class="${index === currentSlide ? "is-active" : ""}"
        data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>
    `).join("");

    thumbs.innerHTML = currentImages.map((source, index) => `
      <button class="${index === currentSlide ? "is-active" : ""}"
        data-slide="${index}" aria-label="Open slide ${index + 1}">
        <img src="${source}" alt="">
      </button>
    `).join("");

    [...timeline.querySelectorAll("button"), ...thumbs.querySelectorAll("button")]
      .forEach((button) => {
        button.addEventListener("click", () => {
          currentSlide = Number(button.dataset.slide);
          loadSlide();
        });
      });
  }

  function loadSlide() {
    const project = projects[currentProject];
    if (!project || !image) return;

    currentImages = getProjectImages(project);

    if (!currentImages.length) return;

    currentSlide = Math.min(currentSlide, currentImages.length - 1);
    image.style.opacity = "0";
    image.src = currentImages[currentSlide];
    image.alt = `${project.title}, slide ${currentSlide + 1}`;

    image.onload = () => {
      resetTransform();
      image.style.opacity = "1";
    };

    slideCounter.textContent =
      `${String(currentSlide + 1).padStart(2, "0")} / ${String(currentImages.length).padStart(2, "0")}`;

    timeline.querySelectorAll("button").forEach((button, index) => {
      button.classList.toggle("is-active", index === currentSlide);
    });

    thumbs.querySelectorAll("button").forEach((button, index) => {
      button.classList.toggle("is-active", index === currentSlide);
    });
  }

  function moveSlide(direction) {
    const project = projects[currentProject];
    if (!project) return;

    currentImages = getProjectImages(project);
    if (!currentImages.length) return;

    currentSlide =
      (currentSlide + direction + currentImages.length) % currentImages.length;
    loadSlide();
  }

  function setScale(nextScale) {
    scale = Math.min(4, Math.max(.5, nextScale));
    zoomRange.value = String(Math.round(scale * 100));
    applyTransform();
  }

  function applyTransform() {
    image.style.transform =
      `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1;
    position = { x: 0, y: 0 };
    zoomRange.value = "100";
    applyTransform();
  }

  stage?.addEventListener("wheel", (event) => {
    event.preventDefault();
    setScale(scale + (event.deltaY < 0 ? .12 : -.12));
  }, { passive: false });

  stage?.addEventListener("pointerdown", (event) => {
    dragging = true;
    stage.classList.add("is-dragging");
    pointerStart = { x: event.clientX, y: event.clientY };
    dragStart = { ...position };
    stage.setPointerCapture(event.pointerId);
  });

  stage?.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    position.x = dragStart.x + event.clientX - pointerStart.x;
    position.y = dragStart.y + event.clientY - pointerStart.y;
    applyTransform();
  });

  const stopDragging = () => {
    dragging = false;
    stage?.classList.remove("is-dragging");
  };

  stage?.addEventListener("pointerup", stopDragging);
  stage?.addEventListener("pointercancel", stopDragging);
  stage?.addEventListener("dblclick", resetTransform);

  zoomRange?.addEventListener("input", () => setScale(Number(zoomRange.value) / 100));
  zoomIn?.addEventListener("click", () => setScale(scale + .2));
  zoomOut?.addEventListener("click", () => setScale(scale - .2));
  resetZoom?.addEventListener("click", resetTransform);
  previousSlide?.addEventListener("click", () => moveSlide(-1));
  nextSlide?.addEventListener("click", () => moveSlide(1));
  viewerClose?.addEventListener("click", closeViewer);
  viewerTheme?.addEventListener("click", () => {
    document.getElementById("themeToggle")?.click();
  });

  document.addEventListener("keydown", (event) => {
    if (!viewer?.classList.contains("is-open")) return;

    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowRight") moveSlide(1);
    if (event.key === "ArrowLeft") moveSlide(-1);
    if (event.key === "+" || event.key === "=") setScale(scale + .2);
    if (event.key === "-") setScale(scale - .2);
    if (event.key === "0") resetTransform();
  });


  window.addEventListener("portfolio:themechange", () => {
    renderGrid(activeFilter);
    syncViewerTheme();

    if (viewer?.classList.contains("is-open")) {
      currentSlide = 0;
      const project = projects[currentProject];
      buildNavigation(project);
      loadSlide();
    }
  });

  renderGrid();
  syncViewerTheme();

  const hash = location.hash.replace("#", "");
  const initialIndex = projects.findIndex((project) => project.id === hash);

  if (initialIndex >= 0) {
    setTimeout(() => openViewer(initialIndex, 0), 220);
  }
})();
