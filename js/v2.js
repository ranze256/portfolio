/* =========================================================
   RANZE PORTFOLIO v2
   - content/profile.json / content/works.json は現行のまま利用
     （admin/panel.html との互換を維持）
   ========================================================= */

'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- category ---------- */
const CATS = {
  world:         { en: 'WORLD',   jp: 'ワールド' },
  event:         { en: 'EVENT',   jp: 'イベント' },
  privatework:   { en: 'PRIVATE', jp: '自主制作' },
  graphicdesign: { en: 'GRAPHIC', jp: 'グラフィック' },
  other:         { en: 'OTHER',   jp: 'その他' },
};

/* ---------- thin-line icons ---------- */
const P = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
const ICONS = {
  twitter: P('<path d="M4 4l16 16M20 4L4 20"/>'),
  booth:   P('<path d="M3 8h18v12H3zM3 8l2-4h14l2 4M9 12h6"/>'),
  youtube: P('<rect x="2.5" y="5.5" width="19" height="13"/><path d="M10 9.5l5 2.5-5 2.5z"/>'),
  discord: P('<path d="M8 6.5C5.5 7 4 9 3.5 12S4 17 5.5 18l1-1.6M16 6.5c2.5.5 4 2.5 4.5 5.5s-.5 5-2 6l-1-1.6"/><circle cx="9.3" cy="13" r="1.2"/><circle cx="14.7" cy="13" r="1.2"/>'),
  github:  P('<path d="M9 20c-4 1.2-4-2.2-5.5-2.8M15 21v-3.3c0-1 .2-1.6-.4-2.2 2.5-.3 4.9-1.3 4.9-5.4a4.2 4.2 0 0 0-1.1-2.9 3.9 3.9 0 0 0-.1-2.9s-.9-.3-3 1.1a10.4 10.4 0 0 0-5.4 0C7.8 4 6.9 4.3 6.9 4.3a3.9 3.9 0 0 0-.1 2.9 4.2 4.2 0 0 0-1.1 2.9c0 4.1 2.4 5.1 4.9 5.4-.4.4-.5.9-.5 1.5V21"/>'),
  vrchat:  P('<rect x="2" y="7" width="20" height="10" rx="3"/><path d="M7 11l1.6 3 1.6-3M13.8 11l1.6 3 1.6-3"/>'),
  link:    P('<path d="M10 13a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1.5 1.5"/><path d="M14 11a4 4 0 0 0-5.6 0l-3 3A4 4 0 0 0 11 19.6l1.5-1.5"/>'),
};
const LABELS = { twitter:'X', booth:'BOOTH', youtube:'YOUTUBE', discord:'DISCORD', github:'GITHUB', vrchat:'VRCHAT' };

/* 実績サマリ用アイコン（profile.json の絵文字は変えずに、表示だけ細線アイコンへ置換） */
const STAT_ICONS = {
  globe:   P('<circle cx="12" cy="12" r="8.6"/><ellipse cx="12" cy="12" rx="3.9" ry="8.6"/><path d="M3.6 9.2h16.8M3.6 14.8h16.8"/>'),
  case:    P('<rect x="2.6" y="7.2" width="18.8" height="12.6"/><path d="M8.6 7.2V4.6h6.8v2.6M2.6 12.4h18.8"/>'),
  nib:     P('<path d="M12 2.6l3.4 8.2L12 21.4 8.6 10.8z"/><circle cx="12" cy="10.6" r="1.5"/>'),
  film:    P('<rect x="2.6" y="8.8" width="18.8" height="11.4"/><path d="M2.6 8.8l2.4-5h14.2l-2.4 5M8.4 4.2L6 8.8M13.8 3.9l-2.4 4.9"/>'),
  frame:   P('<rect x="2.6" y="4.6" width="18.8" height="14.8"/><path d="M2.6 15.4l5-4.4 4.4 3.9 3.5-3 5.9 5.4"/><circle cx="8.4" cy="9" r="1.4"/>'),
  sparkle: P('<path d="M12 2.6v6M12 15.4v6M2.6 12h6M15.4 12h6M5.7 5.7l4.2 4.2M14.1 14.1l4.2 4.2M18.3 5.7l-4.2 4.2M9.9 14.1l-4.2 4.2"/>'),
  node:    P('<path d="M12 3.4l8 4.8v7.6l-8 4.8-8-4.8V8.2z"/><circle cx="12" cy="12" r="2.2"/>'),
};
const EMOJI_MAP = {
  '🌍':'globe','🌏':'globe','🌎':'globe','💼':'case','🎨':'nib','🖌':'nib','✏':'nib',
  '🎬':'film','🎥':'film','📹':'film','🖼':'frame','🖼️':'frame','🎇':'sparkle','🎉':'sparkle','✨':'sparkle','⭐':'sparkle',
};
const LABEL_MAP = [
  [/ワールド|world/i, 'globe'],
  [/案件|実績|受注|仕事/,  'case'],
  [/ロゴ|logo|デザイン画/, 'nib'],
  [/mv|動画|映像|pv/i,     'film'],
  [/グラフィック|graphic|画像|バナー/i, 'frame'],
  [/イベント|event|運営/i, 'sparkle'],
];
function statIcon(emoji, label) {
  const key = String(emoji || '').replace(/️/g, '');
  if (EMOJI_MAP[key]) return STAT_ICONS[EMOJI_MAP[key]];
  for (const [re, k] of LABEL_MAP) if (re.test(label || '')) return STAT_ICONS[k];
  return STAT_ICONS.node;
}
const icon  = (k) => ICONS[k] || ICONS.link;
const label = (k) => LABELS[k] || String(k).toUpperCase();

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const host = (u) => { try { return new URL(u).hostname.replace('www.',''); } catch { return u; } };

/* =========================================================
   FX  —  3D POINT CLOUD + ACTIVE SONAR
   ========================================================= */
class FieldFX {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.pts = [];
    this.edges = [];
    this.sweep = 0;
    this.prevSweep = 0;
    this.rings = [];
    this.ringT = 0;
    this.rotY = 0;
    this.rotX = -0.16;
    this.mx = 0; this.my = 0;
    this.tmx = 0; this.tmy = 0;
    this.running = false;
    this.last = 0;

    this.resize();
    this.build();

    window.addEventListener('resize', () => { this.resize(); this.build(); }, { passive: true });
    window.addEventListener('mousemove', (e) => {
      this.tmx = (e.clientX / window.innerWidth  - 0.5) * 2;
      this.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      document.hidden ? this.stop() : this.start();
    });
    new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? this.start() : this.stop()));
    }, { threshold: 0.02 }).observe(canvas);
  }

  resize() {
    const r = this.c.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.c.width  = Math.round(this.w * this.dpr);
    this.c.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    // 広い画面では右寄せの「レーダーコンソール」配置にして、左のテキストと干渉させない
    const wide = this.w > 1080;
    this.cx = this.w * (wide ? 0.68 : 0.5);
    this.cy = this.h * (wide ? 0.5 : 0.34);
    this.R  = wide ? Math.min(this.w * 0.38, this.h * 0.46)
                   : Math.min(this.w * 0.52, this.h * 0.30);
  }

  /* --- generate a 3D shell + scatter, then pre-compute constellation edges --- */
  build() {
    const n = Math.round(Math.min(200, Math.max(96, this.w / 7.6)));
    const pts = [];
    for (let i = 0; i < n; i++) {
      // fibonacci sphere for even shell coverage, jittered inward
      const k = i + 0.5;
      const phi = Math.acos(1 - 2 * k / n);
      const th  = Math.PI * (1 + Math.sqrt(5)) * k;
      const rr  = 0.62 + Math.random() * 0.38;
      pts.push({
        x: Math.cos(th) * Math.sin(phi) * rr,
        y: Math.cos(phi) * rr * 0.72,
        z: Math.sin(th) * Math.sin(phi) * rr,
        ping: 0,
        mark: Math.random() < 0.3,   // ロックオン枠を出す観測点だけ間引く
      });
    }
    // edges: nearest neighbours in model space (computed once = cheap per frame)
    const edges = [];
    const LIM = 0.30;
    for (let i = 0; i < pts.length; i++) {
      let found = 0;
      for (let j = i + 1; j < pts.length && found < 1; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dz = pts[i].z - pts[j].z;
        if (dx * dx + dy * dy + dz * dz < LIM * LIM) { edges.push([i, j]); found++; }
      }
    }
    this.pts = pts;
    this.edges = edges;
    const cnt = $('#fx-count');
    if (cnt) cnt.textContent = String(pts.length).padStart(4, '0') + ' PTS';
  }

  start() { if (this.running) return; this.running = true; this.last = performance.now(); this.loop(this.last); }
  stop()  { this.running = false; if (this._raf) cancelAnimationFrame(this._raf); }

  loop(t) {
    if (!this.running) return;
    const dt = Math.min(64, t - this.last) / 16.666;
    this.last = t;
    this.step(dt);
    this.draw();
    this._raf = requestAnimationFrame((tt) => this.loop(tt));
  }

  step(dt) {
    this.mx += (this.tmx - this.mx) * 0.045 * dt;
    this.my += (this.tmy - this.my) * 0.045 * dt;
    this.rotY += 0.0016 * dt;
    this.rotX = -0.16 + Math.sin(this.rotY * 0.7) * 0.06;

    this.prevSweep = this.sweep;
    this.sweep = (this.sweep + 0.0135 * dt) % (Math.PI * 2);

    this.ringT += dt;
    if (this.ringT > 165) { this.ringT = 0; this.rings.push({ r: 0 }); }
    this.rings.forEach((r) => (r.r += 1.9 * dt));
    this.rings = this.rings.filter((r) => r.r < this.R * 1.55);

    for (const p of this.pts) if (p.ping > 0) p.ping -= 0.021 * dt;
  }

  project(p) {
    const cy = Math.cos(this.rotY), sy = Math.sin(this.rotY);
    const cx = Math.cos(this.rotX), sx = Math.sin(this.rotX);
    let x = p.x * cy - p.z * sy;
    let z = p.x * sy + p.z * cy;
    let y = p.y * cx - z * sx;
    z = p.y * sx + z * cx;
    const f = 2.15 / (2.15 + z);
    return {
      sx: this.cx + (x * this.R + this.mx * 26) * f,
      sy: this.cy + (y * this.R + this.my * 18) * f,
      d: f,
    };
  }

  draw() {
    const g = this.ctx;
    g.clearRect(0, 0, this.w, this.h);

    const S = this.pts.map((p) => this.project(p));

    /* --- sonar rings --- */
    g.lineWidth = 1;
    for (const ring of this.rings) {
      const a = Math.max(0, 1 - ring.r / (this.R * 1.55));
      g.strokeStyle = `rgba(229,20,42,${(a * 0.20).toFixed(3)})`;
      g.beginPath(); g.arc(this.cx, this.cy, ring.r, 0, Math.PI * 2); g.stroke();
    }
    /* fixed range rings */
    g.strokeStyle = 'rgba(255,255,255,.045)';
    [0.42, 0.72, 1.0].forEach((k) => {
      g.beginPath(); g.arc(this.cx, this.cy, this.R * k, 0, Math.PI * 2); g.stroke();
    });
    /* cross-hair */
    g.strokeStyle = 'rgba(255,255,255,.05)';
    g.beginPath();
    g.moveTo(this.cx - this.R, this.cy); g.lineTo(this.cx + this.R, this.cy);
    g.moveTo(this.cx, this.cy - this.R); g.lineTo(this.cx, this.cy + this.R);
    g.stroke();

    /* --- sweep wedge --- */
    if (!REDUCED) {
      const wedge = 0.55;
      const grad = g.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.R * 1.12);
      grad.addColorStop(0,   'rgba(229,20,42,.10)');
      grad.addColorStop(0.7, 'rgba(229,20,42,.032)');
      grad.addColorStop(1,   'rgba(229,20,42,0)');
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(this.cx, this.cy);
      g.arc(this.cx, this.cy, this.R * 1.12, this.sweep - wedge, this.sweep);
      g.closePath(); g.fill();

      g.strokeStyle = 'rgba(229,20,42,.40)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(this.cx, this.cy);
      g.lineTo(this.cx + Math.cos(this.sweep) * this.R * 1.12, this.cy + Math.sin(this.sweep) * this.R * 1.12);
      g.stroke();
    }

    /* --- constellation edges --- */
    g.lineWidth = 1;
    for (const [i, j] of this.edges) {
      const a = S[i], b = S[j];
      const dd = (a.d + b.d) * 0.5;
      g.strokeStyle = `rgba(255,255,255,${(0.036 * dd).toFixed(3)})`;
      g.beginPath(); g.moveTo(a.sx, a.sy); g.lineTo(b.sx, b.sy); g.stroke();
    }

    /* --- points + sonar detection --- */
    for (let i = 0; i < this.pts.length; i++) {
      const p = this.pts[i], s = S[i];
      if (!REDUCED) {
        let ang = Math.atan2(s.sy - this.cy, s.sx - this.cx);
        if (ang < 0) ang += Math.PI * 2;
        const a0 = this.prevSweep, a1 = this.sweep;
        const crossed = a1 >= a0 ? (ang > a0 && ang <= a1) : (ang > a0 || ang <= a1);
        if (crossed) p.ping = 1;
      }
      const size = 0.7 + s.d * 1.05;
      if (p.ping > 0) {
        const a = p.ping;
        g.fillStyle = `rgba(255,64,84,${(0.28 + a * 0.55).toFixed(3)})`;
        g.beginPath(); g.arc(s.sx, s.sy, size + a * 1.2, 0, Math.PI * 2); g.fill();
        if (p.mark && a > 0.6 && s.d > 1.0) {
          g.strokeStyle = `rgba(229,20,42,${((a - 0.6) * 1.5).toFixed(3)})`;
          const r = 4 + (1 - a) * 14;
          g.strokeRect(s.sx - r, s.sy - r, r * 2, r * 2);
        }
      } else {
        g.fillStyle = `rgba(233,234,237,${(0.13 + s.d * 0.42).toFixed(3)})`;
        g.beginPath(); g.arc(s.sx, s.sy, size, 0, Math.PI * 2); g.fill();
      }
    }
  }
}

/* =========================================================
   BOOT SEQUENCE
   ========================================================= */
function runBoot() {
  const boot = $('#boot'), log = $('#boot-log'), bar = $('#boot-bar-fill');
  const finish = () => { boot.classList.add('done'); document.body.style.overflow = ''; };
  if (!boot) return Promise.resolve();

  if (REDUCED || sessionStorage.getItem('rz_booted')) { finish(); return Promise.resolve(); }
  sessionStorage.setItem('rz_booted', '1');
  document.body.style.overflow = 'hidden';
  boot.addEventListener('click', finish);

  const lines = [
    '> SYSTEM BOOT ............... <b class="ok">OK</b>',
    '> LOAD content/profile.json .. <b class="ok">OK</b>',
    '> LOAD content/works.json .... <b class="ok">OK</b>',
    '> POINT CLOUD ............... <b class="ok">BUILT</b>',
    '> ACTIVE SONAR .............. <b class="ok">ONLINE</b>',
    '> RENDER: FULL',
  ];

  return new Promise((res) => {
    let i = 0;
    const tick = () => {
      log.innerHTML = lines.slice(0, i + 1).join('\n');
      bar.style.right = `${100 - ((i + 1) / lines.length) * 100}%`;
      i++;
      if (i < lines.length) setTimeout(tick, 115);
      else setTimeout(() => { finish(); res(); }, 320);
    };
    tick();
  });
}

/* =========================================================
   HUD
   ========================================================= */
function initHud() {
  const hud = $('#hud'), burger = $('#hud-burger'), drawer = $('#drawer');

  const onScroll = () => hud.classList.toggle('stuck', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
  });
  $$('#drawer a').forEach((a) => a.addEventListener('click', () => {
    burger.classList.remove('open'); drawer.classList.remove('open');
  }));

  const clock = $('#hud-clock');
  const tick = () => {
    const d = new Date(Date.now() + (9 * 60 + new Date().getTimezoneOffset()) * 60000);
    clock.textContent = `JST ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  tick(); setInterval(tick, 1000);
}

/* =========================================================
   REVEAL
   ========================================================= */
const revealIO = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    revealIO.unobserve(e.target);
    if (e.target.dataset.count) countUp(e.target);
    if (e.target.dataset.bar)   e.target.style.right = `${100 - Number(e.target.dataset.bar)}%`;
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

function observeAll() {
  $$('.reveal:not(.in), .card:not(.in), .stat:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 8) * 45}ms`;
    revealIO.observe(el);
  });
  $$('.sk-bar i').forEach((el) => revealIO.observe(el));
}

function countUp(el) {
  const target = Number(el.dataset.count) || 0;
  if (REDUCED || target === 0) { el.textContent = target; return; }
  const dur = 900, t0 = performance.now();
  const run = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

/* =========================================================
   HERO
   ========================================================= */
function renderHero(p) {
  const nameEl = $('#hero-name');
  const name = (p.name || 'RANZE').toUpperCase();
  nameEl.innerHTML = [...name].map((ch, i) =>
    `<span style="animation-delay:${i * 55 + 120}ms">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
  requestAnimationFrame(() => nameEl.classList.add('in'));

  $('#hero-tagline').textContent = p.tagline || '';

  const badge = $('#commission-badge');
  if (p.commission_status) {
    const open = p.commission_status === 'open';
    badge.className = `badge${open ? ' open' : ''}`;
    badge.textContent = open ? 'COMMISSION: OPEN' : 'COMMISSION: CLOSED';
    badge.hidden = false;
  }

  const soc = Object.entries(p.social || {}).filter(([, u]) => u);
  $('#hero-social').innerHTML = soc.map(([k, u]) => {
    const ext = /^https?:/i.test(u);
    return `<a class="sbtn" ${ext ? `href="${esc(u)}" target="_blank" rel="noopener"` : ''}>${icon(k)}<span>${label(k)}</span></a>`;
  }).join('');

  initTicker(p);
}

function initTicker(p) {
  const el = $('#hero-typed');
  if (!el) return;
  const msgs = [
    p.tagline || '3D / メタバース領域のなんでも屋',
    'VRCHAT WORLD / GIMMICK / EVENT / GRAPHIC DESIGN',
    '企画から実装まで。まずはご相談ください。',
  ];
  if (REDUCED) { el.textContent = msgs[0]; return; }

  let mi = 0, ci = 0, del = false;
  const run = () => {
    const m = msgs[mi];
    ci += del ? -1 : 1;
    el.textContent = m.slice(0, ci);
    let wait = del ? 22 : 46;
    if (!del && ci >= m.length) { del = true; wait = 2600; }
    else if (del && ci <= 0)    { del = false; mi = (mi + 1) % msgs.length; wait = 380; }
    setTimeout(run, wait);
  };
  run();
}

/* =========================================================
   ABOUT
   ========================================================= */
function renderAbout(p) {
  $('#bio-text').textContent = p.bio || '';
  $('#stats-grid').innerHTML = (p.stats || []).map((s, i) => {
    const num = String(s.value ?? '').match(/^\d+$/);
    return `
      <div class="stat">
        <span class="stat-no">${pad(i + 1)}</span>
        <div class="stat-ico">${statIcon(s.icon, s.label)}</div>
        <div class="stat-val">${num
          ? `<span data-count="${esc(s.value)}">0</span>`
          : esc(s.value ?? '')}<em>${esc(s.suffix || '')}</em></div>
        <div class="stat-lbl">${esc(s.label || '')}</div>
      </div>`;
  }).join('');
  $$('#stats-grid [data-count]').forEach((el) => revealIO.observe(el));
}

/* =========================================================
   WORKS
   ========================================================= */
let ALL = [], filter = 'all', sort = 'newest';

const byDate = (list) => [...list].sort((a, b) => {
  const da = a.date || '', db = b.date || '';
  if (da === db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return db.localeCompare(da);
});

function cardHTML(w, i) {
  const c = CATS[w.category] || CATS.other;
  const thumb = w.thumbnail
    ? `<img src="${esc(w.thumbnail)}" alt="${esc(w.title)}" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph',textContent:'◇'}))">`
    : `<div class="ph">◇</div>`;
  return `
  <article class="card" data-id="${esc(w.id)}" data-category="${esc(w.category)}" tabindex="0">
    <div class="card-thumb">
      ${thumb}
      <span class="card-idx mono">TGT-${pad(i + 1)}</span>
      ${w.featured ? '<span class="card-feat">FEATURED</span>' : ''}
      <span class="lock"><i></i><i></i><i></i><i></i></span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span class="cat">${c.en}</span>
        ${w.date ? `<span class="card-date">${esc(w.date)}</span>` : ''}
      </div>
      <h3 class="card-title">${esc(w.title)}</h3>
      ${w.client ? `<div class="card-client mono"><b>CLIENT</b>${esc(w.client)}</div>` : ''}
      ${w.tags?.length ? `<div class="tags">${w.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="card-cta mono"><span>OPEN DOSSIER</span><span>→</span></div>
  </article>`;
}

function paint(gridSel, list) {
  const grid = $(gridSel);
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<p class="empty">NO ENTRY — content/works.json に作品を追加してください。</p>`;
    return;
  }
  grid.innerHTML = list.map(cardHTML).join('');
  $$('.card', grid).forEach((el) => {
    const open = () => openDossier(el.dataset.id);
    el.addEventListener('click', open);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
  });
}

function renderWorks() {
  const list = sort === 'newest' ? byDate(ALL) : ALL;
  paint('#works-grid', list);
  applyFilter(filter);
  observeAll();
}

function applyFilter(f) {
  filter = f;
  $$('.fbtn').forEach((b) => b.classList.toggle('active', b.dataset.filter === f));
  $$('#works-grid .card').forEach((c) =>
    c.classList.toggle('hidden', !(f === 'all' || c.dataset.category === f)));
  const n = f === 'all' ? ALL.length : ALL.filter((w) => w.category === f).length;
  $('#works-count').textContent = `${pad(n)} ENTRIES`;
}

function renderPrivate() {
  const list = byDate(ALL.filter((w) => w.category === 'privatework'));
  paint('#selfmade-grid', list);
  $('#private-count').textContent = `${pad(list.length)} ENTRIES`;
}

function initControls() {
  $$('.fbtn').forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
  $('#sort-btn').addEventListener('click', (e) => {
    sort = sort === 'newest' ? 'default' : 'newest';
    e.currentTarget.textContent = `SORT: ${sort === 'newest' ? 'NEWEST' : 'DEFAULT'}`;
    renderWorks();
  });
}

/* =========================================================
   DOSSIER
   ========================================================= */
function openDossier(id) {
  const w = ALL.find((x) => x.id === id);
  if (!w) return;
  const c = CATS[w.category] || CATS.other;
  const n = ALL.indexOf(w) + 1;

  const vis = w.thumbnail
    ? `<img src="${esc(w.thumbnail)}" alt="${esc(w.title)}">`
    : `<div class="ph">◇</div>`;

  const links = Object.entries(w.links || {}).filter(([, u]) => u)
    .map(([k, u]) => `<a class="dlink" href="${esc(u)}" target="_blank" rel="noopener">${icon(k)}<span>${label(k)}</span></a>`)
    .join('');

  const spec = [
    ['CATEGORY', `${c.en} / ${c.jp}`],
    w.client ? ['CLIENT', w.client] : null,
    w.date   ? ['DATE',   w.date]   : null,
    w.tags?.length ? ['STACK', w.tags.join(' / ')] : null,
    ['STATUS', w.featured ? 'FEATURED' : 'ARCHIVED'],
  ].filter(Boolean);

  $('#modal-content').innerHTML = `
    <div class="dh">
      <span class="dh-tag">// DOSSIER</span>
      <span class="dh-line"></span>
      <span class="dh-id">REF ${pad(n)} — ${c.en}</span>
    </div>
    <div class="dbody">
      <div class="dvis">
        ${vis}
        <span class="dvis-grid"></span>
        <span class="lock"><i></i><i></i><i></i><i></i></span>
      </div>
      <div class="dinfo">
        <h2>${esc(w.title)}</h2>
        <dl class="dspec">
          ${spec.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <p class="ddesc">${esc(w.description || '')}</p>
        ${links ? `<div class="dlinks">${links}</div>` : ''}
      </div>
    </div>`;

  $('#modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initDossier() {
  const ov = $('#modal-overlay');
  const close = () => { ov.classList.remove('open'); document.body.style.overflow = ''; };
  $('#modal-close').addEventListener('click', close);
  ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* =========================================================
   SKILLS / CONTACT / FOOTER
   ========================================================= */
function renderSkills(skills) {
  const groups = {};
  (skills || []).forEach((s) => (groups[s.category || 'OTHER'] ??= []).push(s));
  $('#skills-container').innerHTML = Object.entries(groups).map(([cat, items]) => `
    <div class="skgroup reveal">
      <h3>${esc(cat).toUpperCase()}</h3>
      ${items.map((s) => `
        <div class="sk">
          <div class="sk-top">
            <span class="sk-name">${esc(s.name)}</span>
            <span class="sk-pct">${Number(s.level) || 0}%</span>
          </div>
          <div class="sk-bar"><i data-bar="${Number(s.level) || 0}"></i></div>
        </div>`).join('')}
    </div>`).join('');
}

function renderContact(p) {
  $('#contact-grid').innerHTML = Object.entries(p.social || {})
    .filter(([, u]) => u)
    .map(([k, u]) => {
      const ext = /^https?:/i.test(u);
      const tag = ext ? 'a' : 'div';
      const attr = ext ? `href="${esc(u)}" target="_blank" rel="noopener"` : '';
      return `<${tag} class="ccard" ${attr}>
        ${icon(k)}
        <div>
          <div class="ccard-l mono">${label(k)}</div>
          <div class="ccard-v">${esc(ext ? host(u) : u)}</div>
        </div>
        <span class="ccard-arrow">${ext ? '↗' : '#'}</span>
      </${tag}>`;
    }).join('');
}

function renderFooter(p) {
  $('#footer-text').textContent =
    `© ${new Date().getFullYear()} ${p.name || 'RANZE'} — ALL RIGHTS RESERVED`;
}

/* =========================================================
   MAIN
   ========================================================= */
async function main() {
  const canvas = $('#fx');
  if (canvas) new FieldFX(canvas);
  initHud();
  initDossier();
  initControls();

  const bootP = runBoot();

  try {
    const [profile, worksFile] = await Promise.all([
      fetch('content/profile.json').then((r) => r.json()),
      fetch('content/works.json').then((r) => r.json()),
    ]);
    ALL = (Array.isArray(worksFile) ? worksFile : worksFile.works || [])
      .filter((w) => w.published !== false);

    await bootP;

    renderHero(profile);
    renderAbout(profile);
    renderWorks();
    renderPrivate();
    renderSkills(profile.skills);
    renderContact(profile);
    renderFooter(profile);
    observeAll();
  } catch (err) {
    console.error('[v2] data load failed:', err);
    $('#hero-tagline').textContent = 'content/*.json の読み込みに失敗しました（ローカルは http サーバー経由で開いてください）';
  }
}

document.addEventListener('DOMContentLoaded', main);
