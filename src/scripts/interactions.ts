import { initTelemetry, trackEvent } from './telemetry';

let revealObserver: IntersectionObserver | null = null;
let stackObserver: IntersectionObserver | null = null;
let stepObserver: IntersectionObserver | null = null;
let lightboxDocBound = false;
let mobileDocBound = false;

function setupReveals(): void {
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }

  const elements = document.querySelectorAll<HTMLElement>('.reveal');
  if (!elements.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -24px 0px' },
  );

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('is-visible');
    } else {
      revealObserver?.observe(el);
    }
  });
}

/** B2: Entregáveis empilhados que deslizam uma vez ao entrar na tela */
function setupStackedDeliverables(): void {
  if (stackObserver) {
    stackObserver.disconnect();
    stackObserver = null;
  }

  const stacks = document.querySelectorAll<HTMLElement>('[data-stack]');
  if (!stacks.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    stacks.forEach((el) => el.classList.add('is-stacked'));
    return;
  }

  stackObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-stacked');
          stackObserver?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.25 },
  );

  stacks.forEach((el) => stackObserver?.observe(el));
}

/** B3: Navegação lateral fixa de etapas na página Diagnóstico (desktop) */
function setupStickySteps(): void {
  if (stepObserver) {
    stepObserver.disconnect();
    stepObserver = null;
  }

  const panels = document.querySelectorAll<HTMLElement>('[data-step-panel]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-step-link]');
  if (!panels.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const setActive = (id: string) => {
    navLinks.forEach((link) => {
      const isCurrent = link.dataset.stepLink === id;
      link.classList.toggle('is-active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'step');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  stepObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        const id = (visible[0].target as HTMLElement).dataset.stepPanel;
        if (id) setActive(id);
      }
    },
    { rootMargin: '-22% 0px -55% 0px', threshold: 0.1 },
  );

  panels.forEach((panel) => stepObserver?.observe(panel));
}

/** Lightbox acessível via elemento nativo <dialog> (seguro em View Transitions) */
function setupLightbox(): void {
  const dialog = document.getElementById('dls-lightbox') as HTMLDialogElement | null;
  const closeBtn = document.getElementById('dls-lightbox-close') as HTMLButtonElement | null;

  if (dialog && dialog.dataset.bound !== 'true') {
    dialog.dataset.bound = 'true';
    closeBtn?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  if (lightboxDocBound) return;
  lightboxDocBound = true;

  document.addEventListener('click', (event) => {
    const trigger = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-zoom-src]');
    if (!trigger) return;

    const currentDialog = document.getElementById('dls-lightbox') as HTMLDialogElement | null;
    const img = document.getElementById('dls-lightbox-img') as HTMLImageElement | null;
    const caption = document.getElementById('dls-lightbox-caption') as HTMLElement | null;
    if (!currentDialog || !img) return;

    const src = trigger.dataset.zoomSrc;
    const alt = trigger.dataset.zoomAlt || '';
    const note = trigger.dataset.zoomCaption || alt;
    const servico = trigger.dataset.zoomServico;

    if (!src) return;
    img.src = src;
    img.alt = alt;
    if (caption) caption.textContent = note;
    if (servico) {
      trackEvent('servico_visualizado', { servico });
    }
    currentDialog.showModal();
  });
}

/** Menu móvel acessível (seguro em View Transitions) */
function setupMobileNav(): void {
  const toggle = document.getElementById('mobile-nav-toggle') as HTMLButtonElement | null;
  const menu = document.getElementById('mobile-nav-panel') as HTMLElement | null;

  if (toggle && menu && toggle.dataset.bound !== 'true') {
    toggle.dataset.bound = 'true';

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
    });

    menu.addEventListener('click', (event) => {
      if ((event.target as HTMLElement | null)?.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  }

  if (mobileDocBound) return;
  mobileDocBound = true;

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const currentToggle = document.getElementById('mobile-nav-toggle') as HTMLButtonElement | null;
    const currentMenu = document.getElementById('mobile-nav-panel') as HTMLElement | null;
    if (currentToggle && currentMenu && currentToggle.getAttribute('aria-expanded') === 'true') {
      currentToggle.setAttribute('aria-expanded', 'false');
      currentMenu.hidden = true;
      currentToggle.focus();
    }
  });
}

export function initPage(): void {
  document.documentElement.classList.add('js-ready');
  setupReveals();
  setupStackedDeliverables();
  setupStickySteps();
  setupLightbox();
  setupMobileNav();
  initTelemetry();
}

/* Com ClientRouter do Astro, astro:page-load dispara tanto no carregamento inicial quanto em cada transição */
document.addEventListener('astro:page-load', initPage);
