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
    const progress = Math.min(1, (now - startedAt) / duration);
    window.scrollTo(0, start + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(frame);
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

const projects = {
  danex: {
    category: 'Brand identity', title: 'DanexPharma', code: 'DX', tagline: 'Trust in motion',
    description: 'A precise identity system built around trust, forward movement and clarity. The mark is engineered to stay recognizable across packaging, print, signage and digital applications.',
    meta: [['Role','Identity direction'],['Focus','Logo / system'],['Output','Production ready']],
    theme: { accent: '#af2024', base: '#efeeea', ink: '#111214', soft: '#d7d5cf' },
    shots: ['Primary mark and wordmark', 'Color, type and identity rules', 'Business and packaging applications', 'Campaign detail and brand language']
  },
  kawa: {
    category: 'Editorial design', title: 'Kawa Abban', code: 'KA', tagline: 'Rhythm in print',
    description: 'A restrained book system that uses typography, rhythm, scale and material contrast to create a focused reading experience with a strong physical presence.',
    meta: [['Role','Art direction'],['Focus','Book / layout'],['Output','Print ready']],
    theme: { accent: '#d8d4ca', base: '#151517', ink: '#f7f5ef', soft: '#55545a' },
    shots: ['Cover direction and title system', 'Typography and editorial grid', 'Cover, spine and page applications', 'Close-up layout and material detail']
  },
  wild: {
    category: 'Campaign design', title: 'Wild Tiger', code: 'WT', tagline: 'Noise. Instinct. Energy.',
    description: 'A high-energy visual language created for posters, banners and environmental applications. The system balances raw impact with a clear, repeatable structure.',
    meta: [['Role','Visual direction'],['Focus','Poster campaign'],['Output','Large format']],
    theme: { accent: '#f2e7d9', base: '#b71920', ink: '#ffffff', soft: '#7f1015' },
    shots: ['Campaign title and key visual', 'Type, contrast and graphic system', 'Poster and banner applications', 'Large-format campaign detail']
  },
  kodama: {
    category: 'Environmental design', title: 'Kodama Signage', code: 'KD', tagline: 'Space made legible',
    description: 'A clean environmental identity designed to guide, identify and strengthen a physical space through disciplined typography, scale and production-aware detailing.',
    meta: [['Role','Sign system'],['Focus','Environment'],['Output','Fabrication ready']],
    theme: { accent: '#af2024', base: '#d8d6d0', ink: '#111214', soft: '#aaa8a2' },
    shots: ['Signage identity and naming', 'Wayfinding type and icon system', 'Interior and exterior applications', 'Fabrication detail and scale']
  },
  northline: {
    category: 'Brand identity', title: 'Northline', code: 'NL', tagline: 'Built to move north',
    description: 'A contemporary identity concept with a strong typographic core, modular applications and a precise visual system built to scale across multiple brand touchpoints.',
    meta: [['Role','Brand concept'],['Focus','Identity system'],['Output','Digital / print']],
    theme: { accent: '#d3292f', base: '#090a0b', ink: '#ffffff', soft: '#323439' },
    shots: ['Monogram and wordmark system', 'Core color and typography rules', 'Stationery and digital applications', 'Identity detail and modular rhythm']
  },
  afterdark: {
    category: 'Poster series', title: 'After Dark', code: 'AD', tagline: 'Tension after silence',
    description: 'An experimental poster series exploring contrast, tension and limited color. The compositions use typography as image and restraint as a source of intensity.',
    meta: [['Role','Art direction'],['Focus','Poster series'],['Output','Print / social']],
    theme: { accent: '#d3292f', base: '#111114', ink: '#ffffff', soft: '#35171a' },
    shots: ['Series title and poster language', 'Type hierarchy and visual tension', 'Poster set and social crops', 'Close-up composition detail']
  }
};

function projectVariables(project) {
  const { accent, base, ink, soft } = project.theme;
  return `--shot-accent:${accent};--shot-bg:${base};--shot-ink:${ink};--shot-soft:${soft}`;
}

function renderProjectGallery(project, id) {
  const variables = projectVariables(project);
  const labels = project.shots;
  const visualTitle = project.title.replace(/([a-z])([A-Z])/g, '$1<wbr>$2');
  return `
    <figure class="case-shot case-shot--hero case-shot--${id}" style="${variables}">
      <div class="case-shot__canvas case-visual case-visual--hero">
        <span class="case-visual__number">01</span>
        <strong>${project.code}</strong>
        <div class="case-visual__title"><small>${project.category}</small><b>${visualTitle}</b><p>${project.tagline}</p></div>
      </div>
      <figcaption><span>01</span>${labels[0]}</figcaption>
    </figure>
    <figure class="case-shot case-shot--system case-shot--${id}" style="${variables}">
      <div class="case-shot__canvas case-visual case-visual--system">
        <div class="case-system__swatches"><i></i><i></i><i></i><i></i></div>
        <div class="case-system__type"><span>Aa</span><div><b>${project.title}</b><small>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789</small></div></div>
        <p>${project.tagline}</p>
      </div>
      <figcaption><span>02</span>${labels[1]}</figcaption>
    </figure>
    <figure class="case-shot case-shot--applications case-shot--${id}" style="${variables}">
      <div class="case-shot__canvas case-visual case-visual--applications">
        <article><small>${project.code} / 01</small><b>${project.title}</b><i>${project.tagline}</i></article>
        <article><span>${project.code}</span><small>${project.category}</small></article>
        <article><b>${project.title}</b><p>${project.description.split('.')[0]}.</p></article>
      </div>
      <figcaption><span>03</span>${labels[2]}</figcaption>
    </figure>
    <figure class="case-shot case-shot--detail case-shot--${id}" style="${variables}">
      <div class="case-shot__canvas case-visual case-visual--detail">
        <span>${project.code}</span><strong>${project.title}</strong><span>${project.code}</span>
        <div><small>Visual system / Selected detail</small><b>${project.tagline}</b><i>Omed Abdala — Graphic Design</i></div>
      </div>
      <figcaption><span>04</span>${labels[3]}</figcaption>
    </figure>`;
}

const dialog = document.querySelector('[data-dialog]');
function closeProject() {
  if (!dialog?.open) return;
  dialog.close();
  body.classList.remove('dialog-open');
}

function openProject(id) {
  const project = projects[id];
  if (!dialog || !project) return;
  dialog.dataset.project = id;
  dialog.querySelector('[data-case-category]').textContent = project.category;
  dialog.querySelector('[data-case-title]').textContent = project.title;
  dialog.querySelector('[data-case-description]').textContent = project.description;
  dialog.querySelector('[data-case-meta]').innerHTML = project.meta.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');
  dialog.querySelector('[data-case-gallery]').innerHTML = renderProjectGallery(project, id);
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
const hashMap = { 'danex': 'danex', 'kawa': 'kawa', 'wild-tiger': 'wild' };
if (body.dataset.page === 'works' && hashMap[hashProject]) {
  window.addEventListener('load', () => openProject(hashMap[hashProject]), { once: true });
}

document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
