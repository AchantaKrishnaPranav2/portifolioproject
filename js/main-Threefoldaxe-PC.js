/**
 * LUMEN ARCHIVE - Portfolio Interactive Scripts
 * Features: Category Filtering, Fullscreen Lightbox Modal, Header Scroll, & Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  initCategoryTabs();
  initFullscreenLightbox();
  initHeaderScroll();
  initMobileNavigation();
});

/**
 * Filter photography grid items by category pill tab
 */
function initCategoryTabs() {
  const tabButtons = document.querySelectorAll('.category-tabs .tab-btn');
  const photoCards = document.querySelectorAll('.photo-grid .photo-card');

  if (!tabButtons.length || !photoCards.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.dataset.filter;

      // Update active states
      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Filter cards
      photoCards.forEach((card) => {
        const category = card.dataset.category;
        const matches = selectedFilter === 'all' || category === selectedFilter;

        card.classList.remove('fade-in');

        if (matches) {
          card.classList.remove('is-hidden');
          void card.offsetWidth; // Force reflow
          card.classList.add('fade-in');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/**
 * Interactive Fullscreen Lightbox Modal
 * Expands any clicked image into a full-screen viewer with navigation and keyboard controls
 */
function initFullscreenLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const backdrop = document.getElementById('lightbox-backdrop');

  if (!lightbox || !lightboxImg) return;

  let activePhotos = [];
  let currentIndex = 0;

  // Gather current visible photo cards
  function getVisibleCards() {
    return Array.from(document.querySelectorAll('.photo-grid .photo-card:not(.is-hidden)'));
  }

  // Open lightbox with specific card data
  function openLightbox(index) {
    activePhotos = getVisibleCards();
    if (!activePhotos.length) return;

    if (index < 0) index = activePhotos.length - 1;
    if (index >= activePhotos.length) index = 0;
    currentIndex = index;

    const card = activePhotos[currentIndex];
    const imgEl = card.querySelector('.photo-card__img');
    const badgeEl = card.querySelector('.photo-badge');
    const titleEl = card.querySelector('.photo-title');
    const subEl = card.querySelector('.photo-sub');
    const dateEl = card.querySelector('.photo-date');

    const total = activePhotos.length;
    const formattedCurrent = String(currentIndex + 1).padStart(2, '0');
    const formattedTotal = String(total).padStart(2, '0');

    // Populate data
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || 'Photography display';
    lightboxBadge.textContent = badgeEl ? badgeEl.textContent : 'Archive';
    lightboxCounter.textContent = `${formattedCurrent} / ${formattedTotal}`;
    lightboxTitle.textContent = titleEl ? titleEl.textContent : 'Untitled';
    
    let metaText = '';
    if (dateEl) metaText += dateEl.textContent;
    if (subEl) metaText += (metaText ? ' • ' : '') + subEl.textContent;
    lightboxDesc.textContent = metaText || '';

    // Show modal
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Next / Previous navigation
  function showNext() {
    openLightbox(currentIndex + 1);
  }

  function showPrev() {
    openLightbox(currentIndex - 1);
  }

  // Attach click events to all cards in the grid
  const allCards = document.querySelectorAll('.photo-grid .photo-card');
  allCards.forEach((card) => {
    card.addEventListener('click', () => {
      const visible = getVisibleCards();
      const idx = visible.indexOf(card);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  // Lightbox controls
  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });
}

/**
 * Apply frosted background effect to header when scrolling
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Responsive mobile navigation drawer toggle
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('primary-navigation');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    toggleBtn.classList.toggle('is-active');
    navMenu.classList.toggle('is-open');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close menu when navigation item clicked
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('is-active');
      navMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}
