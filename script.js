/* ═══════════════════════════════════════
   DigiPigi — script.js
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Preloader ── */
  const preloader  = document.getElementById('preloader');
  const fillEl     = document.getElementById('preloaderFill');
  let   fillPct    = 0;

  const fillInterval = setInterval(() => {
    fillPct += Math.random() * 18 + 4;
    if (fillPct >= 100) {
      fillPct = 100;
      clearInterval(fillInterval);
      setTimeout(() => preloader.classList.add('hidden'), 300);
    }
    fillEl.style.width = fillPct + '%';
  }, 60);

  window.addEventListener('load', () => {
    fillPct = 100;
    fillEl.style.width = '100%';
    clearInterval(fillInterval);
    setTimeout(() => preloader.classList.add('hidden'), 400);
  });

  /* ── Custom Cursor ── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let fx = 0, fy = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    function animateFollower() {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverEls = document.querySelectorAll('a, button, .service-card, .work-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        follower.classList.add('cursor-follower--hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        follower.classList.remove('cursor-follower--hover');
      });
    });
  }

  /* ── Header scroll effect ── */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile nav toggle ── */
  const hamburger = document.getElementById('hamburger');
  const headerNav = document.getElementById('headerNav');

  hamburger.addEventListener('click', () => {
    const isOpen = headerNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  headerNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      headerNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  /* ── Contact form ── */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.style.color = '#ff6b6b';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.style.color = '#ff6b6b';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      formStatus.textContent = '';
      formStatus.style.color = '';

      const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxI0OU_K_4vqt-oyOXbd_plWttV-u8UBB0ftnmGgwqxxRtyXqYmNVvfFIGDrGHSAFPe/exec';

      try {
        await fetch(SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            company: form.company.value.trim(),
            service: form.service.value,
            message
          })
        });

        formStatus.textContent = "Message sent! We'll be in touch within 24 hours.";
        formStatus.style.color = 'var(--clr-accent)';
        form.reset();
      } catch {
        formStatus.textContent = 'Something went wrong. Please email us directly.';
        formStatus.style.color = '#ff6b6b';
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <span aria-hidden="true">→</span>';
    });
  }

  /* ── Footer year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
