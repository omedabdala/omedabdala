'use strict';

const body = document.body;
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const progress = document.querySelector('.scroll-progress span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenu(open) {
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  const menuLabel = menuToggle?.querySelector('[data-menu-label]');
  if (menuLabel) menuLabel.textContent = open ? 'Close' : 'SECTION';
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  mobileMenu?.classList.toggle('is-open', open);
  body.classList.toggle('menu-open', open);
}

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

function fastScrollTo(target, duration = 420) {
  if (!target) return;
  if (reducedMotion) {
    target.scrollIntoView();
    return;
  }
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY;
  const distance = end - start;
  const startedAt = performance.now();
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const frame = now => {
    const animationProgress = Math.min(1, (now - startedAt) / duration);
    window.scrollTo(0, start + distance * easeOutCubic(animationProgress));
    if (animationProgress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href === '#') return;
  const target = document.querySelector(href);
  if (!target) return;
  event.preventDefault();
  setMenu(false);
  fastScrollTo(target, 420);
  history.replaceState(null, '', href);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setMenu(false);
    document.querySelector('[data-dialog][open]')?.close();
  }
});

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 28);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(1, y / max) : 0;
  if (progress) progress.style.transform = `scaleX(${ratio})`;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ==========================================================
   CLIENT PROJECTS — ADD NEW CLIENTS HERE

   1. Add the cover and gallery images to:
      assets/images/projects/
   2. Duplicate one project object below.
   3. Give it a unique id and update its text/images.

   All projects automatically appear on Works.
   Up to six projects with showOnHome: true appear on Home.
   ========================================================== */
const HOME_PROJECT_LIMIT = 6;

const projectList = [
  {
    id: 'danex',
    showOnHome: true,
    category: 'Pharmaceutical brand design',
    cardCategory: 'Digital & print design',
    filterCategory: 'identity',
    title: 'Danex Pharma',
    summary: 'Ongoing visual direction for Instagram, product campaigns, digital communication and production-ready print artwork.',
    description: 'Danex Pharma presents VariVital wellness products, including adult multivitamins, Vitamin D3 and Collatin collagen + biotin support. For this project, I created a flexible visual direction and can manage the company’s design needs across both digital and print—from Instagram content and product campaigns to promotional materials and production-ready artwork.',
    instagram: 'https://www.instagram.com/danexpharma/',
    instagramLabel: 'View @danexpharma on Instagram',
    cover: {
      src: 'assets/clients/danex-cover.jpg',
      alt: 'Danex Pharma logo presented on a blue illuminated background'
    },
    meta: [
      ['Role', 'Visual direction & design'],
      ['Scope', 'Instagram / digital / print'],
      ['Tools', 'Illustrator / Photoshop / AI'],
      ['Delivery', 'Screen to production']
    ],
    images: [
      {
        src: 'assets/clients/danex-cover.jpg',
        alt: 'Danex Pharma logo presented on a blue illuminated background',
        caption: 'Danex Pharma project cover and visual direction'
      },
      {
        src: 'assets/clients/danex-products.jpg',
        alt: 'VariVital Collatin, Multivit Adult and Vitamin D3 product bottles presented together',
        caption: 'VariVital product campaign visual for digital and print use'
      }
    ]
  }
];

const projectById = Object.fromEntries(projectList.map(project => [project.id, project]));

function projectNumber(index) {
  return String(index + 1).padStart(2, '0');
}

function renderHomeProject(project, index) {
  return `
    <button aria-label="Open ${project.title} case study" class="project-card reveal" data-project="${project.id}" data-reveal="up" data-tilt type="button">
      <div class="project-card__visual project-card__visual--image">
        <img src="${project.cover.src}" alt="${project.cover.alt}" width="2000" height="1400" loading="${index === 0 ? 'eager' : 'lazy'}">
      </div>
      <div class="project-card__meta"><span>${project.category}</span><span>${projectNumber(index)}</span></div>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
    </button>`;
}

function renderWorkProject(project, index) {
  return `
    <article class="work-card reveal" data-category="${project.filterCategory}" data-project-card data-reveal="up" id="${project.id}">
      <button aria-label="Open ${project.title} project" class="work-card__open" data-project="${project.id}" type="button">
        <span class="work-card__art work-card__art--image">
          <img src="${project.cover.src}" alt="${project.cover.alt}" width="2000" height="1400" loading="${index < 3 ? 'eager' : 'lazy'}">
        </span>
        <span class="work-card__info">
          <span><small>${project.cardCategory}</small><b>${project.title}</b></span>
          <i>View case study ↗</i>
        </span>
      </button>
    </article>`;
}

function renderProjectGrids() {
  const homeGrid = document.querySelector('[data-project-grid="home"]');
  if (homeGrid) {
    const selectedProjects = projectList.filter(project => project.showOnHome).slice(0, HOME_PROJECT_LIMIT);
    homeGrid.innerHTML = selectedProjects.map(renderHomeProject).join('');
  }

  const worksGrid = document.querySelector('[data-project-grid="works"]');
  if (worksGrid) worksGrid.innerHTML = projectList.map(renderWorkProject).join('');

  const count = projectList.length;
  document.querySelectorAll('[data-project-count]').forEach(node => {
    node.textContent = `${String(count).padStart(2, '0')} client project${count === 1 ? '' : 's'}`;
  });
}

renderProjectGrids();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .13, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

const menuLinks = [...document.querySelectorAll('.menu-link')];
if ((body.dataset.page === 'home' || body.dataset.page === 'about-contact') && menuLinks.length) {
  const navItems = menuLinks
    .map(link => {
      const target = link.dataset.navSection;
      const section = target === 'selected' ? document.querySelector('.selected') : document.querySelector(`#${target}`);
      return section ? { section, link } : null;
    })
    .filter(Boolean);

  let navFrame = 0;
  const updateActiveMenu = () => {
    navFrame = 0;
    if (!navItems.length) return;
    const probe = window.scrollY + Math.max(150, Math.min(window.innerHeight * .34, 360));
    let current = navItems[0];
    navItems.forEach(item => {
      if (item.section.offsetTop <= probe) current = item;
    });
    menuLinks.forEach(link => {
      const active = link === current.link;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const requestMenuUpdate = () => {
    if (!navFrame) navFrame = requestAnimationFrame(updateActiveMenu);
  };
  window.addEventListener('scroll', requestMenuUpdate, { passive: true });
  window.addEventListener('resize', requestMenuUpdate);
  updateActiveMenu();
}

if (!reducedMotion) {
  const heroFigure = document.querySelector('[data-hero-figure]');
  window.addEventListener('pointermove', event => {
    if (!heroFigure || window.innerWidth < 960) return;
    const x = (event.clientX / window.innerWidth - .5) * 14;
    const y = (event.clientY / window.innerHeight - .5) * 10;
    heroFigure.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }, { passive: true });

  document.querySelectorAll('[data-magnetic]').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .12;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener('pointerleave', () => button.style.transform = '');
  });

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const rx = ((event.clientY - rect.top) / rect.height - .5) * -3;
      const ry = ((event.clientX - rect.left) / rect.width - .5) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
}

const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-project-card]')];
filters.forEach(filter => filter.addEventListener('click', () => {
  const value = filter.dataset.filter;
  filters.forEach(item => item.classList.toggle('is-active', item === filter));
  cards.forEach(card => {
    const visible = value === 'all' || card.dataset.category === value;
    card.classList.toggle('is-filtered', !visible);
  });
}));

function renderProjectGallery(project) {
  return project.images.map((image, index) => `
    <figure class="case-shot case-shot--image">
      <img class="case-shot__image" src="${image.src}" alt="${image.alt}" width="2000" height="1400" loading="${index === 0 ? 'eager' : 'lazy'}">
      <figcaption><span>${projectNumber(index)}</span>${image.caption}</figcaption>
    </figure>`).join('');
}

const dialog = document.querySelector('[data-dialog]');
function closeProject() {
  if (!dialog?.open) return;
  dialog.close();
  body.classList.remove('dialog-open');
}

function openProject(id) {
  const project = projectById[id];
  if (!dialog || !project) return;
  dialog.dataset.project = id;
  dialog.querySelector('[data-case-category]').textContent = project.category;
  dialog.querySelector('[data-case-title]').textContent = project.title;
  dialog.querySelector('[data-case-description]').textContent = project.description;
  dialog.querySelector('[data-case-meta]').innerHTML = project.meta.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');
  dialog.querySelector('[data-case-gallery]').innerHTML = renderProjectGallery(project);

  const instagram = dialog.querySelector('[data-case-instagram]');
  if (instagram) {
    instagram.hidden = !project.instagram;
    if (project.instagram) {
      instagram.href = project.instagram;
      instagram.innerHTML = `${project.instagramLabel || 'View project on Instagram'} <span>↗</span>`;
    }
  }

  dialog.showModal();
  body.classList.add('dialog-open');
  dialog.querySelector('.case-dialog__gallery').scrollTop = 0;
  dialog.querySelector('.case-dialog__summary').scrollTop = 0;
}

document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project)));
document.querySelector('[data-dialog-close]')?.addEventListener('click', closeProject);
dialog?.addEventListener('close', () => body.classList.remove('dialog-open'));
dialog?.addEventListener('click', event => {
  if (event.target === dialog) closeProject();
});

const hashProject = location.hash.replace('#', '');
if (body.dataset.page === 'works' && projectById[hashProject]) {
  window.addEventListener('load', () => openProject(hashProject), { once: true });
}

document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
