/* ============================================================
   COOKIE — Premium Luxury Bakery
   Vanilla JavaScript • No Dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     Utility Helpers
  ---------------------------------------------------------- */

  /** Debounce — collapses rapid calls into one trailing invocation */
  const debounce = (fn, delay = 15) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /** Format a number with commas: 12500 → "12,500" */
  const formatNumber = (n) => Math.floor(n).toLocaleString('en-US');

  /** Easing — easeOutQuart for buttery counter animations */
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  /** Safe querySelector shorthand */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


  /* ----------------------------------------------------------
     1. Mobile Navigation
  ---------------------------------------------------------- */
  const navToggle = $('.nav-toggle');
  const navLinks  = $('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      // Prevent body scroll while menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when any link inside is clicked
    navLinks.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }


  /* ----------------------------------------------------------
     2. Sticky Header  &  14. Hide-on-scroll-down / Show-on-scroll-up
  ---------------------------------------------------------- */
  const navbar = $('.navbar');
  let lastScrollY = 0;
  const SCROLL_THRESHOLD = 100;   // px before .scrolled kicks in
  const HERO_HEIGHT = window.innerHeight * 0.6; // don't auto-hide in hero zone

  const handleNavbarScroll = () => {
    if (!navbar) return;
    const currentY = window.scrollY;

    // Sticky background
    navbar.classList.toggle('scrolled', currentY > SCROLL_THRESHOLD);

    // Auto-hide / reveal (only after hero)
    if (currentY > HERO_HEIGHT) {
      if (currentY > lastScrollY + 5) {
        // Scrolling DOWN → hide
        navbar.classList.add('nav-hidden');
      } else if (currentY < lastScrollY - 5) {
        // Scrolling UP → reveal
        navbar.classList.remove('nav-hidden');
      }
    } else {
      // Always show at top of page
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentY;
  };


  /* ----------------------------------------------------------
     3. Scroll Animations (Intersection Observer)
  ---------------------------------------------------------- */
  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // Stagger children inside the same container
        const parent = el.parentElement;
        if (parent) {
          const siblings = $$('.fade-in-up', parent);
          const index = siblings.indexOf(el);
          if (index > 0) {
            el.style.transitionDelay = `${index * 0.1}s`;
          }
        }

        el.classList.add('visible');
        observer.unobserve(el); // animate only once
      });
    },
    { threshold: 0.15 }
  );

  $$('.fade-in-up').forEach((el) => fadeObserver.observe(el));


  /* ----------------------------------------------------------
     4. Animated Number Counters
  ---------------------------------------------------------- */
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;

        const duration = 2000; // ms
        let start = null;

        const step = (timestamp) => {
          if (!start) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = target * easeOutQuart(progress);

          el.textContent = formatNumber(value) + '+';

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
        observer.unobserve(el); // only once
      });
    },
    { threshold: 0.3 }
  );

  $$('.counter-number').forEach((el) => counterObserver.observe(el));


  /* ----------------------------------------------------------
     5. Countdown Timer
  ---------------------------------------------------------- */
  const countdownTimer = $('#countdown-timer');

  if (countdownTimer) {
    // Expire at midnight tonight (local time)
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // next day, 00:00
      0, 0, 0
    );
    // If it's already past midnight (edge case), add 24h
    const expiry = midnight.getTime() <= now.getTime()
      ? now.getTime() + 86400000
      : midnight.getTime();

    const hoursEl   = $('#countdown-hours');
    const minutesEl = $('#countdown-minutes');
    const secondsEl = $('#countdown-seconds');

    const pad = (n) => String(n).padStart(2, '0');

    const tick = () => {
      const remaining = expiry - Date.now();

      if (remaining <= 0) {
        clearInterval(countdownInterval);
        countdownTimer.innerHTML = '<span class="countdown-expired">Offer Expired</span>';
        return;
      }

      const totalSec = Math.floor(remaining / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      if (hoursEl)   hoursEl.textContent   = pad(h);
      if (minutesEl) minutesEl.textContent = pad(m);
      if (secondsEl) secondsEl.textContent = pad(s);
    };

    tick(); // run immediately so there's no 1-s blank
    const countdownInterval = setInterval(tick, 1000);
  }


  /* ----------------------------------------------------------
     6. Product Category Filter (Cake Collection)
  ---------------------------------------------------------- */
  const filterTabs = $('.filter-tabs');
  const galleryItems = $$('.gallery-item');

  if (filterTabs && galleryItems.length) {
    filterTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Update active button
      $$('.filter-btn', filterTabs).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category || btn.dataset.filter || 'all';

      galleryItems.forEach((item) => {
        const matches = category === 'all' || item.dataset.category === category;

        if (matches) {
          item.classList.remove('hidden');
          // Trigger reflow so the fade-in re-fires
          void item.offsetWidth;
          item.style.animation = 'fadeFilterIn 0.45s ease forwards';
        } else {
          item.style.animation = 'fadeFilterOut 0.3s ease forwards';
          // After the fade-out finishes, actually hide
          setTimeout(() => item.classList.add('hidden'), 300);
        }
      });
    });
  }

  // Inject keyframes for filter animations (keeps CSS self-contained)
  const filterStyle = document.createElement('style');
  filterStyle.textContent = `
    @keyframes fadeFilterIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes fadeFilterOut {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to   { opacity: 0; transform: scale(0.95) translateY(10px); }
    }
    .gallery-item.hidden { display: none; }
  `;
  document.head.appendChild(filterStyle);


  /* ----------------------------------------------------------
     7. FAQ Accordion
  ---------------------------------------------------------- */
  const faqContainer = $('.faq-container') || $('.faqs') || document;

  faqContainer.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (!question) return;

    const parentItem = question.closest('.faq-item');
    if (!parentItem) return;

    const isOpen = parentItem.classList.contains('active');

    // Close every open item first (one-at-a-time)
    $$('.faq-item.active').forEach((item) => {
      item.classList.remove('active');
      const answer = $('.faq-answer', item);
      if (answer) answer.style.maxHeight = null;
    });

    // Toggle the clicked item (if it wasn't already open)
    if (!isOpen) {
      parentItem.classList.add('active');
      const answer = $('.faq-answer', parentItem);
      if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });


  /* ----------------------------------------------------------
     8. Smooth Scrolling for Anchor Links
  ---------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest("a[href^='#']");
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return; // skip bare '#'

    const targetEl = $(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    window.scrollTo({
      top: targetEl.offsetTop - navbarHeight,
      behavior: 'smooth',
    });

    // Close mobile menu if open
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      navToggle?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });


  /* ----------------------------------------------------------
     9. Back to Top Button
  ---------------------------------------------------------- */
  const backToTop = $('.back-to-top');

  const handleBackToTopVisibility = () => {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------------------------
     10. Lead Capture Form
  ---------------------------------------------------------- */
  const leadForm = $('#lead-capture-form');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect & validate
      const fields = $$('input, textarea, select', leadForm);
      let isValid = true;

      fields.forEach((field) => {
        // Remove previous error state
        field.classList.remove('error');

        if (field.hasAttribute('required') && !field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }

        // Email format check
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            field.classList.add('error');
            isValid = false;
          }
        }
      });

      if (!isValid) return;

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'form-success';
      successDiv.innerHTML = `
        <span class="success-icon">✓</span>
        <p>Thank you! We'll be in touch shortly.</p>
      `;

      // Style inline so it works even without matching CSS
      Object.assign(successDiv.style, {
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #d4af37, #f5e6a3)',
        borderRadius: '12px',
        color: '#1a1a1a',
        fontWeight: '600',
        animation: 'fadeFilterIn 0.5s ease forwards',
      });

      leadForm.replaceWith(successDiv);
    });
  }


  /* ----------------------------------------------------------
     11. Add to Cart Animation
  ---------------------------------------------------------- */
  let cartCount = 0;
  const cartBadge = $('.cart-count');

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn || btn.disabled) return;

    // Prevent double-clicks during animation
    btn.disabled = true;
    const originalText = btn.textContent;

    // Visual feedback
    btn.textContent = 'Added ✓';
    btn.classList.add('added');

    // Update cart badge
    cartCount++;
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.classList.add('bump');
      setTimeout(() => cartBadge.classList.remove('bump'), 300);
    }

    // Revert after 2 seconds
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('added');
      btn.disabled = false;
    }, 2000);
  });

  // Inject cart bump animation
  const cartStyle = document.createElement('style');
  cartStyle.textContent = `
    .cart-count.bump {
      animation: cartBump 0.3s ease;
    }
    @keyframes cartBump {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.4); }
      100% { transform: scale(1); }
    }
    .add-to-cart.added {
      background: #2e7d32 !important;
      pointer-events: none;
    }
  `;
  document.head.appendChild(cartStyle);


  /* ----------------------------------------------------------
     12. WhatsApp Button Entrance Animation
  ---------------------------------------------------------- */
  const whatsappBtn = $('.whatsapp-btn') || $('.whatsapp-float') || $("a[href*='wa.me']");

  if (whatsappBtn) {
    setTimeout(() => whatsappBtn.classList.add('visible'), 3000);
  }


  /* ----------------------------------------------------------
     13. Parallax-lite Effect (Desktop Only)
  ---------------------------------------------------------- */
  const heroSection = $('.hero') || $('header.hero') || $('.hero-section');

  const handleParallax = () => {
    if (!heroSection || window.innerWidth <= 1024) return;
    const offset = window.scrollY;
    // Only run while hero is in view for performance
    if (offset < window.innerHeight * 1.5) {
      heroSection.style.backgroundPositionY = `${offset * 0.2}px`;
    }
  };


  /* ----------------------------------------------------------
     15. Image Lazy-Load Enhancement
  ---------------------------------------------------------- */
  const images = $$('img');

  images.forEach((img) => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('loaded'), { once: true }); // avoid stuck state
    }
  });


  /* ----------------------------------------------------------
     Unified Scroll Handler (debounced via rAF)
  ---------------------------------------------------------- */
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      handleNavbarScroll();
      handleBackToTopVisibility();
      handleParallax();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Fire once on load to set initial state
  handleNavbarScroll();
  handleBackToTopVisibility();

});
