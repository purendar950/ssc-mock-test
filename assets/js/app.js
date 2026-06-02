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

  /* ============== TEST PAGE: take test ============== */
  let state = null;

  App.initTest = function () {
    const bank = QUESTIONS_BANK.cgl17;
    state = {
      test: bank,
      current: 0,
      answers: new Array(bank.questions.length).fill(null),
      visited: new Array(bank.questions.length).fill(false),
      marked: new Array(bank.questions.length).fill(false),
      timeLeft: bank.duration * 60,
      timerId: null
    };
    state.visited[0] = true;

    const modal = document.getElementById('instructionsModal');
    const agree = document.getElementById('agreeChk');
    const start = document.getElementById('startTestBtn');
    const close = document.getElementById('closeInstr');
    agree.addEventListener('change', () => start.disabled = !agree.checked);
    close.addEventListener('click', () => modal.style.display = 'none');
    start.addEventListener('click', () => {
      modal.style.display = 'none';
      App.startTimer();
      App.renderQuestion();
    });

    document.getElementById('prevBtn').addEventListener('click', () => App.navigate(-1));
    document.getElementById('nextBtn').addEventListener('click', () => App.navigate(1));
    document.getElementById('clearResponseBtn').addEventListener('click', App.clearResponse);
    document.getElementById('markReviewBtn').addEventListener('click', App.markReview);
    document.getElementById('submitBtn').addEventListener('click', App.openSubmit);

    document.getElementById('cancelSubmit').addEventListener('click', () => {
      document.getElementById('submitModal').classList.add('hidden');
    });
    document.getElementById('confirmSubmit').addEventListener('click', App.submitTest);

    document.querySelectorAll('.section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = +btn.dataset.section;
        const startIdx = bank.sections[sec].questions[0] - 1;
        state.current = startIdx;
        App.renderQuestion();
      });
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Mobile palette FAB
    const fab = document.getElementById('paletteFab');
    const pmodal = document.getElementById('paletteModal');
    const pclose = document.getElementById('paletteCloseBtn');
    const pcloseTop = document.getElementById('paletteCloseBtnTop');
    const psubmit = document.getElementById('pmSubmit');

    fab?.addEventListener('click', () => {
      App.renderPalette();
      pmodal.classList.add('show');
    });
    const closeModal = () => pmodal.classList.remove('show');
    pclose?.addEventListener('click', closeModal);
    pcloseTop?.addEventListener('click', closeModal);
    pmodal?.addEventListener('click', (e) => { if (e.target === pmodal) closeModal(); });
    psubmit?.addEventListener('click', () => { closeModal(); App.openSubmit(); });

    // Section jump pills inside mobile palette
    document.querySelectorAll('.pm-jump').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pm-jump').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const j = btn.dataset.jump;
        const body = document.querySelector('.pm-body');
        if (!body) return;
        body.scrollTo({ top: 0, behavior: 'smooth' });
        if (j !== 'all') {
          const secIdx = +j;
          const startIdx = bank.sections[secIdx].questions[0] - 1;
          state.current = startIdx;
          state.visited[startIdx] = true;
          App.renderQuestion();
          closeModal();
        }
      });
    });

    App.renderPalette();
    App.updateHeader();
  };

  App.startTimer = function () {
    const t = document.getElementById('timer');
    const update = () => {
      const m = Math.floor(state.timeLeft / 60);
      const s = state.timeLeft % 60;
      t.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (state.timeLeft <= 60) t.classList.add('warning');
      if (state.timeLeft <= 0) { clearInterval(state.timerId); App.submitTest(); return; }
      state.timeLeft--;
    };
    update();
    state.timerId = setInterval(update, 1000);
  };

  App.renderQuestion = function () {
    const q = state.test.questions[state.current];
    document.getElementById('qNum').textContent = `Question ${state.current + 1} of ${state.test.questions.length}`;
    document.getElementById('qText').textContent = q.text;
    const opts = document.getElementById('qOptions');
    opts.innerHTML = q.opts.map((o, i) => `
      <div class="option ${state.answers[state.current] === i ? 'selected' : ''}" data-i="${i}">
        <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
        <span>${o}</span>
      </div>
    `).join('');
    opts.querySelectorAll('.option').forEach(el => {
      el.addEventListener('click', () => {
        state.answers[state.current] = +el.dataset.i;
        App.renderQuestion();
        App.renderPalette();
        App.updateHeader();
      });
    });

    const sec = state.test.sections.find(s => state.current + 1 >= s.questions[0] && state.current + 1 <= s.questions[1]);
    document.getElementById('sectionPill').textContent = `Section ${state.test.sections.indexOf(sec) + 1} · ${sec.name}`;
    document.querySelectorAll('.section-btn').forEach(b => b.classList.remove('active'));
    const secIdx = state.test.sections.indexOf(sec);
    document.querySelector(`.section-btn[data-section="${secIdx}"]`)?.classList.add('active');

    App.renderPalette();
  };

  App.navigate = function (delta) {
    const next = state.current + delta;
    if (next < 0 || next >= state.test.questions.length) return;
    state.visited[next] = true;
    state.current = next;
    App.renderQuestion();
  };

  App.clearResponse = function () {
    state.answers[state.current] = null;
    App.renderQuestion();
    App.renderPalette();
    App.updateHeader();
  };

  App.markReview = function () {
    state.marked[state.current] = !state.marked[state.current];
    App.navigate(1);
  };

  App.renderPalette = function () {
    const buildGrid = (targetId) => {
      const grid = document.getElementById(targetId);
      if (!grid) return;
      grid.innerHTML = state.test.questions.map((q, i) => {
        const isAns = state.answers[i] !== null;
        let cls = 'p-btn';
        if (i === state.current) cls += ' current';
        if (isAns) cls += ' answered';
        if (state.marked[i]) cls += isAns ? ' ans-marked' : ' marked';
        return `<button class="${cls}" data-i="${i}">${i + 1}</button>`;
      }).join('');
      grid.querySelectorAll('.p-btn').forEach(b => {
        b.addEventListener('click', () => {
          state.visited[+b.dataset.i] = true;
          state.current = +b.dataset.i;
          App.renderQuestion();
          document.getElementById('paletteModal')?.classList.remove('show');
        });
      });
    };
    buildGrid('paletteGrid');
    buildGrid('paletteGridMobile');

    const answered = state.answers.filter(a => a !== null).length;
    const marked = state.marked.filter(Boolean).length;
    const visited = state.visited.filter(Boolean).length;
    const total = state.test.questions.length;
    const left = total - answered;
    document.getElementById('cntAnswered').textContent = answered;
    document.getElementById('cntMarked').textContent = marked;
    document.getElementById('cntNot').textContent = total - visited;
    document.getElementById('totalAttempted').textContent = answered;
    document.getElementById('totalUnattempted').textContent = left;
    // Mobile palette mini-stats
    const pmA = document.getElementById('pmAns'); if (pmA) pmA.textContent = answered;
    const pmM = document.getElementById('pmMark'); if (pmM) pmM.textContent = marked;
    const pmL = document.getElementById('pmLeft'); if (pmL) pmL.textContent = left;
  };

  App.updateHeader = function () {
    const answered = state.answers.filter(a => a !== null).length;
    const pct = (answered / state.test.questions.length) * 100;
    document.getElementById('progressBar').style.width = pct + '%';
  };

  App.openSubmit = function () {
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
    document.getElementById('submitModal').classList.remove('hidden');
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
