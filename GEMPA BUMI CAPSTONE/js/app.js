/**
 * SIAGA GEMPA — App Module v2 (Dashboard)
 * Navbar, Accordion/Tabs Mitigasi, Kontak, Scroll Reveal, Seismograph
 */

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. MOBILE MENU ──────────────────────────────────────────────────────────
  var menuBtn    = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      var isOpen = mobileMenu.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.innerHTML = isOpen
        ? '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
        : '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
    });

    document.querySelectorAll('#mobile-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuBtn.innerHTML = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
      });
    });
  }

  // ── 2. ACTIVE NAV LINK (highlight saat scroll) ──────────────────────────────
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    var current = '';
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 80) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ── 3. SCROLL REVEAL ─────────────────────────────────────────────────────────
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── 4. ANIMATED COUNTER ──────────────────────────────────────────────────────
  function animateCounter(el, target, duration) {
    duration = duration || 1800;
    var step  = target / (duration / 16);
    var count = 0;
    var timer = setInterval(function () {
      count += step;
      if (count >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(count).toLocaleString();
      }
    }, 16);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          animateCounter(el, parseInt(el.dataset.target, 10));
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ── 5. SCROLL INDICATOR (hero → peta) ───────────────────────────────────────
  var scrollCue = document.getElementById('scroll-indicator');
  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var petaEl = document.getElementById('peta');
      if (petaEl) petaEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── 6. SEISMOGRAPH CANVAS ANIMATION ──────────────────────────────────────────
  var canvas = document.getElementById('seismo-canvas');
  if (canvas) {
    var ctx  = canvas.getContext('2d');
    var time = 0;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = 72;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawWave() {
      var W = canvas.width;
      var H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239,68,68,0.7)';
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = 'rgba(239,68,68,0.45)';

      for (var x = 0; x < W; x++) {
        var amp = Math.sin(x * 0.035 + time)       * 9
                + Math.sin(x * 0.08  + time * 1.4) * 4
                + Math.sin(x * 0.16  + time * 0.7) * 2;
        var y   = H / 2 + amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      time += 0.055;
      requestAnimationFrame(drawWave);
    }
    drawWave();
  }

  // ── 7. MITIGASI TABS ─────────────────────────────────────────────────────────
  var mitigasiTabs   = document.querySelectorAll('.mitigation-tab');
  var mitigasiPanels = document.querySelectorAll('.mitigation-panel');

  mitigasiTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.dataset.tab;

      mitigasiTabs.forEach(function (t) {
        t.classList.remove('active-before', 'active-during', 'active-after');
      });
      mitigasiPanels.forEach(function (p) { p.classList.remove('active'); });

      this.classList.add('active-' + target);
      var panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // ── 8. ACCORDION MITIGASI ─────────────────────────────────────────────────────
  document.querySelectorAll('.acc-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item   = this.closest('.acc-item');
      var body   = item.querySelector('.acc-body');
      var isOpen = body.classList.contains('open');

      // Close all in the same panel
      var panel = item.closest('.mitigation-panel');
      panel.querySelectorAll('.acc-body').forEach(function (b) { b.classList.remove('open'); });
      panel.querySelectorAll('.acc-header').forEach(function (h) { h.classList.remove('open'); });

      if (!isOpen) {
        body.classList.add('open');
        this.classList.add('open');
      }
    });
  });

  // Open first item in each panel by default
  document.querySelectorAll('.mitigation-panel').forEach(function (panel) {
    var firstH = panel.querySelector('.acc-header');
    var firstB = panel.querySelector('.acc-body');
    if (firstH && firstB) {
      firstH.classList.add('open');
      firstB.classList.add('open');
    }
  });

  // ── 9. COPY NUMBER (kontak darurat) ──────────────────────────────────────────
  window.copyNumber = function (number, btn) {
    navigator.clipboard.writeText(number).then(function () {
      showToast('✓ Nomor ' + number + ' disalin!');
      var orig = btn.innerHTML;
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Tersalin!';
      btn.style.color       = '#22c55e';
      btn.style.borderColor = '#22c55e';
      setTimeout(function () {
        btn.innerHTML         = orig;
        btn.style.color       = '';
        btn.style.borderColor = '';
      }, 2500);
    }).catch(function () {
      var el = document.createElement('textarea');
      el.value = number;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast('✓ Nomor ' + number + ' disalin!');
    });
  };

  // ── 10. TOAST NOTIFICATION ───────────────────────────────────────────────────
  window.showToast = function (message) {
    var toast = document.getElementById('toast');
    var msgEl = document.getElementById('toast-msg');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
  };

  // ── 11. SIDEBAR TAB CLICK (delegated, for dynamically built content) ─────────
  document.addEventListener('click', function (e) {
    var tabEl = e.target.closest('.sidebar-tab');
    if (tabEl) {
      window.switchSidebarTab(tabEl.dataset.tab);
    }
  });

});
