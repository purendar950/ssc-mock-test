/* ==========================================================
   TestHub — Front-end Application Logic
   ========================================================== */

(function () {
  'use strict';

  const App = window.App = {};
  const SESSION_KEY = 'testhub.session';
  const BUY_KEY = 'testhub.buy';
  const ORDERS_KEY = 'testhub.orders';
  const SERIES_KEY = 'testhub.series';
  const DRAFTS_KEY = 'testhub.drafts';
  const ADMIN_KEY = 'testhub.admin';

  /* ---------- STORAGE HELPERS ---------- */
  const Store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} },
    seed(key, data) {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Seed admin data on first load
  Store.seed(ORDERS_KEY, DEMO_ORDERS);
  Store.seed(SERIES_KEY, TEST_SERIES);
  Store.seed(DRAFTS_KEY, DEMO_DRAFTS);

  /* ============== HOME: featured tests ============== */
  App.renderFeatured = function () {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const list = TEST_CATALOG;
    grid.innerHTML = list.map(t => `
      <article class="test-card" data-type="${t.type}">
        <div class="test-banner ${t.color}">${t.exam.split(' ').pop()}</div>
        <div class="test-body">
          <div class="test-tags">
            <span class="pill ${t.type==='pro'?'pill-pro':'pill-free'}">${t.type.toUpperCase()}</span>
            <span class="pill pill-hi">${t.lang}</span>
          </div>
          <h4 class="test-title">${t.title}</h4>
          <div class="test-meta">
            <span>📝 ${t.qs} Qs</span>
            <span>⏱️ ${t.duration}</span>
            <span>⭐ ${t.rating}</span>
          </div>
          <div class="test-foot">
            <span class="users">${t.attempts} attempts</span>
            <a href="test.html" class="btn btn-primary">Take test</a>
          </div>
        </div>
      </article>
    `).join('');

    document.querySelectorAll('.filter-tabs .tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-tabs .tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        grid.querySelectorAll('.test-card').forEach(c => {
          const type = c.dataset.type;
          const lang = c.querySelector('.pill-hi')?.textContent || '';
          let show = tab === 'all';
          if (tab === 'hindi') show = lang.toLowerCase().includes('hindi') || lang.toLowerCase().includes('bilingual');
          else if (['free','pro','pyq'].includes(tab)) show = type === tab;
          c.style.display = show ? '' : 'none';
        });
      });
    });
  };

  /* ============== HOME + SERIES: render series bundles ============== */
  App.renderSeries = function (containerId, filter) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    const series = Store.get(SERIES_KEY, TEST_SERIES);

    const filtered = series.filter(s => {
      if (!filter || filter === 'all' || filter === 'all-in-one') return true;
      if (filter === 'mts') return s.id.includes('mts') || s.id.includes('gd');
      return s.id.includes(filter);
    });

    grid.innerHTML = filtered.map(s => {
      const save = s.originalPrice ? Math.round((1 - s.price / s.originalPrice) * 100) : 0;
      return `
      <article class="series-card ${s.bestseller ? 'featured' : ''}">
        <div class="series-banner ${s.banner}">
          ${s.bestseller ? '<span class="series-bestseller">⭐ BESTSELLER</span>' : ''}
          <h3>${s.name}</h3>
          <p>${s.tagline}</p>
        </div>
        <div class="series-body">
          <ul class="series-features">
            ${s.features.slice(0, 6).map(f => `<li>${f}</li>`).join('')}
            ${s.features.length > 6 ? `<li class="muted small">+${s.features.length - 6} more benefits</li>` : ''}
          </ul>
          <div class="series-foot">
            <div class="series-price">
              <span class="now">₹${s.price}</span>
              ${s.originalPrice ? `<span class="was">₹${s.originalPrice}</span><span class="save">Save ${save}%</span>` : ''}
            </div>
            <a href="buy.html?series=${s.id}" class="btn btn-accent">Buy now</a>
          </div>
        </div>
      </article>`;
    }).join('');
  };

  /* ============== TESTS PAGE: list with filters ============== */
  App.renderTestList = function (containerId) {
    const list = document.getElementById(containerId);
    if (!list) return;
    list.innerHTML = TEST_CATALOG.map(t => `
      <div class="test-row" data-test='${JSON.stringify(t).replace(/'/g, "&apos;")}'>
        <div class="ico ${t.color}">${t.exam.split(' ').pop().slice(0,2)}</div>
        <div class="test-row-body">
          <h4>${t.title}</h4>
          <div class="meta">
            <span>📚 ${t.exam}</span>
            <span>📝 ${t.qs} Qs</span>
            <span>⏱️ ${t.duration}</span>
            <span>🌐 ${t.lang}</span>
            <span>👥 ${t.attempts}</span>
            <span>⭐ ${t.rating}</span>
          </div>
        </div>
        <div class="actions">
          <span class="pill ${t.type==='pro'?'pill-pro':'pill-free'}">${t.type.toUpperCase()}</span>
          <a href="test.html" class="btn btn-primary">Start</a>
        </div>
      </div>
    `).join('');
  };

  App.attachFilters = function () {
    const list = document.getElementById('testList');
    if (!list) return;
    const search = document.getElementById('searchInput');
    const sort = document.getElementById('sortBy');

    function apply() {
      const examFilters = [...document.querySelectorAll('[data-filter="exam"]:checked')].map(c => c.value);
      const typeFilters = [...document.querySelectorAll('[data-filter="type"]:checked')].map(c => c.value);
      const langFilters = [...document.querySelectorAll('[data-filter="lang"]:checked')].map(c => c.value);
      const q = (search.value || '').toLowerCase();

      [...list.querySelectorAll('.test-row')].forEach(r => {
        const d = JSON.parse(r.dataset.test);
        let show = true;
        if (examFilters.length && !examFilters.some(f => d.exam.toLowerCase().includes(f))) show = false;
        if (typeFilters.length && !typeFilters.includes(d.type)) show = false;
        if (langFilters.length) {
          const langMap = { en:'English', hi:'Hindi', bi:'Bilingual' };
          if (!langFilters.some(f => d.lang === langMap[f])) show = false;
        }
        if (q && !d.title.toLowerCase().includes(q) && !d.exam.toLowerCase().includes(q)) show = false;
        r.style.display = show ? '' : 'none';
      });
    }

    document.querySelectorAll('.filter-panel input').forEach(i => i.addEventListener('change', apply));
    if (search) search.addEventListener('input', apply);
    if (sort) sort.addEventListener('change', () => {
      const rows = [...list.querySelectorAll('.test-row')];
      rows.sort((a,b) => {
        const da = JSON.parse(a.dataset.test), db = JSON.parse(b.dataset.test);
        if (sort.value === 'rating') return db.rating - da.rating;
        if (sort.value === 'newest') return db.id > da.id ? 1 : -1;
        return parseInt(db.attempts.replace(/,/g,'')) - parseInt(da.attempts.replace(/,/g,''));
      });
      rows.forEach(r => list.appendChild(r));
    });
    document.getElementById('clearFilters')?.addEventListener('click', () => {
      document.querySelectorAll('.filter-panel input').forEach(i => i.checked = false);
      if (search) search.value = '';
      apply();
    });
  };

  /* ============== TEST PAGE: take test (DARK THEME) ============== */
  let state = null;

  /* ---- UNIFIED MODAL SYSTEM (bulletproof open/close) ---- */
  const MODAL_IDS = {
    instructions: 'instructionsModal',
    palette: 'paletteModal',
    drawer: 'drawerModal',
    calc: 'calcModal',
    submit: 'submitModal'
  };

  App.modal = {
    open(name) {
      const m = document.getElementById(MODAL_IDS[name]);
      if (!m) return;
      m.classList.add('show');
      m.removeAttribute('hidden');
      m.setAttribute('aria-hidden', 'false');
      if (name === 'calc') resetCalc();
      if (name === 'palette') {
        App.renderPalette();
        App.setPaletteView('grid');
      }
    },
    close(name) {
      const m = document.getElementById(MODAL_IDS[name]);
      if (!m) return;
      m.classList.remove('show');
      m.setAttribute('hidden', '');
      m.setAttribute('aria-hidden', 'true');
    },
    closeAll() {
      Object.keys(MODAL_IDS).forEach(n => App.modal.close(n));
    },
    isOpen(name) {
      const m = document.getElementById(MODAL_IDS[name]);
      return m && !m.hasAttribute('hidden');
    }
  };

  /* Old-style helpers — keep names so existing code still works */
  App.openPalette = () => App.modal.open('palette');
  App.closePalette = () => App.modal.close('palette');
  App.openDrawer   = () => App.modal.open('drawer');
  App.closeDrawer  = () => App.modal.close('drawer');
  App.openCalc     = () => App.modal.open('calc');
  App.closeCalc    = () => App.modal.close('calc');

  App.initTest = function () {
    const bank = QUESTIONS_BANK.cgl17;
    state = {
      test: bank,
      current: 0,
      answers: new Array(bank.questions.length).fill(null),
      visited: new Array(bank.questions.length).fill(false),
      marked: new Array(bank.questions.length).fill(false),
      bookmarked: new Array(bank.questions.length).fill(false),
      starred: new Array(bank.questions.length).fill(false),
      reported: new Array(bank.questions.length).fill(false),
      timeLeft: bank.duration * 60,
      qTimeAt: Date.now(),
      qTimeSpent: new Array(bank.questions.length).fill(0),
      timerId: null,
      qTimerId: null,
      paused: false
    };
    state.visited[0] = true;

    // Show instructions on load
    const instructionsEl = document.getElementById('instructionsModal');
    if (instructionsEl) {
      instructionsEl.removeAttribute('hidden');
      instructionsEl.classList.add('show');
    }

    // Title in header
    const titleEl = document.getElementById('testTitle');
    if (titleEl) titleEl.textContent = state.test.title;

    // Start button
    const agree = document.getElementById('agreeChk');
    const start = document.getElementById('startTestBtn');
    agree.addEventListener('change', () => start.disabled = !agree.checked);
    start.addEventListener('click', () => {
      App.modal.close('instructions');
      App.startTimer();
      App.startQTimer();
      App.renderQuestion();
    });

    // Bottom action bar
    document.getElementById('nextBtn').addEventListener('click', () => App.navigate(1));
    document.getElementById('clearResponseBtn').addEventListener('click', App.clearResponse);
    document.getElementById('markReviewBtn').addEventListener('click', App.markReview);

    // Meta row icons
    document.getElementById('bookmarkBtn').addEventListener('click', () => {
      state.bookmarked[state.current] = !state.bookmarked[state.current];
      document.getElementById('bookmarkBtn').classList.toggle('active', state.bookmarked[state.current]);
    });
    document.getElementById('starBtn').addEventListener('click', () => {
      state.starred[state.current] = !state.starred[state.current];
      document.getElementById('starBtn').classList.toggle('active', state.starred[state.current]);
    });
    document.getElementById('reportBtn').addEventListener('click', () => {
      state.reported[state.current] = !state.reported[state.current];
      document.getElementById('reportBtn').classList.toggle('active', state.reported[state.current]);
      if (state.reported[state.current]) alert('⚠ Question reported. Our team will review it.');
    });

    // Pause
    document.getElementById('pauseBtn').addEventListener('click', App.togglePause);

    // Drawer items (language, sections, instructions)
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.action;
        App.modal.close('drawer');
        if (a === 'lang') {
          const cur = document.getElementById('mLangLabel').textContent;
          const next = cur === 'English' ? 'हिंदी' : 'English';
          document.getElementById('mLangLabel').textContent = next;
        } else if (a === 'sections') {
          const sec = +prompt('Jump to section:\n0 = Reasoning (1-25)\n1 = GA (26-50)\n2 = Quant (51-75)\n3 = English (76-100)', '0');
          if (!isNaN(sec) && sec >= 0 && sec <= 3) {
            state.current = bank.sections[sec].questions[0] - 1;
            state.visited[state.current] = true;
            App.renderQuestion();
          }
        } else if (a === 'instructions') {
          App.modal.open('instructions');
        }
      });
    });

    // Submit confirm
    document.getElementById('confirmSubmit').addEventListener('click', App.submitTest);

    // =========== DELEGATED HANDLERS (work for any element) ===========
    document.addEventListener('click', (e) => {
      // 1. data-modal-close="<name>" → close that specific modal
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        e.preventDefault(); e.stopPropagation();
        App.modal.close(closeBtn.dataset.modalClose);
        return;
      }
      // 2. data-modal-open="<name>" → close all then open
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) {
        e.preventDefault(); e.stopPropagation();
        const which = openBtn.dataset.modalOpen;
        // For most modals, close the drawer first if it's open
        if (which !== 'drawer' && App.modal.isOpen('drawer')) App.modal.close('drawer');
        App.modal.open(which);
        return;
      }
      // 3. Palette view tabs (Grid / List)
      const view = e.target.closest('[data-pd-view]');
      if (view) {
        e.preventDefault();
        App.setPaletteView(view.dataset.pdView);
        return;
      }
      // 4. Palette section header collapse
      const secHead = e.target.closest('#pdSectionToggle');
      if (secHead) {
        e.preventDefault();
        App.togglePaletteSection();
        return;
      }
      // 5. Tap on backdrop area (outside the sheet) closes
      const backdrop = e.target.closest('[data-modal]');
      if (backdrop && e.target === backdrop) {
        App.modal.close(backdrop.dataset.modal);
        return;
      }
      // 6. Calculator key
      const calcKey = e.target.closest('[data-k]');
      if (calcKey) { e.preventDefault(); calcPress(calcKey.dataset.k); return; }
    });

    // Swipe-right on palette drawer header to close (natural mobile gesture for right drawer)
    const pdHead = document.querySelector('.pd-header');
    if (pdHead) {
      let startX = null;
      pdHead.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      pdHead.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const dx = (e.changedTouches[0].clientX - startX);
        if (dx < -60) App.modal.close('palette');
        startX = null;
      });
    }

    // Escape closes top-most open modal (or pause if none)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const open = ['submit', 'calc', 'palette', 'drawer', 'instructions']
          .find(n => App.modal.isOpen(n));
        if (open) App.modal.close(open);
        else if (state.paused) App.togglePause();
        return;
      }
      if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName || '')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); App.navigate(1); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); App.navigate(-1); }
      }
    });

    App.renderPalette();
    App.renderQuestion();
  };

  /* === CALCULATOR === */
  let calcExpr = '';
  function resetCalc() { calcExpr = ''; updateCalcDisplay(); }
  function updateCalcDisplay() {
    const d = document.getElementById('calcDisplay');
    if (d) d.textContent = calcExpr || '0';
  }
  function calcPress(k) {
    if (k === 'C') { calcExpr = ''; }
    else if (k === '=') {
      try {
        const safe = calcExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        const result = Function('"use strict"; return (' + safe + ')')();
        calcExpr = String(result);
      } catch (e) { calcExpr = 'Error'; }
    } else if (k === '%') { calcExpr += '/100'; }
    else { calcExpr += k; }
    updateCalcDisplay();
  }

  /* === PAUSE === */
  App.togglePause = function () {
    if (!state) return;
    state.paused = !state.paused;
    const btn = document.getElementById('pauseBtn');
    if (state.paused) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
      clearInterval(state.timerId);
      clearInterval(state.qTimerId);
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
      state.timerId = setInterval(App.tickMain, 1000);
      state.qTimeAt = Date.now();
      state.qTimerId = setInterval(App.tickQ, 1000);
    }
  };

  App.startTimer = function () {
    state.timerId = setInterval(App.tickMain, 1000);
  };
  App.tickMain = function () {
    if (!state || state.paused) return;
    const t = document.getElementById('timer');
    const h = Math.floor(state.timeLeft / 3600);
    const m = Math.floor((state.timeLeft % 3600) / 60);
    const s = state.timeLeft % 60;
    t.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    t.style.color = state.timeLeft <= 60 ? '#ff7066' : '#fff';
    if (state.timeLeft <= 0) { clearInterval(state.timerId); App.submitTest(); return; }
    state.timeLeft--;
  };
  App.startQTimer = function () {
    state.qTimeAt = Date.now();
    state.qTimerId = setInterval(App.tickQ, 1000);
  };
  App.tickQ = function () {
    if (!state || state.paused) return;
    const el = document.getElementById('qTimeSpent');
    if (!el) return;
    const sec = state.qTimeSpent[state.current] + Math.floor((Date.now() - state.qTimeAt) / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  App.renderQuestion = function () {
    if (!state) return;
    if (state.qTimeAt) {
      const spent = Math.floor((Date.now() - state.qTimeAt) / 1000);
      state.qTimeSpent[state.current] = (state.qTimeSpent[state.current] || 0) + spent;
    }
    state.qTimeAt = Date.now();

    const q = state.test.questions[state.current];
    document.getElementById('qNumBadge').textContent = state.current + 1;
    document.getElementById('qText').textContent = q.text;
    const opts = document.getElementById('qOptions');
    opts.innerHTML = q.opts.map((o, i) => `
      <div class="q-opt ${state.answers[state.current] === i ? 'selected' : ''}" data-i="${i}">
        <span class="opt-num">${i + 1}.</span>
        <span class="opt-text">${o}</span>
        <span class="opt-tick">✓</span>
      </div>
    `).join('');
    opts.querySelectorAll('.q-opt').forEach(el => {
      el.addEventListener('click', () => {
        state.answers[state.current] = +el.dataset.i;
        App.renderQuestion();
        App.renderPalette();
      });
    });

    document.getElementById('bookmarkBtn').classList.toggle('active', !!state.bookmarked[state.current]);
    document.getElementById('starBtn').classList.toggle('active', !!state.starred[state.current]);
    document.getElementById('reportBtn').classList.toggle('active', !!state.reported[state.current]);

    const el = document.getElementById('qTimeSpent');
    if (el) {
      const sec = state.qTimeSpent[state.current] || 0;
      el.textContent = `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
    }

    document.querySelector('.tm')?.scrollTo({ top: 0, behavior: 'smooth' });
    App.renderPalette();
  };

  App.navigate = function (delta) {
    if (!state) return;
    const next = state.current + delta;
    if (next < 0 || next >= state.test.questions.length) return;
    state.visited[next] = true;
    state.current = next;
    App.renderQuestion();
  };

  App.clearResponse = function () {
    if (!state) return;
    state.answers[state.current] = null;
    App.renderQuestion();
    App.renderPalette();
  };

  App.markReview = function () {
    if (!state) return;
    state.marked[state.current] = !state.marked[state.current];
    App.renderPalette();
    App.navigate(1);
  };

  /* Compute one of 4 states for each question in priority order:
     marked (red star) > attempted (blue) > unattempted (gray) > unseen (outline) */
  function qState(i) {
    if (state.marked[i]) return 'marked';
    if (state.answers[i] !== null) return 'attempted';
    if (state.visited[i]) return 'unattempted';
    return 'unseen';
  }

  App.renderPalette = function () {
    if (!state) return;
    const grid = document.getElementById('paletteGridMobile');
    const list = document.getElementById('paletteListMobile');
    if (!grid) return;

    // ---- 4 counters ----
    let cMarked = 0, cAttempted = 0, cUnattempted = 0, cUnseen = 0;
    state.test.questions.forEach((_, i) => {
      const s = qState(i);
      if (s === 'marked') cMarked++;
      else if (s === 'attempted') cAttempted++;
      else if (s === 'unattempted') cUnattempted++;
      else cUnseen++;
    });
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('pdMarked', cMarked);
    set('pdAttempted', cAttempted);
    set('pdUnattempted', cUnattempted);
    set('pdUnseen', cUnseen);

    // ---- Grid view: circles with state + red star for marked ----
    grid.innerHTML = state.test.questions.map((_, i) => {
      const s = qState(i);
      const isCurrent = i === state.current;
      const star = s === 'marked' ? '<span class="pd-star">★</span>' : '';
      return `<button class="pd-q ${s}${isCurrent ? ' current' : ''}" data-i="${i}" title="Question ${i + 1}">${i + 1}${star}</button>`;
    }).join('');
    grid.querySelectorAll('.pd-q').forEach(b => {
      b.addEventListener('click', () => {
        state.visited[+b.dataset.i] = true;
        state.current = +b.dataset.i;
        App.renderQuestion();
        App.modal.close('palette');
      });
    });

    // ---- List view: grouped by section with status dots ----
    if (list) {
      const sections = state.test.sections;
      list.innerHTML = sections.map((sec, sIdx) => {
        const rows = [];
        for (let i = sec.questions[0] - 1; i <= sec.questions[1] - 1; i++) {
          const s = qState(i);
          const isCurrent = i === state.current;
          const statusClass = s;
          const statusChar = s === 'marked' ? '★' : '';
          rows.push(`
            <div class="pd-list-row${isCurrent ? ' current' : ''}" data-i="${i}">
              <span class="pd-list-num">Q${i + 1}</span>
              <span class="pd-list-status ${statusClass}">${statusChar}</span>
              <span class="pd-list-label">${s === 'attempted' ? 'Attempted' : s === 'marked' ? 'Marked for review' : s === 'unattempted' ? 'Visited — not answered' : 'Not visited'}</span>
            </div>`);
        }
        return `
          <div class="pd-list-section">
            <div class="pd-list-section-title">Section ${sIdx + 1} · ${sec.name} <span style="float:right;font-weight:600">Q${sec.questions[0]}–Q${sec.questions[1]}</span></div>
            ${rows.join('')}
          </div>`;
      }).join('');
      list.querySelectorAll('.pd-list-row').forEach(r => {
        r.addEventListener('click', () => {
          state.visited[+r.dataset.i] = true;
          state.current = +r.dataset.i;
          App.renderQuestion();
          App.modal.close('palette');
        });
      });
    }
  };

  /* ---- View tab switcher (Grid ↔ List) ---- */
  App.setPaletteView = function (which) {
    const grid = document.getElementById('paletteGridMobile');
    const list = document.getElementById('paletteListMobile');
    document.querySelectorAll('[data-pd-view]').forEach(t => t.classList.toggle('active', t.dataset.pdView === which));
    if (which === 'list') {
      if (grid) grid.hidden = true;
      if (list) list.hidden = false;
    } else {
      if (grid) grid.hidden = false;
      if (list) list.hidden = true;
    }
  };

  /* ---- Section collapse/expand ---- */
  App.togglePaletteSection = function () {
    const sec = document.querySelector('.pd-section');
    if (sec) sec.classList.toggle('collapsed');
  };

  App.openSubmit = function () {
    if (!state) return;
    const unanswered = state.answers.filter(a => a === null).length;
    document.getElementById('unattemptedWarn').textContent = unanswered;
    const attempted = state.test.questions.length - unanswered;
    const marked = state.marked.filter(Boolean).length;
    document.getElementById('submitSummary').innerHTML = `
      <li><span>Total questions</span><strong>${state.test.questions.length}</strong></li>
      <li><span>Attempted</span><strong style="color:var(--success)">${attempted}</strong></li>
      <li><span>Unattempted</span><strong style="color:var(--danger)">${unanswered}</strong></li>
      <li><span>Marked for review</span><strong style="color:var(--accent)">${marked}</strong></li>
    `;
    App.modal.open('submit');
  };

  App.submitTest = function () {
    clearInterval(state.timerId);
    let correct = 0, wrong = 0, skipped = 0;
    let topicStats = {};
    let sectionStats = {};
    state.test.questions.forEach((q, i) => {
      const a = state.answers[i];
      const secName = state.test.sections.find(s => i + 1 >= s.questions[0] && i + 1 <= s.questions[1]).name;
      if (!sectionStats[secName]) sectionStats[secName] = { correct:0, wrong:0, total:0 };
      sectionStats[secName].total++;
      if (a === null) { skipped++; }
      else if (a === q.ans) { correct++; sectionStats[secName].correct++; }
      else { wrong++; sectionStats[secName].wrong++; }
      if (!topicStats[q.topic]) topicStats[q.topic] = { correct:0, total:0 };
      topicStats[q.topic].total++;
      if (a === q.ans) topicStats[q.topic].correct++;
    });
    const score = Math.max(0, correct * 2 - wrong * 0.5);
    const accuracy = (correct + wrong) ? (correct / (correct + wrong) * 100) : 0;
    const percentile = Math.min(99.9, 60 + (score / 200) * 39).toFixed(1);
    const rank = Math.max(124, Math.floor(20000 - score * 80));
    const session = {
      title: state.test.title, total: state.test.questions.length,
      correct, wrong, skipped, score: Math.round(score), max: state.test.totalMarks,
      accuracy: accuracy.toFixed(1), percentile, rank: rank.toLocaleString('en-IN'),
      timeUsed: state.test.duration * 60 - state.timeLeft,
      sectionStats, topicStats
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.location.href = 'result.html';
  };

  /* ============== RESULT PAGE ============== */
  App.renderResult = function () {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) { App.renderDemoResult(); return; }
    App.paintResult(JSON.parse(raw));
  };

  App.renderDemoResult = function () {
    const s = {
      title: 'SSC CGL Tier-I Mock 17', total: 100, correct: 68, wrong: 12, skipped: 20,
      score: 130, max: 200, accuracy: 85.0, percentile: 95.4, rank: '1,842', timeUsed: 3120,
      sectionStats: {
        'General Intelligence & Reasoning': { correct: 18, wrong: 3, total: 25 },
        'General Awareness': { correct: 14, wrong: 4, total: 25 },
        'Quantitative Aptitude': { correct: 16, wrong: 3, total: 25 },
        'English Comprehension': { correct: 20, wrong: 2, total: 25 }
      },
      topicStats: {
        'Analogy': { correct: 1, total: 1 }, 'Series': { correct: 1, total: 2 },
        'Coding': { correct: 1, total: 2 }, 'Blood Relation': { correct: 1, total: 1 },
        'Direction': { correct: 1, total: 1 }, 'History': { correct: 4, total: 6 },
        'Polity': { correct: 4, total: 5 }, 'Geography': { correct: 3, total: 4 },
        'Arithmetic': { correct: 7, total: 9 }, 'Algebra': { correct: 2, total: 2 },
        'Geometry': { correct: 1, total: 2 }, 'Synonyms': { correct: 2, total: 2 },
        'Antonyms': { correct: 1, total: 2 }, 'Idioms': { correct: 2, total: 2 }
      }
    };
    App.paintResult(s);
  };

  App.paintResult = function (s) {
    document.getElementById('resultTitle').textContent = s.title;
    document.getElementById('finalScore').textContent = Math.round(s.score);
    document.getElementById('totalMarks').textContent = `/ ${s.max}`;
    document.getElementById('finalPercentile').textContent = `${s.percentile} %ile`;
    document.getElementById('kpiCorrect').textContent = s.correct;
    document.getElementById('kpiWrong').textContent = s.wrong;
    document.getElementById('kpiSkipped').textContent = s.skipped;
    const m = Math.floor(s.timeUsed / 60), sec = s.timeUsed % 60;
    document.getElementById('kpiTime').textContent = `${m}:${String(sec).padStart(2,'0')}`;
    document.getElementById('kpiRank').textContent = '#' + s.rank;
    document.getElementById('kpiAccuracy').textContent = s.accuracy + '%';
    const pct = (s.score / s.max) * 100;
    const circ = 2 * Math.PI * 52;
    const c = document.getElementById('scoreCircle');
    c.style.strokeDasharray = circ;
    c.style.strokeDashoffset = circ - (pct/100) * circ;

    const secBox = document.getElementById('sectionBreakdown');
    secBox.innerHTML = Object.entries(s.sectionStats).map(([name, st]) => {
      const acc = st.total ? Math.round((st.correct / st.total) * 100) : 0;
      const cls = acc >= 75 ? 'good' : acc >= 50 ? 'warn' : 'bad';
      return `<div class="bar-row ${cls}">
        <div class="row-top"><span>${name}</span><span>${st.correct}/${st.total} (${acc}%)</span></div>
        <div class="row-bar"><span style="width:${acc}%"></span></div>
      </div>`;
    }).join('');

    const topBox = document.getElementById('topicBreakdown');
    topBox.innerHTML = Object.entries(s.topicStats).slice(0, 10).map(([name, st]) => {
      const acc = st.total ? Math.round((st.correct / st.total) * 100) : 0;
      const cls = acc >= 75 ? 'good' : acc >= 50 ? 'warn' : 'bad';
      return `<div class="bar-row ${cls}">
        <div class="row-top"><span>${name}</span><span>${st.correct}/${st.total}</span></div>
        <div class="row-bar"><span style="width:${acc}%"></span></div>
      </div>`;
    }).join('');

    const compare = document.getElementById('topperCompare');
    compare.innerHTML = `
      <div class="row"><span class="name">Quant Aptitude</span><div class="vs-bar"><span style="width:78%"></span></div><span class="pct">78%</span></div>
      <div class="row"><span class="name">You — Quant</span><div class="vs-bar you"><span style="width:64%"></span></div><span class="pct">64%</span></div>
      <div class="row"><span class="name">Reasoning</span><div class="vs-bar"><span style="width:82%"></span></div><span class="pct">82%</span></div>
      <div class="row"><span class="name">You — Reasoning</span><div class="vs-bar you"><span style="width:72%"></span></div><span class="pct">72%</span></div>
      <div class="row"><span class="name">English</span><div class="vs-bar"><span style="width:88%"></span></div><span class="pct">88%</span></div>
      <div class="row"><span class="name">You — English</span><div class="vs-bar you"><span style="width:80%"></span></div><span class="pct">80%</span></div>
    `;

    const tips = document.getElementById('aiTips');
    const weak = Object.entries(s.topicStats).sort((a,b) => (a[1].correct/a[1].total) - (b[1].correct/b[1].total)).slice(0,3);
    tips.innerHTML = `
      <li><strong>Focus on ${weak[0]?.[0] || 'Quantitative Aptitude'}:</strong> Your accuracy is below the topper average.</li>
      <li><strong>Time management:</strong> Skip &amp; mark if stuck for >40 sec.</li>
      <li><strong>Strength to maintain:</strong> English is your strongest section — keep sectional tests every 2 days.</li>
      <li><strong>Negative marking alert:</strong> ${s.wrong} incorrect answers cost ${(s.wrong*0.5).toFixed(1)} marks.</li>
    `;
  };

  /* ============== BUY PAGE ============== */
  App.initBuy = function () {
    const seriesList = Store.get(SERIES_KEY, TEST_SERIES);
    const params = new URLSearchParams(location.search);
    let seriesId = params.get('series') || seriesList[0].id;
    let selected = seriesList.find(s => s.id === seriesId) || seriesList[0];
    let couponDiscount = 0;

    const paint = () => {
      document.getElementById('sumSeries').textContent = selected.name;
      document.getElementById('sumValidity').textContent = selected.validity;
      document.getElementById('sumTests').textContent = selected.tests + ' tests';
      document.getElementById('sumSubtotal').textContent = '₹' + selected.price;
      const discount = Math.round(selected.price * 0.10) + couponDiscount;
      document.getElementById('sumDiscount').textContent = '−₹' + discount;
      document.getElementById('sumTotal').textContent = '₹' + Math.max(0, selected.price - discount);
    };
    paint();

    // Payment method toggle
    document.querySelectorAll('.pay-method').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.pay-method').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        const m = el.dataset.method;
        document.getElementById('payUpi').style.display = m === 'upi' ? '' : 'none';
        document.getElementById('payNetBanking').style.display = m === 'netbanking' ? '' : 'none';
        document.getElementById('payCard').style.display = m === 'card' ? '' : 'none';
      });
    });

    // Coupon
    document.getElementById('applyCoupon').addEventListener('click', () => {
      const code = document.getElementById('couponInput').value.trim().toUpperCase();
      const map = { 'WELCOME50': 50, 'SSC2026': 100, 'MEGA': 200, 'FIRST': 75 };
      if (map[code]) {
        couponDiscount = map[code];
        alert('✅ Coupon applied! You saved an extra ₹' + couponDiscount);
        paint();
      } else if (code) {
        alert('❌ Invalid coupon code. Try WELCOME50, SSC2026, MEGA or FIRST.');
      }
    });

    // Pay
    document.getElementById('payBtn').addEventListener('click', () => {
      const name = document.getElementById('buyerName').value.trim();
      const email = document.getElementById('buyerEmail').value.trim();
      const phone = document.getElementById('buyerPhone').value.trim();
      if (!name || !email || !phone) { alert('Please fill in your name, email and phone.'); return; }
      const method = document.querySelector('.pay-method.active').dataset.method;
      const txnId = (method === 'upi' ? 'UPI/' : method === 'card' ? 'CARD/' : 'NB/') + Math.floor(100000 + Math.random() * 900000);
      const order = {
        id: 'ORD-' + Math.floor(2842 + Math.random() * 800),
        user: name, email, phone,
        series: selected.name, seriesId: selected.id,
        amount: Math.max(0, selected.price - Math.round(selected.price * 0.10) - couponDiscount),
        txnId, method: method.toUpperCase(),
        date: new Date().toLocaleString('en-IN'),
        status: 'pending'
      };
      const orders = Store.get(ORDERS_KEY, []);
      orders.unshift(order);
      Store.set(ORDERS_KEY, orders);

      // Show success
      document.getElementById('checkoutView').classList.add('hidden');
      document.getElementById('successView').classList.remove('hidden');
      document.getElementById('orderId').textContent = order.id;
      document.getElementById('okSeries').textContent = order.series;
      document.getElementById('okAmount').textContent = '₹' + order.amount;
      document.getElementById('okTxn').textContent = order.txnId;
      window.scrollTo(0, 0);
    });
  };

  /* ============== ADMIN ============== */
  App.initAdmin = function () {
    const authed = sessionStorage.getItem(ADMIN_KEY) === '1';
    const show = (which) => {
      document.getElementById('loginView').classList.toggle('hidden', which === 'admin');
      document.getElementById('adminView').classList.toggle('hidden', which !== 'admin');
    };

    document.getElementById('loginBtn').addEventListener('click', () => {
      const u = document.getElementById('adminUser').value.trim();
      const p = document.getElementById('adminPass').value;
      if (u === 'admin' && p === 'admin123') {
        sessionStorage.setItem(ADMIN_KEY, '1');
        show('admin');
        App.bootAdmin();
      } else {
        alert('Wrong credentials. Use admin / admin123');
      }
    });
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem(ADMIN_KEY);
      location.reload();
    });

    if (authed) { show('admin'); App.bootAdmin(); }
  };

  App.bootAdmin = function () {
    App.refreshAdminStats();
    App.renderDashPending();
    App.renderOrders('all');
    App.renderSeriesTable();
    App.renderTestsTable();
    App.renderUsersTable();

    // Sidebar nav
    document.querySelectorAll('.admin-side a[data-view]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.admin-side a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
        App.showPanel(a.dataset.view);
      });
    });
    document.querySelectorAll('[data-go]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        App.showPanel(b.dataset.go);
        document.querySelectorAll('.admin-side a').forEach(x => x.classList.remove('active'));
        document.querySelector(`.admin-side a[data-view="${b.dataset.go}"]`)?.classList.add('active');
      });
    });

    // Orders filter tabs
    document.querySelectorAll('[data-panel="orders"] .tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-panel="orders"] .tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        App.renderOrders(btn.dataset.filter);
      });
    });

    // Series form submit
    document.getElementById('seriesForm').addEventListener('submit', App.saveSeries);
    // Test form submit
    document.getElementById('testForm').addEventListener('submit', App.saveTest);
  };

  App.showPanel = function (name) {
    document.querySelectorAll('[data-panel]').forEach(p => p.classList.add('hidden'));
    document.querySelector(`[data-panel="${name}"]`)?.classList.remove('hidden');
    if (name === 'addSeries') {
      const editId = document.getElementById('seriesEditId').value;
      document.getElementById('seriesFormTitle').textContent = editId ? 'Edit test series' : 'Add a new test series';
      document.getElementById('seriesFormId').textContent = editId ? 'Editing: ' + editId : '';
    }
  };

  App.refreshAdminStats = function () {
    const orders = Store.get(ORDERS_KEY, []);
    const series = Store.get(SERIES_KEY, []);
    const pending = orders.filter(o => o.status === 'pending').length;
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statSeries').textContent = series.length;
  };

  App.renderDashPending = function () {
    const orders = Store.get(ORDERS_KEY, []).filter(o => o.status === 'pending').slice(0, 5);
    const tbl = document.getElementById('dashPending');
    tbl.innerHTML = `
      <thead><tr><th>Order ID</th><th>User</th><th>Series</th><th>Amount</th><th>Txn ID</th><th>Action</th></tr></thead>
      <tbody>${orders.length ? orders.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.user}<br><small class="muted">${o.phone}</small></td>
          <td>${o.series}</td>
          <td>₹${o.amount}</td>
          <td><code>${o.txnId}</code></td>
          <td class="row-actions">
            <button class="btn btn-primary" onclick="App.decideOrder('${o.id}','approved')">Approve</button>
            <button class="btn btn-outline" onclick="App.decideOrder('${o.id}','rejected')">Reject</button>
          </td>
        </tr>
      `).join('') : '<tr><td colspan="6" style="text-align:center;padding:20px">🎉 No pending payments!</td></tr>'}</tbody>
    `;
  };

  App.renderOrders = function (filter) {
    const orders = Store.get(ORDERS_KEY, []);
    const list = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    const tbl = document.getElementById('ordersTable');
    tbl.innerHTML = `
      <thead><tr><th>Order ID</th><th>User</th><th>Series</th><th>Method</th><th>Txn ID</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${list.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.user}<br><small class="muted">${o.email || ''} ${o.phone || ''}</small></td>
          <td>${o.series}</td>
          <td>${o.method}</td>
          <td><code>${o.txnId}</code></td>
          <td>₹${o.amount}</td>
          <td><small>${o.date}</small></td>
          <td><span class="badge badge-${o.status}">${o.status.toUpperCase()}</span></td>
          <td class="row-actions">
            ${o.status === 'pending' ? `
              <button class="btn btn-primary" onclick="App.decideOrder('${o.id}','approved')">Approve</button>
              <button class="btn btn-outline" onclick="App.decideOrder('${o.id}','rejected')">Reject</button>
            ` : `<span class="muted small">—</span>`}
          </td>
        </tr>
      `).join('')}</tbody>
    `;
  };

  App.decideOrder = function (orderId, decision) {
    const orders = Store.get(ORDERS_KEY, []);
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    o.status = decision;
    Store.set(ORDERS_KEY, orders);
    App.refreshAdminStats();
    App.renderDashPending();
    const active = document.querySelector('[data-panel="orders"] .tab.active');
    App.renderOrders(active ? active.dataset.filter : 'all');
    alert(`✅ Order ${orderId} ${decision}.`);
  };

  App.renderSeriesTable = function () {
    const series = Store.get(SERIES_KEY, []);
    const tbl = document.getElementById('seriesTable');
    tbl.innerHTML = `
      <thead><tr><th>Name</th><th>Price</th><th>Tests</th><th>Validity</th><th>Bestseller</th><th>Action</th></tr></thead>
      <tbody>${series.map(s => `
        <tr>
          <td><strong>${s.name}</strong><br><small class="muted">${s.tagline}</small></td>
          <td>₹${s.price} <small class="muted"><s>₹${s.originalPrice || ''}</s></small></td>
          <td>${s.tests}</td>
          <td>${s.validity}</td>
          <td>${s.bestseller ? '<span class="badge badge-published">YES</span>' : '<span class="badge badge-draft">—</span>'}</td>
          <td class="row-actions">
            <button class="btn btn-outline" onclick="App.editSeries('${s.id}')">Edit</button>
            <button class="btn btn-outline" onclick="App.deleteSeries('${s.id}')" style="color:var(--danger);border-color:var(--danger)">Delete</button>
          </td>
        </tr>
      `).join('')}</tbody>
    `;
  };

  App.editSeries = function (id) {
    const s = Store.get(SERIES_KEY, []).find(x => x.id === id);
    if (!s) return;
    document.getElementById('seriesEditId').value = id;
    document.getElementById('sf_name').value = s.name;
    document.getElementById('sf_tagline').value = s.tagline;
    document.getElementById('sf_price').value = s.price;
    document.getElementById('sf_original').value = s.originalPrice || '';
    document.getElementById('sf_tests').value = s.tests;
    document.getElementById('sf_validity').value = parseInt(s.validity);
    document.getElementById('sf_features').value = s.features.join('\n');
    document.getElementById('sf_banner').value = s.banner || '';
    document.getElementById('sf_bestseller').value = s.bestseller ? 'yes' : 'no';
    App.showPanel('addSeries');
  };

  App.deleteSeries = function (id) {
    if (!confirm('Delete this test series? Students with active access will keep it.')) return;
    const list = Store.get(SERIES_KEY, []).filter(s => s.id !== id);
    Store.set(SERIES_KEY, list);
    App.renderSeriesTable();
    App.refreshAdminStats();
  };

  App.saveSeries = function (e) {
    e.preventDefault();
    const list = Store.get(SERIES_KEY, []);
    const editId = document.getElementById('seriesEditId').value;
    const obj = {
      id: editId || 'series-' + Date.now(),
      name: document.getElementById('sf_name').value.trim(),
      tagline: document.getElementById('sf_tagline').value.trim(),
      price: +document.getElementById('sf_price').value,
      originalPrice: +document.getElementById('sf_original').value || 0,
      tests: +document.getElementById('sf_tests').value || 50,
      validity: document.getElementById('sf_validity').value + ' months',
      features: document.getElementById('sf_features').value.split('\n').map(x => x.trim()).filter(Boolean),
      banner: document.getElementById('sf_banner').value,
      bestseller: document.getElementById('sf_bestseller').value === 'yes',
      students: 0, rating: 4.5
    };
    if (editId) {
      const i = list.findIndex(s => s.id === editId);
      if (i > -1) list[i] = { ...list[i], ...obj };
    } else {
      list.push(obj);
    }
    Store.set(SERIES_KEY, list);
    alert('✅ Series saved! ' + (editId ? 'Changes live.' : 'New bundle is now on the Series page.'));
    document.getElementById('seriesForm').reset();
    document.getElementById('seriesEditId').value = '';
    App.renderSeriesTable();
    App.refreshAdminStats();
    App.showPanel('series');
  };

  App.renderTestsTable = function () {
    const drafts = Store.get(DRAFTS_KEY, []);
    const live = TEST_CATALOG;
    const tbl = document.getElementById('testsTable');
    const rows = [
      ...live.map(t => ({ ...t, status: 'published' })),
      ...drafts.map(d => ({ ...d, type: 'draft' }))
    ];
    tbl.innerHTML = `
      <thead><tr><th>Title</th><th>Exam</th><th>Qs</th><th>Duration</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${rows.map(t => `
        <tr>
          <td><strong>${t.title}</strong></td>
          <td>${t.exam}</td>
          <td>${t.qs}</td>
          <td>${t.duration}</td>
          <td>${t.type === 'pro' ? '<span class="badge badge-published">PRO</span>' : t.type === 'free' ? '<span class="badge badge-approved">FREE</span>' : t.type === 'pyq' ? '<span class="badge badge-pending">PYQ</span>' : '<span class="badge badge-draft">DRAFT</span>'}</td>
          <td><span class="badge badge-${t.status}">${t.status.toUpperCase()}</span></td>
          <td class="row-actions">
            <button class="btn btn-outline" onclick="alert('Edit test: ${t.id}')">Edit</button>
            ${t.status === 'draft' ? `<button class="btn btn-primary" onclick="App.publishTest('${t.id}')">Publish</button>` : ''}
          </td>
        </tr>
      `).join('')}</tbody>
    `;
  };

  App.publishTest = function (id) {
    const drafts = Store.get(DRAFTS_KEY, []);
    const d = drafts.find(x => x.id === id);
    if (!d) return;
    d.status = 'published';
    Store.set(DRAFTS_KEY, drafts);
    App.renderTestsTable();
    alert('✅ Test published. It is now live on the website.');
  };

  App.saveTest = function (e) {
    e.preventDefault();
    const drafts = Store.get(DRAFTS_KEY, []);
    const draft = {
      id: 'DRF-' + Math.floor(200 + Math.random() * 800),
      title: document.getElementById('tf_title').value.trim(),
      exam: document.getElementById('tf_exam').value,
      questions: +document.getElementById('tf_qs').value,
      duration: +document.getElementById('tf_duration').value,
      type: document.getElementById('tf_type').value,
      status: document.getElementById('tf_status').value
    };
    drafts.push(draft);
    Store.set(DRAFTS_KEY, drafts);
    alert('✅ Test saved as ' + draft.status.toUpperCase() + '. ' + (draft.status === 'published' ? 'It is now live.' : 'You can publish it from the Tests page.'));
    document.getElementById('testForm').reset();
    App.renderTestsTable();
    App.showPanel('tests');
  };

  App.renderUsersTable = function () {
    const orders = Store.get(ORDERS_KEY, []);
    const map = {};
    orders.filter(o => o.status === 'approved').forEach(o => {
      if (!map[o.user]) map[o.user] = { email: o.email, phone: o.phone, joined: o.date, orders: 0, spent: 0, series: [] };
      map[o.user].orders++;
      map[o.user].spent += o.amount;
      map[o.user].series.push(o.series);
    });
    const users = Object.entries(map).map(([name, u]) => ({ name, ...u }));
    const tbl = document.getElementById('usersTable');
    tbl.innerHTML = `
      <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Spent</th><th>Series</th></tr></thead>
      <tbody>${users.length ? users.map(u => `
        <tr>
          <td><strong>${u.name}</strong></td>
          <td>${u.email || '—'}</td>
          <td>${u.phone || '—'}</td>
          <td>${u.orders}</td>
          <td>₹${u.spent}</td>
          <td><small>${u.series.join(', ')}</small></td>
        </tr>
      `).join('') : '<tr><td colspan="6" style="text-align:center;padding:20px">No users yet.</td></tr>'}</tbody>
    `;
  };

  /* ============== HAMBURGER ============== */
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hamburger')?.addEventListener('click', () => {
      const nav = document.querySelector('.main-nav');
      const act = document.querySelector('.topbar-actions');
      const open = nav.style.display === 'flex';
      nav.style.display = open ? '' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '68px'; nav.style.left = '0'; nav.style.right = '0';
      nav.style.background = '#fff';
      nav.style.padding = '12px 20px';
      nav.style.borderBottom = '1px solid var(--border)';
      if (act) act.style.display = open ? '' : 'flex';
    });
    if (document.getElementById('featuredGrid')) App.renderFeatured();
    if (document.getElementById('seriesGrid') && location.pathname.endsWith('index.html')) App.renderSeries('seriesGrid');
  });

})();
