/**
 * Krishna Pranav Photography — Main JavaScript
 * Architecture: Modular ES2022, progressive enhancement
 * Showcases: Custom cursor, Intersection Observer, drag scroll,
 * keyboard-accessible lightbox, filter animations, scroll-spy nav.
 */

'use strict';

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */

/** Shorthand query selectors */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Clamp a value between min and max */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** Debounce factory */
const debounce = (fn, ms = 100) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

/** RAF-throttle factory */
const throttleRAF = fn => {
  let pending = false;
  return (...args) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { fn(...args); pending = false; });
  };
};

/** Dispatch a custom event */
const emit = (el, name, detail = {}) =>
  el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

/* ==========================================================================
   LOADER
   ========================================================================== */

function initLoader() {
  const loader = $('.loader');
  if (!loader) return;

  // Wait for images to load or timeout after 2s
  const done = () => {
    loader.classList.add('is-done');
    document.body.classList.add('loaded');
  };

  const imgs = $$('img[loading="eager"]');
  if (!imgs.length) {
    setTimeout(done, 1200);
    return;
  }

  let loaded = 0;
  const check = () => { if (++loaded >= imgs.length) done(); };
  imgs.forEach(img => {
    if (img.complete) check();
    else { img.addEventListener('load', check, { once: true }); img.addEventListener('error', check, { once: true }); }
  });

  // Hard timeout
  setTimeout(done, 2200);
}


/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */

function initCursor() {
  // Skip on touch-only devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = $('.cursor-dot');
  const ring = $('.cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  // Track real mouse position instantly for the dot
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  // Animate ring with lerp for smooth lag effect
  const lerpFactor = 0.12;
  function animateRing() {
    rx += (mx - rx) * lerpFactor;
    ry += (my - ry) * lerpFactor;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // State changes on interactive elements
  const hoverEls  = $$('button, [role="button"]');
  const linkEls   = $$('a');
  const dragEls   = $$('.series-track');

  const addClass    = cls => ring.classList.add(cls);
  const removeClass = cls => ring.classList.remove(cls);
  const clearStates = () => ring.classList.remove('is-hover', 'is-link', 'is-drag');

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => { clearStates(); addClass('is-hover'); });
    el.addEventListener('mouseleave', clearStates);
  });

  linkEls.forEach(el => {
    el.addEventListener('mouseenter', () => { clearStates(); addClass('is-link'); });
    el.addEventListener('mouseleave', clearStates);
  });

  dragEls.forEach(el => {
    el.addEventListener('mouseenter', () => { clearStates(); addClass('is-drag'); });
    el.addEventListener('mouseleave', clearStates);
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}


/* ==========================================================================
   NAVIGATION — scroll-spy + hide-on-scroll-down + mobile menu
   ========================================================================== */

function initNav() {
  const header = $('.site-header');
  const nav    = $('.site-nav');
  const toggle = $('.nav-toggle');
  const links  = $$('.nav-link');

  if (!header) return;

  /* Hide nav on scroll down, show on scroll up */
  let lastY = window.scrollY;

  const onScroll = throttleRAF(() => {
    const y = window.scrollY;
    const delta = y - lastY;

    header.classList.toggle('scrolled', y > 40);
    if (y > 120) {
      header.classList.toggle('nav-hidden', delta > 2);
    } else {
      header.classList.remove('nav-hidden');
    }
    lastY = y;
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('is-open', !expanded);
  });

  // Close on link click
  links.forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav?.classList.contains('is-open')) return;
    if (!header.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  /* Scroll-spy — highlight active nav link */
  // Nav links also carry data-section values, but they are not scroll targets.
  // Observe only identified page sections (including the contact footer).
  const sections = $$('[data-section][id]');

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => spy.observe(sec));
}


/* ==========================================================================
   HERO — parallax + entrance animations
   ========================================================================== */

function initHero() {
  const hero = $('.hero');
  const bgImg = $('.hero__bg-img');
  if (!hero || !bgImg) return;

  // Trigger entrance animation
  hero.classList.add('is-visible');

  // Subtle parallax on bg image (desktop only)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(hover: hover)').matches) {

    const onScroll = throttleRAF(() => {
      const progress = clamp(window.scrollY / window.innerHeight, 0, 1);
      bgImg.style.transform = `scale(1.04) translateY(${progress * 10}%)`;
    });

    window.addEventListener('scroll', onScroll, { passive: true });
  }
}


/* ==========================================================================
   SCROLL REVEAL — Intersection Observer
   ========================================================================== */

function initScrollReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}


/* ==========================================================================
   GALLERY FILTER
   ========================================================================== */

function initFilter() {
  const tabs  = $$('.tab-btn');
  const cards = $$('.photo-card');

  if (!tabs.length || !cards.length) return;

  function filter(value) {
    cards.forEach(card => {
      const match = value === 'all' || card.dataset.category === value;
      if (match) {
        card.classList.remove('is-hidden');
        // Stagger the reveal
        const idx = cards.filter(c => !c.classList.contains('is-hidden')).indexOf(card);
        card.style.animationDelay = `${idx * 0.04}s`;
        card.classList.add('filter-in');
        // Clean up after animation
        card.addEventListener('animationend', () => card.classList.remove('filter-in'), { once: true });
      } else {
        card.classList.add('is-hidden');
      }
    });

    // Update tab states
    tabs.forEach(tab => {
      const active = tab.dataset.filter === value;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => filter(tab.dataset.filter));
  });

}


/* ==========================================================================
   LIGHTBOX
   ========================================================================== */

function initLightbox() {
  const lightbox  = $('#lightbox');
  const img       = $('#lightbox-img');
  const titleEl   = $('#lightbox-title');
  const descEl    = $('#lightbox-desc');
  const exifEl    = $('#lightbox-exif');
  const catEl     = $('#lightbox-category');
  const counterEl = $('#lightbox-counter');
  const closeBtn  = $('#lightbox-close');
  const prevBtn   = $('#lightbox-prev');
  const nextBtn   = $('#lightbox-next');
  const fullscreenBtn = $('#lightbox-fullscreen');
  const imageWrap = img?.closest('.lightbox__image-wrap');
  const backdrop  = $('#lightbox-backdrop');
  const thumbsEl  = $('#lightbox-thumbs');

  if (!lightbox || !img) return;

  // Values read from the photos' embedded EXIF tags. Some edited/shared
  // images have had their camera settings stripped, so those are marked below.
  const exifBySrc = {
    'images/BIRDS/IMG_20260906_003529.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 400, shutter: '1/1250 s', aperture: 'f/5.6', focal: '250 mm' },
    'images/BIRDS/IMG_20260925_083727.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 800, shutter: '1/640 s', aperture: 'f/5.6', focal: '232 mm' },
    'images/BIRDS/IMG_20260925_083920.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 800, shutter: '1/640 s', aperture: 'f/5.6', focal: '232 mm' },
    'images/BIRDS/IMG_20260927_180020.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 800, shutter: '1/800 s', aperture: 'f/5.6', focal: '250 mm' },
    'images/BIRDS/IMG_20260927_180118.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 800, shutter: '1/800 s', aperture: 'f/5.6', focal: '250 mm' },
    'images/BIRDS/IMG_20260927_180229.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 800, shutter: '1/800 s', aperture: 'f/5.6', focal: '250 mm' },
    'images/BIRDS/IMG_20260929_020255.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 1600, shutter: '1/1000 s', aperture: 'f/5.6', focal: '250 mm' },
    'images/BIRDS/IMG_20260929_021027.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 1600, shutter: '1/1000 s', aperture: 'f/5.6', focal: '250 mm' },
    'images/BIRDS/IMG_20260929_024427.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 1600, shutter: '1/1000 s', aperture: 'f/5.6', focal: '250 mm' },
    'images/DOGS/IMG_20260110_192915.jpg': { camera: 'OnePlus Nord CE 3 Lite 5G', iso: 400, shutter: '1/25 s', aperture: 'f/1.7', focal: '5.24 mm' },
    'images/DOGS/IMG_20260929_084358.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 400, shutter: '1/500 s', aperture: 'f/5.6', focal: '171 mm' },
    'images/DOGS/IMG_20260929_084858.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 400, shutter: '1/500 s', aperture: 'f/5.6', focal: '131 mm' },
    'images/IMG_20260928_004751.jpg': { camera: 'Canon EOS DIGITAL REBEL XSi', iso: 400, shutter: '1/800 s', aperture: 'f/5.6', focal: '250 mm' }
  };

  // Collect all visible photo cards
  let cards = [];
  let currentIdx = 0;
  let returnFocusTo = null;
  let showTimer;

  function getCards() {
    cards = $$('.photo-card:not(.is-hidden)');
  }

  function open(idx, collection = null) {
    if (collection) cards = collection;
    else getCards();
    if (!cards.length) return;
    returnFocusTo = document.activeElement;
    currentIdx = clamp(idx, 0, cards.length - 1);
    show(currentIdx);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
    buildThumbs();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    returnFocusTo?.focus();
  }

  function show(idx) {
    if (!cards.length) return;
    currentIdx = clamp(idx, 0, cards.length - 1);
    const card = cards[currentIdx];
    const cardImg = $('img', card);

    // Transition
    img.style.opacity = '0';
    img.style.transform = 'scale(0.96)';

    clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      img.src    = cardImg?.src || '';
      img.alt    = cardImg?.alt || '';
      if (exifEl) {
        const exif = exifBySrc[cardImg?.getAttribute('src') || ''];
        exifEl.textContent = exif
          ? [exif.camera, `ISO ${exif.iso}`, exif.shutter, exif.aperture, exif.focal].join(' · ')
          : 'Camera settings are not embedded in this photo';
      }
      if (titleEl) titleEl.textContent = ($('.photo-card__title', card) || {}).textContent || '';
      if (descEl)  descEl.textContent  = ($('.photo-card__sub',   card) || {}).textContent || '';
      if (catEl)   catEl.textContent   = ($('.photo-card__badge', card) || {}).textContent || '';
      if (counterEl) counterEl.textContent = `${String(currentIdx + 1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;

      img.style.opacity   = '1';
      img.style.transition = `opacity 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`;
      img.style.transform = 'scale(1)';

      updateThumbs();
    }, 120);
  }

  function buildThumbs() {
    if (!thumbsEl) return;
    thumbsEl.innerHTML = '';
    cards.forEach((card, i) => {
      const cardImg = $('img', card);
      const thumb = document.createElement('button');
      thumb.className = 'lightbox__thumb' + (i === currentIdx ? ' is-active' : '');
      thumb.setAttribute('aria-label', `View photo ${i + 1}`);
      thumb.setAttribute('type', 'button');

      const tImg = document.createElement('img');
      tImg.src = cardImg?.src || '';
      tImg.alt = '';
      tImg.loading = 'lazy';
      thumb.appendChild(tImg);

      thumb.addEventListener('click', () => show(i));
      thumbsEl.appendChild(thumb);
    });
  }

  function updateThumbs() {
    if (!thumbsEl) return;
    const thumbBtns = $$('.lightbox__thumb', thumbsEl);
    thumbBtns.forEach((t, i) => t.classList.toggle('is-active', i === currentIdx));
    // Scroll active thumb into view
    thumbBtns[currentIdx]?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  }

  // Open on card click
  $$('.photo-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      getCards();
      const visibleIdx = cards.indexOf(card);
      open(visibleIdx >= 0 ? visibleIdx : 0);
    });
    card.addEventListener('keydown', e => {
      if (e.target !== card || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      getCards();
      const visibleIdx = cards.indexOf(card);
      if (visibleIdx >= 0) open(visibleIdx);
    });
  });

  // Controls
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => show(currentIdx - 1));
  nextBtn?.addEventListener('click', () => show(currentIdx + 1));

  fullscreenBtn?.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === imageWrap) {
        await document.exitFullscreen?.();
      } else if (imageWrap?.requestFullscreen) {
        await imageWrap.requestFullscreen();
      }
    } catch (error) {
      // Fullscreen can be unavailable in embedded or restricted browsers.
      fullscreenBtn.setAttribute('aria-label', 'Fullscreen is unavailable in this browser');
    }
  });

  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = document.fullscreenElement === imageWrap;
    fullscreenBtn?.setAttribute('aria-pressed', String(isFullscreen));
    fullscreenBtn?.setAttribute('aria-label', isFullscreen ? 'Exit photo fullscreen' : 'View photo fullscreen');
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Tab') {
      const focusable = $$('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])', lightbox);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    switch (e.key) {
      case 'Escape':      close(); break;
      case 'ArrowLeft':   show(currentIdx - 1); break;
      case 'ArrowRight':  show(currentIdx + 1); break;
    }
  });

  // Touch / swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) dx < 0 ? show(currentIdx + 1) : show(currentIdx - 1);
  });

  // Expose open function globally for category-link tiles
  window.openLightbox = open;

  // Let each photo series open as its own fullscreen sequence. Reuse gallery
  // cards where possible so their title, caption, and category stay intact.
  window.openSeriesLightbox = clickedImg => {
    const seriesCard = clickedImg.closest('.series-card');
    if (!seriesCard) return;

    const seriesImages = $$('img', seriesCard);
    const collection = seriesImages.map((seriesImg, index) => {
      const src = seriesImg.getAttribute('src');
      const galleryCard = $$('.photo-card').find(card => $('img', card)?.getAttribute('src') === src);
      if (galleryCard) return galleryCard;

      // Some series frames are not repeated in the main gallery. Create a
      // lightweight card so they still use the same lightbox and controls.
      const item = document.createElement('figure');
      const title = $('.series-card__name', seriesCard)?.textContent || 'Photo series';
      const category = $('.series-card__count', seriesCard)?.textContent || 'Photo series';
      const image = document.createElement('img');
      image.src = seriesImg.src;
      image.alt = seriesImg.alt;
      item.appendChild(image);
      ['photo-card__title', 'photo-card__sub', 'photo-card__badge'].forEach((className, i) => {
        const label = document.createElement(i === 0 ? 'h3' : 'span');
        label.className = className;
        label.textContent = i === 0 ? title : i === 1 ? seriesImg.alt : category;
        item.appendChild(label);
      });
      return item;
    });

    const startIndex = seriesImages.indexOf(clickedImg);
    open(startIndex < 0 ? 0 : startIndex, collection);
  };

  // Series frames open in the same viewer when clicked or activated by keyboard.
  $$('.series-card__imgs img').forEach(seriesImg => {
    seriesImg.tabIndex = 0;
    seriesImg.setAttribute('role', 'button');
    seriesImg.setAttribute('aria-label', `View ${seriesImg.alt || 'series photo'} fullscreen`);
    seriesImg.addEventListener('click', () => window.openSeriesLightbox(seriesImg));
    seriesImg.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      window.openSeriesLightbox(seriesImg);
    });
  });
}


/* ==========================================================================
   DRAG-SCROLL for series track
   ========================================================================== */

function initDragScroll() {
  $$('.series-track').forEach(track => {
    let isDown = false, startX = 0, scrollLeft = 0;

    // The track is focusable so keyboard users can browse the horizontal row.
    track.addEventListener('keydown', e => {
      if (e.target !== track) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: e.key === 'ArrowRight' ? 300 : -300, behavior: 'smooth' });
      }
    });

    track.addEventListener('mousedown', e => {
      isDown    = true;
      startX    = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.classList.add('is-grabbing');
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('is-grabbing');
    });

    track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('is-grabbing'); });

    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}


/* ==========================================================================
   FEATURE STRIP — feature tile click filters gallery
   ========================================================================== */

function initFeatureStrip() {
  $$('.feature-tile').forEach(tile => {
    tile.addEventListener('click', e => {
      e.preventDefault();
      const cat = tile.dataset.categoryLink;
      if (!cat) return;
      // Scroll to gallery section
      $('#gallery')?.scrollIntoView({ behavior: 'smooth' });
      // Apply filter
      setTimeout(() => {
        $$('.tab-btn').find(btn => btn.dataset.filter === cat)?.click();
      }, 600);
    });
  });
}


/* ==========================================================================
   FOOTER YEAR
   ========================================================================== */

/* ==========================================================================
   FEEDBACK FORM
   ========================================================================== */

function initFeedbackForm() {
  const form = $('#footer-feedback-form');
  const textarea = $('#footer-feedback');
  if (!form || !textarea) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const suggestion = textarea.value.trim();
    if (!suggestion) {
      textarea.setCustomValidity('Please add your thoughts or suggestions.');
      textarea.reportValidity();
      return;
    }
    textarea.setCustomValidity('');

    const name = window.prompt('What is your name?');
    if (name === null) return;
    if (!name.trim()) {
      window.alert('Please enter your name to continue.');
      return;
    }

    const subject = encodeURIComponent('Portfolio thoughts and suggestions');
    const body = encodeURIComponent(`Name: ${name.trim()}\n\n${suggestion}`);
    window.location.href = `mailto:krishna.pranav.achanta@gmail.com?subject=${subject}&body=${body}`;
  });
}


/* ==========================================================================
   IMAGE LAZY LOAD with blur-up effect
   ========================================================================== */

function initLazyLoad() {
  const imgs = $$('img[loading="lazy"]');
  imgs.forEach(img => {
    img.style.transition = 'filter 0.4s ease';
    if (!img.complete) {
      img.style.filter = 'blur(6px)';
      img.addEventListener('load', () => { img.style.filter = ''; }, { once: true });
    }
  });
}


/* ==========================================================================
   INIT — DOM Ready
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initHero();
  initScrollReveal();
  initFilter();
  initLightbox();
  initDragScroll();
  initFeatureStrip();
  initFeedbackForm();
  initLazyLoad();
});
