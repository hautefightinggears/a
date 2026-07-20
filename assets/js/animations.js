// ============================================================
// ANIMATIONS.JS — Haute Fighting Gears
// Nike / Adidas-style premium animation system
// Pure CSS + Vanilla JS — zero dependencies
// Safe: does NOT touch existing functionality
// ============================================================

(function () {
  'use strict';

  // ── 1. INJECT GLOBAL ANIMATION STYLES ──────────────────────
  const style = document.createElement('style');
  style.textContent = `

    /* ── Page enter ─────────────────────────────────────────── */
    @keyframes hfg-page-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    body { animation: hfg-page-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

    /* ── Navbar scroll transition ───────────────────────────── */
    header[data-hfg-nav] {
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.32s ease !important;
      will-change: transform;
    }
    header[data-hfg-nav].nav-hidden {
      transform: translateY(-100%) !important;
    }
    header[data-hfg-nav].nav-scrolled {
      box-shadow: 0 2px 24px rgba(0,0,0,0.10);
    }

    /* ── Scroll reveal ──────────────────────────────────────── */
    .hfg-reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: opacity, transform;
    }
    .hfg-reveal.hfg-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* ── Product card hover system ──────────────────────────── */
    .hfg-card {
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1) !important;
      will-change: transform;
    }
    .hfg-card:hover {
      transform: translateY(-8px) !important;
      box-shadow: 0 20px 48px rgba(0,0,0,0.15) !important;
    }

    /* ── CRITICAL: Product image color fix ──────────────────── */
    /* Default: FULL COLOR — no grayscale ever */
    .hfg-card img,
    .hfg-card .hfg-img {
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) !important;
      filter: none !important;
      will-change: transform;
    }
    /* Hover: subtle zoom only */
    .hfg-card:hover img,
    .hfg-card:hover .hfg-img {
      transform: scale(1.05) !important;
    }
    /* Nuke any Tailwind grayscale that might be on the img element */
    #samples-grid img,
    #featured-grid img {
      filter: none !important;
      --tw-grayscale: grayscale(0%) !important;
    }

    /* ── Button micro-interactions ──────────────────────────── */
    .hfg-btn {
      transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
                  background-color 0.2s ease,
                  color 0.2s ease !important;
      will-change: transform;
    }
    .hfg-btn:hover  { transform: scale(1.04) !important; }
    .hfg-btn:active { transform: scale(0.97) !important; }

    /* ── Staggered grid items ───────────────────────────────── */
    .hfg-stagger {
      opacity: 0;
      transform: translateY(24px);
    }
    .hfg-stagger.hfg-visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    /* ── Hero parallax ──────────────────────────────────────── */
    .hfg-parallax-img { will-change: transform; }

    /* ── Page exit — opacity fade only, pointer-events untouched ── */
    body.hfg-exit {
      opacity: 0;
      transition: opacity 0.18s ease;
      /* pointer-events intentionally NOT set here — buttons must remain
         clickable during the brief fade to prevent blocking fast taps */
    }

    /* ── Category filter bar — clean rectangular style ─────── */
    #filter-bar {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      flex-wrap: nowrap !important;
      gap: 0 !important;
      padding: 0 !important;
      overflow-x: auto !important;
      scrollbar-width: none !important;
      border-bottom: none !important;
    }
    #filter-bar::-webkit-scrollbar { display: none; }
    #filter-bar .filter-btn {
      border-radius: 0 !important;
      padding: 16px 22px !important;
      font-size: 13px !important;
      letter-spacing: 0.1em !important;
      font-weight: 600 !important;
      border: none !important;
      border-bottom: 2px solid transparent !important;
      background: transparent !important;
      color: #707070 !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      text-transform: uppercase !important;
      transition: color 0.2s ease, border-color 0.2s ease !important;
      box-shadow: none !important;
    }
    #filter-bar .filter-btn:hover {
      color: #1b1b1b !important;
      border-bottom-color: #1b1b1b !important;
      background: transparent !important;
      transform: none !important;
    }
    /* Active state — black text + red underline */
    #filter-bar .filter-btn.bg-primary,
    #filter-bar .filter-btn.text-on-primary {
      background: transparent !important;
      color: #1b1b1b !important;
      border-bottom: 2px solid #E10600 !important;
      box-shadow: none !important;
    }

    /* ── FAQ Accordion ──────────────────────────────────────── */
    .hfg-faq-item {
      border-bottom: 1px solid #e5e5e5;
      overflow: hidden;
    }
    .hfg-faq-item:first-child { border-top: 1px solid #e5e5e5; }
    .hfg-faq-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      font-family: 'Hanken Grotesk', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: #1b1b1b;
      letter-spacing: 0.02em;
      transition: color 0.2s ease;
    }
    .hfg-faq-btn:hover { color: #E10600; }
    .hfg-faq-icon {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      border: 1.5px solid currentColor;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, background 0.2s ease, color 0.2s ease;
      margin-left: 16px;
      font-size: 16px;
      line-height: 1;
    }
    .hfg-faq-item.open .hfg-faq-icon {
      transform: rotate(45deg);
      background: #E10600;
      border-color: #E10600;
      color: #fff;
    }
    .hfg-faq-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.38s cubic-bezier(0.22, 1, 0.36, 1),
                  padding 0.3s ease;
    }
    .hfg-faq-item.open .hfg-faq-body {
      max-height: 300px;
    }
    .hfg-faq-body-inner {
      padding: 0 0 20px 0;
      font-family: 'Hanken Grotesk', sans-serif;
      font-size: 15px;
      line-height: 1.7;
      color: #707070;
    }

  `;
  document.head.appendChild(style);


  // ── 2. NAVBAR SCROLL HIDE / SHOW ───────────────────────────
  // Direction-only detection — no position threshold
  // Works reliably at top, middle, and footer
  function initNavbarScroll() {
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const header = document.querySelector('header');
        if (!header) { ticking = false; return; }

        header.setAttribute('data-hfg-nav', '');

        const y = window.scrollY;
        const delta = y - lastY;

        if (delta > 2) {
          if (y > 60) header.classList.add('nav-hidden');
        } else if (delta < -2) {
          header.classList.remove('nav-hidden');
        }

        header.classList.toggle('nav-scrolled', y > 8);

        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  // ── 2b. CATEGORY BAR SCROLL HIDE / SHOW ────────────────────
  // Same direction logic as navbar — hides on scroll down, shows on scroll up
  // Bar stays in normal document flow (not fixed/sticky)
  function initCategoryBarScroll() {
    const wrap = document.getElementById('filter-bar-wrap');
    if (!wrap) return;

    let lastY = window.scrollY;
    let ticking = false;
    let isHidden = false;

    // Get the bar's natural top offset once it's rendered
    function getBarTop() {
      return wrap.getBoundingClientRect().top + window.scrollY;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const barTop = getBarTop();

        // Only start hiding once user has scrolled past the bar
        if (y > barTop + wrap.offsetHeight) {
          if (delta > 2 && !isHidden) {
            // Scrolling DOWN — slide bar up and out of view
            wrap.style.transform = 'translateY(-110%)';
            isHidden = true;
          } else if (delta < -2 && isHidden) {
            // Scrolling UP — slide bar back into view
            wrap.style.transform = 'translateY(0)';
            isHidden = false;
          }
        } else {
          // Above the bar's natural position — always show
          wrap.style.transform = 'translateY(0)';
          isHidden = false;
        }

        lastY = y;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  // ── 3. SCROLL REVEAL ───────────────────────────────────────
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('hfg-visible', 'opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-8');
        }, delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });

    function observeAll() {
      document.querySelectorAll('[data-reveal], .hfg-reveal').forEach(el => {
        if (el.classList.contains('hfg-visible')) return;
        el.classList.add('hfg-reveal');
        obs.observe(el);
      });
    }

    observeAll();

    // Watch dynamic grids
    ['#samples-grid', '#featured-grid', '#product-grid'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) new MutationObserver(observeAll).observe(el, { childList: true });
    });
  }


  // ── 4. PRODUCT CARD ENHANCEMENTS ───────────────────────────
  function initProductCards() {
    function applyToCards() {
      const cards = document.querySelectorAll(
        '#samples-grid > div, #featured-grid > div, .group.border.border-outline-variant'
      );
      cards.forEach((card, i) => {
        if (card.dataset.hfgCard) return;
        card.dataset.hfgCard = '1';
        card.classList.add('hfg-card', 'hfg-stagger');
        card.dataset.delay = Math.min(i * 55, 380);
      });
    }

    applyToCards();

    ['#samples-grid', '#featured-grid'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) new MutationObserver(applyToCards).observe(el, { childList: true });
    });
  }


  // ── 5. BUTTON MICRO-INTERACTIONS ───────────────────────────
  function initButtons() {
    function applyToButtons() {
      document.querySelectorAll(
        'a[class*="bg-accent-red"], a[class*="bg-primary"]:not([class*="text-primary"]), ' +
        'button[type="submit"], button[class*="bg-accent-red"]'
      ).forEach(btn => {
        if (btn.dataset.hfgBtn) return;
        btn.dataset.hfgBtn = '1';
        btn.classList.add('hfg-btn');
      });
    }
    applyToButtons();
    new MutationObserver(applyToButtons).observe(document.body, { childList: true, subtree: true });
  }


  // ── 6. HERO PARALLAX ───────────────────────────────────────
  function initParallax() {
    const hero = document.querySelector('section.relative.min-h-screen');
    if (!hero) return;
    const img = hero.querySelector('img.absolute');
    if (!img) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.4) {
          img.style.transform = `translateY(${y * 0.25}px)`;
        }
        ticking = false;
      });
    }, { passive: true });
  }


  // ── 7. PAGE TRANSITION ─────────────────────────────────────
  function initPageTransitions() {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        href.startsWith('javascript') || link.target === '_blank') return;
      e.preventDefault();
      // Apply exit fade — pointer-events removed immediately after navigation starts
      // so fast taps / double-taps on other elements are never blocked
      document.body.classList.add('hfg-exit');
      const dest = href; // capture before timeout
      setTimeout(() => {
        document.body.style.pointerEvents = ''; // restore before navigating
        window.location.href = dest;
      }, 180);
    });
  }


  // ── 8. STAGGERED GRID REVEAL ───────────────────────────────
  function initStaggeredGrid() {
    const gridObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const items = entry.target.querySelectorAll('.hfg-stagger:not(.hfg-visible)');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('hfg-visible'), i * 60);
        });
        gridObs.unobserve(entry.target);
      });
    }, { threshold: 0.04 });

    function observeGrids() {
      document.querySelectorAll('#samples-grid, #featured-grid').forEach(g => {
        if (g && !g.dataset.hfgGridObs) {
          g.dataset.hfgGridObs = '1';
          gridObs.observe(g);
        }
      });
    }

    observeGrids();
    new MutationObserver(observeGrids).observe(document.body, { childList: true, subtree: true });
  }


  // ── 9. FAQ ACCORDION ───────────────────────────────────────
  function initFaqAccordion() {
    // Find FAQ items — works with the upgraded Contact.html structure
    const items = document.querySelectorAll('.hfg-faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const btn = item.querySelector('.hfg-faq-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        items.forEach(i => i.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    });
  }


  // ── BOOT ───────────────────────────────────────────────────
  initPageTransitions();

  function boot() {
    initNavbarScroll();
    initCategoryBarScroll();
    initScrollReveal();
    initProductCards();
    initButtons();
    initParallax();
    initStaggeredGrid();
    initFaqAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();


// ── HOME PAGE ANIMATIONS (merged from home-animations.js) ──
// ============================================================
// HOME-ANIMATIONS.JS — Haute Fighting Gears
// Premium motion system for the homepage only
// Inspired by 23.html (About page) scroll style
// Pure CSS + Vanilla JS — zero dependencies
// ============================================================

(function () {
    'use strict';

    // ── 1. INJECT STYLES ───────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `

    /* ── Hero text fade-in on load ──────────────────────────── */
    #hero-content {
      transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #hero-content.hp-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* ── Hero image parallax + slow zoom ────────────────────── */
    #hero-bg-img {
      transition: transform 0.05s linear;
      will-change: transform;
    }

    /* ── Section scroll reveal ──────────────────────────────── */
    .hp-reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .hp-reveal.hp-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Stagger delays for process cards ───────────────────── */
    .hp-stagger-1 { transition-delay: 0ms !important; }
    .hp-stagger-2 { transition-delay: 80ms !important; }
    .hp-stagger-3 { transition-delay: 160ms !important; }
    .hp-stagger-4 { transition-delay: 240ms !important; }

    /* ── What We Make image hover ───────────────────────────── */
    .hp-img-hover {
      overflow: hidden;
    }
    .hp-img-hover img {
      transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) !important;
    }
    .hp-img-hover:hover img {
      transform: scale(1.07) !important;
    }

    /* ── Marquee animation ──────────────────────────────────── */
    @keyframes hfg-marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .hfg-marquee-track {
      animation: hfg-marquee 28s linear infinite;
    }
    .hfg-marquee-wrap:hover .hfg-marquee-track {
      animation-play-state: paused;
    }

    /* ── Button scale on hover (homepage specific) ──────────── */
    .hp-btn {
      transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
                  background-color 0.2s ease,
                  color 0.2s ease,
                  border-color 0.2s ease !important;
    }
    .hp-btn:hover  { transform: scale(1.04) !important; }
    .hp-btn:active { transform: scale(0.97) !important; }

    /* ── Trust card hover lift ──────────────────────────────── */
    .hp-trust-card {
      transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.28s ease,
                  border-color 0.2s ease !important;
    }
    .hp-trust-card:hover {
      transform: translateY(-6px) !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.10) !important;
      border-color: #1b1b1b !important;
    }

  `;
    document.head.appendChild(style);


    // ── 2. HERO TEXT FADE-IN ON LOAD ───────────────────────────
    function initHeroEntrance() {
        const content = document.getElementById('hero-content');
        if (!content) return;
        // Small delay so the page paint completes first
        setTimeout(() => content.classList.add('hp-visible'), 120);
    }


    // ── 3. HERO PARALLAX + SLOW ZOOM ───────────────────────────
    function initHeroParallax() {
        const img = document.getElementById('hero-bg-img');
        if (!img) return;

        // Disable on mobile for performance
        const isMobile = () => window.innerWidth < 768;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (isMobile() || ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y < window.innerHeight * 1.5) {
                    // Parallax: image moves at 25% of scroll speed
                    // Zoom: scale grows slightly as user scrolls in
                    const scale = 1 + Math.min(y / window.innerHeight * 0.08, 0.08);
                    img.style.transform = `translateY(${y * 0.25}px) scale(${scale})`;
                }
                ticking = false;
            });
        }, { passive: true });
    }


    // ── 4. SCROLL REVEAL WITH STAGGER ──────────────────────────
    function initScrollReveal() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('hp-visible');
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        // Mark all sections and their children for reveal
        // Process cards get stagger delays
        const processCards = document.querySelectorAll(
            '.bg-surface-container .grid > div[data-reveal], ' +
            '.bg-surface-container .grid > div.bg-surface-container-lowest'
        );
        processCards.forEach((card, i) => {
            card.classList.add('hp-reveal', `hp-stagger-${Math.min(i + 1, 4)}`);
            obs.observe(card);
        });

        // All other [data-reveal] elements
        document.querySelectorAll('[data-reveal]').forEach(el => {
            if (!el.classList.contains('hp-reveal')) {
                el.classList.add('hp-reveal');
                obs.observe(el);
            }
        });

        // Trust cards
        document.querySelectorAll('.hp-trust-card').forEach(el => {
            if (!el.classList.contains('hp-reveal')) {
                el.classList.add('hp-reveal');
                obs.observe(el);
            }
        });
    }


    // ── 5. WHAT WE MAKE — image hover enhancement ──────────────
    function initProductImageHover() {
        // The 3 category tiles in "What We Make"
        document.querySelectorAll('section a.group.relative.aspect-\\[3\\/4\\]').forEach(el => {
            el.classList.add('hp-img-hover');
        });
    }


    // ── 6. TRUST CARDS ─────────────────────────────────────────
    function initTrustCards() {
        document.querySelectorAll('.flex.items-start.gap-5.p-6.border').forEach(card => {
            card.classList.add('hp-trust-card');
        });
    }


    // ── 7. BUTTON ENHANCEMENTS ─────────────────────────────────
    function initButtons() {
        // Homepage hero buttons + CTA section buttons
        document.querySelectorAll(
            '#hero-content a, ' +
            '.bg-primary.border-y-4 a'
        ).forEach(btn => {
            if (!btn.dataset.hpBtn) {
                btn.dataset.hpBtn = '1';
                btn.classList.add('hp-btn');
            }
        });
    }


    // ── 8. FEATURED GRID — stagger on load ─────────────────────
    function initFeaturedGrid() {
        const grid = document.getElementById('featured-grid');
        if (!grid) return;

        const gridObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                // Stagger each card
                const cards = entry.target.querySelectorAll(':scope > div');
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(28px)';
                    card.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`;
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 60 + i * 70);
                });
                gridObs.unobserve(entry.target);
            });
        }, { threshold: 0.05 });

        // Watch for when grid gets populated
        const mutObs = new MutationObserver(() => {
            if (grid.children.length > 0 && !grid.dataset.hpGridObs) {
                grid.dataset.hpGridObs = '1';
                gridObs.observe(grid);
            }
        });
        mutObs.observe(grid, { childList: true });

        // Also observe immediately if already populated
        if (grid.children.length > 0) {
            grid.dataset.hpGridObs = '1';
            gridObs.observe(grid);
        }
    }


    // ── BOOT ───────────────────────────────────────────────────
    function boot() {
        initHeroEntrance();
        initHeroParallax();
        initScrollReveal();
        initProductImageHover();
        initTrustCards();
        initButtons();
        initFeaturedGrid();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
