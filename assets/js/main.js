/**
 * Aquatic Store — main.js
 * Vanilla ES6+. No frameworks, no build step required.
 * Sections:
 *   1. Theme (dark/light) switching
 *   2. Compact header on scroll
 *   3. Mobile off-canvas navigation
 *   4. Scroll-reveal animations
 *   5. Filter drawer (catalog pages)
 *   6. Form validation (contact / special order / newsletter)
 *   7. Countdown (coming-soon page)
 */
(() => {
  'use strict';

  const root = document.documentElement;

  /**
   * 1. THEME SWITCHING
   * Reads localStorage first, falls back to system preference.
   * Persists the user's explicit choice so it survives across pages.
   */
  const ThemeModule = {
    KEY: 'aquatic-theme',
    init() {
      const saved = localStorage.getItem(this.KEY);
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (systemDark ? 'dark' : 'light');
      root.setAttribute('data-theme', theme);

      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => this.toggle());
        btn.setAttribute('aria-pressed', theme === 'dark');
      });
    },
    toggle() {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(this.KEY, next);
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.setAttribute('aria-pressed', next === 'dark');
      });
    },
  };


  /**
   * 1b. GLOBAL RTL / LTR DIRECTION
   * Mirrors the full site and persists the visitor's choice across pages.
   */
  const DirectionModule = {
    KEY: 'aquatic-direction',
    init() {
      const saved = localStorage.getItem(this.KEY) || localStorage.getItem('aquatic-dir') || 'ltr';
      this.apply(saved);
      document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const next = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
          this.apply(next, true);
        });
      });
    },
    apply(dir, persist = false) {
      const isRTL = dir === 'rtl';
      root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      root.setAttribute('lang', isRTL ? 'ar' : 'en');
      root.classList.toggle('is-rtl', isRTL);
      document.body.classList.toggle('is-rtl', isRTL);
      document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
        btn.textContent = isRTL ? 'LTR' : 'RTL';
        btn.setAttribute('aria-label', isRTL ? 'Switch to LTR' : 'Switch to RTL');
        btn.setAttribute('aria-pressed', String(isRTL));
      });
      if (persist) localStorage.setItem(this.KEY, isRTL ? 'rtl' : 'ltr');
    },
  };

  /**
   * 2. COMPACT HEADER ON SCROLL
   */
  const HeaderModule = {
    init() {
      this.header = document.querySelector('.site-header');
      if (!this.header) return;
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll();
    },
    onScroll() {
      this.header.classList.toggle('is-compact', window.scrollY > 40);
    },
  };

  /**
   * 3. MOBILE OFF-CANVAS NAVIGATION
   */
  const MobileNavModule = {
    init() {
      this.panel = document.querySelector('.mobile-nav');
      this.openBtn = document.querySelector('[data-menu-open]');
      this.closeBtn = document.querySelector('[data-menu-close]');
      if (!this.panel || !this.openBtn) return;

      this.openBtn.addEventListener('click', () => this.open());
      this.closeBtn?.addEventListener('click', () => this.close());
      this.panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => this.close()));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    },
    open() {
      this.panel.classList.add('is-open');
      this.openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      this.panel.querySelector('a')?.focus();
    },
    close() {
      this.panel.classList.remove('is-open');
      this.openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    },
  };

  /**
   * 3b. HEADER NAVIGATION
   * Desktop dropdown (the Home-layout switcher), the slide-down search
   * panel, and the mobile submenu accordion. Hover alone opens the
   * dropdown via CSS; this adds click/keyboard parity for touch and
   * keyboard users.
   */
  const NavModule = {
    init() {
      this.dropdowns = Array.from(document.querySelectorAll('.nav-item.has-dropdown'));
      this.dropdowns.forEach((item) => {
        const toggle = item.querySelector('[data-dropdown-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const open = item.classList.contains('is-open');
          this.closeAll();
          if (!open) {
            item.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.has-dropdown')) this.closeAll();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeAll();
      });

      // Slide-down search
      const searchPanel = document.querySelector('[data-search-panel]');
      document.querySelectorAll('[data-search-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (!searchPanel) return;
          const open = searchPanel.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', String(open));
          if (open) searchPanel.querySelector('input')?.focus();
        });
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchPanel?.classList.contains('is-open')) {
          searchPanel.classList.remove('is-open');
          document.querySelector('[data-search-toggle]')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Mobile submenu accordion
      document.querySelectorAll('[data-sub-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const panel = btn.nextElementSibling;
          const open = panel?.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', String(!!open));
        });
      });
    },
    closeAll() {
      this.dropdowns.forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('[data-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
      });
    },
  };

  /**
   * 4. SCROLL-REVEAL
   * Respects prefers-reduced-motion by simply skipping the observer
   * (elements default to visible via the reduced-motion CSS block).
   */
  const RevealModule = {
    init() {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const items = document.querySelectorAll('.reveal');
      if (prefersReduced || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      items.forEach((el) => io.observe(el));
    },
  };

  /**
   * 5. CATALOG FILTER DRAWER (mobile)
   */
  const FilterDrawerModule = {
    init() {
      const openBtn = document.querySelector('[data-filter-open]');
      const drawer = document.querySelector('[data-filter-drawer]');
      const closeBtn = document.querySelector('[data-filter-close]');
      if (!openBtn || !drawer) return;
      openBtn.addEventListener('click', () => drawer.classList.add('is-open'));
      closeBtn?.addEventListener('click', () => drawer.classList.remove('is-open'));
    },
  };

  /**
   * 6. FORM VALIDATION
   * Works for the contact form and special-order enquiry form.
   * Compatible with Formspree/Netlify: the fetch call below is
   * a TODO stub — replace the action URL and uncomment fetch to
   * go live without changing markup.
   */
  const FormModule = {
    init() {
      document.querySelectorAll('form[data-validate]').forEach((form) => this.bind(form));
    },
    bind(form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach((field) => {
          const group = field.closest('.form-field');
          const ok = field.type === 'checkbox' ? field.checked : field.value.trim().length > 0;
          const emailOk = field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
          const lenOk = !(field.minLength > 0) || field.value.length >= field.minLength;
          if (!ok || !emailOk || !lenOk) {
            group?.classList.add('has-error');
            valid = false;
          } else {
            group?.classList.remove('has-error');
          }
        });

        if (!valid) {
          form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus();
          return;
        }

        // TODO: point this at your Formspree endpoint or Netlify Forms
        // e.g. fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        const successEl = form.parentElement.querySelector('.form-success');
        if (successEl) {
          successEl.classList.add('is-visible');
          successEl.setAttribute('role', 'status');
        }
        form.reset();
      });
    },
  };

  /**
   * 7. COUNTDOWN (coming-soon page)
   */
  const CountdownModule = {
    init() {
      const el = document.querySelector('[data-countdown]');
      if (!el) return;
      const target = new Date(el.dataset.countdown).getTime();
      const dEl = el.querySelector('[data-days]');
      const hEl = el.querySelector('[data-hours]');
      const mEl = el.querySelector('[data-mins]');
      const sEl = el.querySelector('[data-secs]');

      const tick = () => {
        const diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        if (dEl) dEl.textContent = String(d).padStart(2, '0');
        if (hEl) hEl.textContent = String(h).padStart(2, '0');
        if (mEl) mEl.textContent = String(m).padStart(2, '0');
        if (sEl) sEl.textContent = String(s).padStart(2, '0');
      };
      tick();
      setInterval(tick, 1000);
    },
  };


  /**
   * 8. ORDER BAG
   * "Add to order" buttons bump the bag counter and confirm with a
   * short toast. The count persists across pages in localStorage.
   * TODO: replace with your cart / checkout integration.
   */
  const OrderModule = {
    KEY: 'aquatic-order-count',
    init() {
      this.countEls = document.querySelectorAll('[data-bag-count]');
      const saved = parseInt(localStorage.getItem(this.KEY) || '', 10);
      if (!Number.isNaN(saved)) this.render(saved);
      document.querySelectorAll('[data-add-order]').forEach((btn) => {
        btn.addEventListener('click', () => this.add(btn));
      });
    },
    current() {
      const el = this.countEls[0];
      return el ? parseInt(el.textContent, 10) || 0 : 0;
    },
    render(n) {
      this.countEls.forEach((el) => {
        el.textContent = n;
        el.closest('[data-bag]')?.setAttribute('aria-label', `Your order, ${n} item${n === 1 ? '' : 's'}`);
      });
    },
    add(btn) {
      const n = this.current() + 1;
      this.render(n);
      localStorage.setItem(this.KEY, String(n));
      this.countEls.forEach((el) => {
        el.classList.remove('is-bumped');
        void el.offsetWidth;
        el.classList.add('is-bumped');
      });
      const label = btn.textContent;
      btn.textContent = 'Added';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 1400);
      this.toast(`${btn.dataset.addOrder} added to your order.`);
    },
    toast(msg) {
      let t = document.querySelector('.order-toast');
      if (!t) {
        t = document.createElement('div');
        t.className = 'order-toast';
        t.setAttribute('role', 'status');
        t.setAttribute('aria-live', 'polite');
        document.body.appendChild(t);
      }
      const inPages = location.pathname.includes('/pages/');
      t.innerHTML = `<i class="bi bi-check-circle-fill" aria-hidden="true"></i><span></span><a href="${inPages ? '' : 'pages/'}contact.html#special-order">Review order</a>`;
      t.querySelector('span').textContent = msg;
      requestAnimationFrame(() => t.classList.add('is-visible'));
      clearTimeout(this.timer);
      this.timer = setTimeout(() => t.classList.remove('is-visible'), 3200);
    },
  };

  /**
   * 9. ENQUIRY PREFILL
   * Links like contact.html?item=Yellow%20Tang#special-order drop the
   * product name into the special-order message box.
   */
  const EnquiryModule = {
    init() {
      const item = new URLSearchParams(location.search).get('item');
      const field = document.getElementById('so-message');
      if (!item || !field || field.value) return;
      field.value = `I'd like to order or ask about: ${item}\n`;
    },
  };

  /**
   * 10. ACCOUNT TABS (login.html) + simple chip filters
   */
  const TabsModule = {
    init() {
      const tabs = Array.from(document.querySelectorAll('[data-auth-tab]'));
      if (tabs.length) {
        const show = (id) => {
          tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.authTab === id)));
          document.querySelectorAll('[data-auth-panel]').forEach((p) => { p.hidden = p.dataset.authPanel !== id; });
        };
        tabs.forEach((t) => t.addEventListener('click', () => show(t.dataset.authTab)));
        document.querySelectorAll('[data-auth-switch]').forEach((b) => b.addEventListener('click', () => show(b.dataset.authSwitch)));
        show(location.hash === '#signup' ? 'signup' : 'login');
        window.addEventListener('hashchange', () => show(location.hash === '#signup' ? 'signup' : 'login'));
      }

      document.querySelectorAll('[data-chip-group]').forEach((group) => {
        group.querySelectorAll('.filter-chip').forEach((chip) => {
          chip.addEventListener('click', () => {
            group.querySelectorAll('.filter-chip').forEach((c) => {
              c.classList.toggle('is-active', c === chip);
              c.setAttribute('aria-pressed', String(c === chip));
            });
          });
        });
      });
    },
  };

  /**
   * 11. EQUIPMENT CATEGORY NAV
   * Highlights the category in view, and filters products by tank type
   * (a product matches if it suits ANY ticked type). Empty categories
   * hide, counts update, and an empty state offers a special order.
   */
  const EquipNavModule = {
    init() {
      const links = Array.from(document.querySelectorAll('[data-cat-link]'));
      if (!links.length) return;
      const heads = links.map((l) => document.getElementById(l.dataset.catLink)).filter(Boolean);

      const setActive = (id) => links.forEach((l) => {
        const on = l.dataset.catLink === id;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
      const onScroll = () => {
        const visible = heads.filter((h) => h.offsetParent !== null);
        let current = visible[0]?.id;
        visible.forEach((h) => { if (h.getBoundingClientRect().top < 180) current = h.id; });
        if (current) setActive(current);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      links.forEach((l) => l.addEventListener('click', () => setActive(l.dataset.catLink)));
      onScroll();

      const box = document.querySelector('[data-tank-filter]');
      if (!box) return;
      const inputs = Array.from(box.querySelectorAll('input[type=checkbox]'));
      const status = box.querySelector('[data-filter-status]');
      const clear = box.querySelector('[data-filter-clear]');
      const empty = document.querySelector('[data-filter-empty]');
      const cards = Array.from(document.querySelectorAll('.fish-card[data-tank]'));

      const apply = () => {
        const picked = inputs.filter((i) => i.checked).map((i) => i.value);
        let shown = 0;
        cards.forEach((c) => {
          const tags = c.dataset.tank.split(' ');
          const ok = !picked.length || picked.some((p) => tags.includes(p));
          c.classList.toggle('is-filtered-out', !ok);
          if (ok) shown += 1;
        });
        heads.forEach((h) => {
          const grid = h.closest('.catalog-toolbar')?.nextElementSibling;
          if (!grid) return;
          const n = grid.querySelectorAll('.fish-card:not(.is-filtered-out)').length;
          h.closest('.catalog-toolbar').classList.toggle('is-filtered-out', n === 0);
          grid.classList.toggle('is-filtered-out', n === 0);
          const count = document.querySelector(`[data-cat-count="${h.id}"]`);
          if (count) count.textContent = n;
          document.querySelector(`[data-cat-link="${h.id}"]`)?.classList.toggle('is-empty', n === 0);
        });
        if (status) status.textContent = picked.length ? `Showing ${shown} of ${cards.length} products` : `Showing all ${cards.length} products`;
        if (clear) clear.hidden = !picked.length;
        if (empty) empty.hidden = shown !== 0;
        onScroll();
      };
      inputs.forEach((i) => i.addEventListener('change', apply));
      clear?.addEventListener('click', () => { inputs.forEach((i) => { i.checked = false; }); apply(); });
      apply();
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    ThemeModule.init();
    DirectionModule.init();
    HeaderModule.init();
    MobileNavModule.init();
    NavModule.init();
    RevealModule.init();
    FilterDrawerModule.init();
    FormModule.init();
    CountdownModule.init();
    OrderModule.init();
    EnquiryModule.init();
    TabsModule.init();
    EquipNavModule.init();
  });
})();
