/**
 * SIAGA GEMPA - App Module
 * Navigasi, Accordion/Tab Mitigasi, Kontak Darurat, Animasi
 */

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. NAVBAR SCROLL EFFECT ──────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ── 2. MOBILE MENU TOGGLE ────────────────────────────────────────────────
  const menuBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen
      ? `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
      : `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  });

  // Tutup mobile menu saat link diklik
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });
  });

  // ── 3. SMOOTH SCROLL & ACTIVE NAV LINK ──────────────────────────────────
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ── 4. ACCORDION MITIGASI ────────────────────────────────────────────────
  document.querySelectorAll('.acc-header').forEach(header => {
    header.addEventListener('click', function () {
      const item   = this.closest('.acc-item');
      const body   = item.querySelector('.acc-body');
      const isOpen = body.classList.contains('open');

      // Tutup semua dalam panel yang sama
      const panel  = item.closest('.mitigation-panel');
      panel.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
      panel.querySelectorAll('.acc-header').forEach(h => h.classList.remove('open'));

      // Toggle yang diklik
      if (!isOpen) {
        body.classList.add('open');
        this.classList.add('open');
      }
    });
  });

  // Buka item pertama tiap panel secara default
  document.querySelectorAll('.mitigation-panel').forEach(panel => {
    const firstHeader = panel.querySelector('.acc-header');
    const firstBody   = panel.querySelector('.acc-body');
    if (firstHeader && firstBody) {
      firstHeader.classList.add('open');
      firstBody.classList.add('open');
    }
  });

  // ── 5. TAB MITIGASI ──────────────────────────────────────────────────────
  const tabs   = document.querySelectorAll('.mitigation-tab');
  const panels = document.querySelectorAll('.mitigation-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const target = this.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active-before', 'active-during', 'active-after');
      });
      panels.forEach(p => p.classList.remove('active'));

      const activeClass = `active-${target}`;
      this.classList.add(activeClass);

      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // ── 6. SALIN NOMOR TELEPON ───────────────────────────────────────────────
  window.copyNumber = function(number, btn) {
    navigator.clipboard.writeText(number).then(() => {
      showToast(`✓ Nomor ${number} telah disalin!`);
      const original = btn.innerHTML;
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Tersalin!`;
      btn.style.color = '#10b981';
      btn.style.borderColor = '#10b981';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2500);
    }).catch(() => {
      // Fallback untuk browser lama
      const el = document.createElement('textarea');
      el.value = number;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast(`✓ Nomor ${number} telah disalin!`);
    });
  };

  // ── 7. TOAST NOTIFICATION ────────────────────────────────────────────────
  window.showToast = function(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // ── 8. SCROLL REVEAL ANIMATION ───────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ── 9. ANIMATED COUNTER ──────────────────────────────────────────────────
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString();
      }
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ── 10. HERO SCROLL INDICATOR ────────────────────────────────────────────
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      document.getElementById('peta').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── 11. EARTHQUAKE SEISMOGRAPH ANIMATION ─────────────────────────────────
  // Simple SVG wave animation on hero canvas
  let time = 0;
  const canvas = document.getElementById('seismo-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = 80;

    function drawSeismo() {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239,68,68,0.6)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(239,68,68,0.5)';

      for (let x = 0; x < W; x++) {
        const freq = 0.04;
        const amp  = Math.sin(x * 0.03 + time) * 8
                   + Math.sin(x * 0.07 + time * 1.5) * 4
                   + Math.sin(x * 0.15 + time * 0.7) * 2;
        const y = H / 2 + amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      time += 0.05;
      requestAnimationFrame(drawSeismo);
    }
    drawSeismo();
  }

});
