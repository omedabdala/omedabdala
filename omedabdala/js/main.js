(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress span");
  const themeToggle = document.getElementById("themeToggle");
  const mobileThemeToggle = document.getElementById("mobileThemeToggle");
  const menuTrigger = document.getElementById("menuTrigger");
  const mobileMenu = document.getElementById("mobileMenu");

  function currentTheme() {
    return root.dataset.theme === "light" ? "light" : "dark";
  }

  let themeIsChanging = false;

  function updateThemeImages(theme = currentTheme()) {
    document.querySelectorAll("[data-dark-src][data-light-src]").forEach((image) => {
      const nextSource = theme === "light"
        ? image.dataset.lightSrc
        : image.dataset.darkSrc;

      const nextSrcset = theme === "light"
        ? image.dataset.lightSrcset
        : image.dataset.darkSrcset;

      if (nextSrcset) {
        image.srcset = nextSrcset;
      } else {
        image.removeAttribute("srcset");
      }

      if (!nextSource || image.getAttribute("src") === nextSource) return;

      image.classList.add("is-theme-swapping");
      image.src = nextSource;

      const finishSwap = () => {
        image.classList.remove("is-theme-swapping");
      };

      if (image.complete) {
        requestAnimationFrame(finishSwap);
      } else {
        image.addEventListener("load", finishSwap, { once: true });
        image.addEventListener("error", finishSwap, { once: true });
      }
    });
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("omed-theme", theme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = theme === "dark" ? "#231f20" : "#ffffff";
    }

    updateThemeImages(theme);

    window.dispatchEvent(new CustomEvent("portfolio:themechange", {
      detail: { theme }
    }));
  }

  const savedTheme = localStorage.getItem("omed-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    root.dataset.theme = savedTheme;
  }

  function toggleTheme() {
    if (themeIsChanging) return;

    themeIsChanging = true;
    const nextTheme = currentTheme() === "dark" ? "light" : "dark";

    root.classList.add("theme-changing");

    setTimeout(() => {
      applyTheme(nextTheme);
      root.classList.add("theme-changed");

      setTimeout(() => {
        root.classList.remove("theme-changing", "theme-changed");
        themeIsChanging = false;
      }, 95);
    }, 55);
  }

  themeToggle?.addEventListener("click", toggleTheme);
  mobileThemeToggle?.addEventListener("click", toggleTheme);

  function setActiveNav(target) {
    document.querySelectorAll("[data-nav-target]").forEach((link) => {
      const active = link.dataset.navTarget === target;
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveSection() {
    const about = document.getElementById("about");
    const nav = document.querySelector("[data-scroll-nav]");

    if (!about || !nav) return;

    const headerHeight = header?.offsetHeight || 0;
    const activationPoint = about.offsetTop - headerHeight - Math.min(innerHeight * 0.22, 180);
    setActiveNav(scrollY >= activationPoint ? "about" : "home");
  }

  function updateScrollUI() {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    const ratio = maximum > 0 ? scrollY / maximum : 0;

    if (progress) progress.style.width = `${ratio * 100}%`;
    header?.classList.toggle("is-scrolled", scrollY > 18);
    updateActiveSection();
  }

  addEventListener("scroll", updateScrollUI, { passive: true });
  addEventListener("resize", updateScrollUI);
  updateScrollUI();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  function setMenu(open) {
    menuTrigger?.classList.toggle("is-open", open);
    mobileMenu?.classList.toggle("is-open", open);
    menuTrigger?.setAttribute("aria-expanded", String(open));
    menuTrigger?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu?.setAttribute("aria-hidden", String(!open));
    body.classList.toggle("menu-open", open);
  }

  menuTrigger?.addEventListener("click", () => {
    setMenu(!mobileMenu?.classList.contains("is-open"));
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
      setMenu(false);
    }
  });

  addEventListener("resize", () => {
    if (innerWidth > 1050 && mobileMenu?.classList.contains("is-open")) {
      setMenu(false);
    }
  });

  const selectedContainer = document.getElementById("selectedProjects");

  if (selectedContainer && window.PORTFOLIO_PROJECTS) {
    selectedContainer.innerHTML = window.PORTFOLIO_PROJECTS.slice(0, 3).map((project) => `
      <a class="selected-card reveal" href="work.html#${project.id}">
        <div class="selected-card__media">
          <img
            src="${currentTheme() === "light" ? project.coverLight : project.coverDark}"
            srcset="${currentTheme() === "light"
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

        <div class="selected-card__body">
          <span class="selected-card__number">${project.number}</span>

          <div>
            <h3>${project.title}</h3>
            <span class="selected-card__type">${project.subtitle}</span>
          </div>

          <span class="selected-card__year">${project.year}</span>
        </div>
      </a>
    `).join("");

    selectedContainer.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });
  }

  updateThemeImages();
})();
