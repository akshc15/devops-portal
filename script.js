/* ============================================
   MY DEVOPS PORTAL — Shared JavaScript
   ============================================ */

// ── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  initStepCards();
  initQA();
  initTabs();
  initTerminalCopy();
  initProgress();
  initReveal();
  initDayDots();
  initChecklist();
  highlightActiveNav();
});

// ── ACTIVE NAV ────────────────────────────
function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.banner-nav a, .page-nav-links a').forEach(a => {
    if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('../',''))) {
      a.classList.add('active');
    }
  });
}

// ── BANNER SCROLL ─────────────────────────
function initBanner() {
  const banner = document.querySelector('.site-banner');
  if (!banner) return;
  window.addEventListener('scroll', () => {
    banner.style.background = window.scrollY > 10
      ? 'rgba(13,13,13,0.95)'
      : 'rgba(13,13,13,0.85)';
  }, { passive: true });
}

// ── STEP CARDS (accordion) ────────────────
function initStepCards() {
  document.querySelectorAll('.step-head').forEach(head => {
    head.addEventListener('click', () => {
      const card = head.closest('.step-card');
      const isOpen = card.classList.contains('open');
      // close all in same parent
      const parent = card.parentElement;
      parent.querySelectorAll('.step-card.open').forEach(c => {
        if (c !== card) c.classList.remove('open');
      });
      card.classList.toggle('open', !isOpen);
    });
  });
  // open first by default
  const first = document.querySelector('.step-card');
  if (first) first.classList.add('open');
}

// ── Q&A ACCORDION ─────────────────────────
function initQA() {
  document.querySelectorAll('.qa-q').forEach(q => {
    q.addEventListener('click', () => {
      const card = q.closest('.qa-card');
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.qa-card.open').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
  });
}

// ── TABS ──────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const container = tabGroup.closest('.tab-container') || tabGroup.parentElement;
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        container.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.dataset.panel === target);
        });
      });
    });
    // activate first
    const firstBtn = tabGroup.querySelector('.tab-btn');
    if (firstBtn && !tabGroup.querySelector('.tab-btn.active')) {
      firstBtn.click();
    }
  });
}

// ── TERMINAL COPY ─────────────────────────
function initTerminalCopy() {
  document.querySelectorAll('.terminal-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const terminal = btn.closest('.terminal');
      const body = terminal.querySelector('.terminal-body');
      // extract text, skip prompt symbols
      const lines = body.querySelectorAll('.t-line');
      let text = '';
      lines.forEach(line => {
        const cmd = line.querySelector('.t-cmd');
        if (cmd) {
          text += cmd.innerText + '\n';
        }
      });
      if (!text.trim()) {
        text = body.innerText;
      }
      navigator.clipboard.writeText(text.trim()).then(() => {
        btn.textContent = 'Copied ✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

// ── PROGRESS TRACKER ─────────────────────
const PROGRESS_KEY = 'devops_portal_progress_v2';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(data) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); }
  catch {}
}

function initProgress() {
  updateProgressUI();
}

function updateProgressUI() {
  const data = loadProgress();
  const done = Object.values(data).filter(Boolean).length;
  const total = 30;
  const pct = Math.round((done / total) * 100);

  const fill = document.getElementById('prog-fill');
  const text = document.getElementById('prog-text');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `${done} / ${total} days`;

  document.querySelectorAll('.day-row[data-day]').forEach(row => {
    const day = parseInt(row.dataset.day);
    row.classList.toggle('done', !!data[day]);
  });

  document.querySelectorAll('.day-dot[data-day]').forEach(dot => {
    const day = parseInt(dot.dataset.day);
    const isDone = !!data[day];
    dot.classList.toggle('done', isDone);
    dot.textContent = isDone ? '✓' : day;
  });
}

function toggleDay(day) {
  const data = loadProgress();
  data[day] = !data[day];
  saveProgress(data);
  updateProgressUI();
}

// ── DAY DOTS ──────────────────────────────
function initDayDots() {
  const container = document.getElementById('day-dots');
  if (!container) return;
  for (let i = 1; i <= 30; i++) {
    const dot = document.createElement('div');
    dot.className = 'day-dot';
    dot.dataset.day = i;
    dot.textContent = i;
    dot.addEventListener('click', () => toggleDay(i));
    container.appendChild(dot);
  }
  updateProgressUI();
}

// ── CHECK BUTTONS ─────────────────────────
window.toggleDayCheck = function(day) {
  toggleDay(day);
};

// ── CHECKLIST ─────────────────────────────
function initChecklist() {
  document.querySelectorAll('.cl-item input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('.cl-item').classList.toggle('checked', cb.checked);
      updateChecklistProgress();
    });
  });
}

function updateChecklistProgress() {
  const total = document.querySelectorAll('.cl-item').length;
  const done  = document.querySelectorAll('.cl-item.checked').length;
  const bar   = document.getElementById('cl-bar');
  const count = document.getElementById('cl-count');
  if (bar)   bar.style.width = Math.round(done / total * 100) + '%';
  if (count) count.textContent = `${done} / ${total}`;
}

// ── SCROLL REVEAL ─────────────────────────
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── SMOOTH ANCHOR SCROLL ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 100; // account for sticky navs
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── COPY RESUME ───────────────────────────
window.copyResume = function() {
  const el = document.getElementById('resume-text');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = document.querySelector('.copy-resume-btn');
    if (btn) {
      btn.textContent = 'Copied ✓';
      setTimeout(() => btn.textContent = 'Copy Resume Text', 2000);
    }
  });
};

// ── TYPING EFFECT (hero terminals) ────────
function typeText(el, text, speed = 40) {
  let i = 0;
  el.textContent = '';
  const interval = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

window.initTyping = function() {
  document.querySelectorAll('[data-type]').forEach(el => {
    typeText(el, el.dataset.type, parseInt(el.dataset.speed) || 40);
  });
};

// ── WEEK BLOCK TOGGLE ─────────────────────
document.addEventListener('click', e => {
  const header = e.target.closest('.week-header');
  if (!header) return;
  const block = header.closest('.week-block');
  block.classList.toggle('open');
});