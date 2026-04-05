/* ========================================
   VRChat Portfolio - Main JavaScript
   ======================================== */

/* ---- Category config ---- */
const CATEGORIES = {
  world:         { label: 'ワールド',      icon: '🌍', cls: 'cat-world' },
  event:         { label: 'イベント',      icon: '🎉', cls: 'cat-event' },
  privatework:   { label: 'PrivateWork',   icon: '🖌️', cls: 'cat-privatework' },
  graphicdesign: { label: 'GraphicDesign', icon: '🎨', cls: 'cat-graphicdesign' },
  other:         { label: 'その他',        icon: '✨', cls: 'cat-other' },
};

const SOCIAL_ICONS = {
  vrchat:  { icon: 'fa-solid fa-vr-cardboard', label: 'VRChat' },
  twitter: { icon: 'fa-brands fa-x-twitter',   label: 'X (Twitter)' },
  booth:   { icon: 'fa-solid fa-store',         label: 'BOOTH' },
  github:  { icon: 'fa-brands fa-github',       label: 'GitHub' },
  discord: { icon: 'fa-brands fa-discord',      label: 'Discord' },
  youtube: { icon: 'fa-brands fa-youtube',      label: 'YouTube' },
};

const SKILL_LEVELS = {
  expert:   { label: '★★★', cls: 'lvl-expert' },
  advanced: { label: '★★☆', cls: 'lvl-advanced' },
  mid:      { label: '★☆☆', cls: 'lvl-mid' },
  beginner: { label: '☆☆☆', cls: 'lvl-beginner' },
};

/* ---- Data loading ---- */
async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function loadData() {
  const [profile, worksFile] = await Promise.all([
    fetchJSON('content/profile.json'),
    fetchJSON('content/works.json'),
  ]);
  // works.json は { "works": [...] } 形式
  const works = Array.isArray(worksFile) ? worksFile : (worksFile.works || []);
  return { profile, works };
}

/* ---- Navbar ---- */
function initNavbar(profile) {
  const navbar  = document.getElementById('navbar');
  const logoEl  = document.getElementById('nav-logo');
  const toggle  = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (logoEl && profile.name) logoEl.textContent = profile.name;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }
}

/* ---- Hero ---- */
function renderHero(profile) {
  // Avatar
  const avatarWrap = document.getElementById('hero-avatar-wrap');
  if (avatarWrap) {
    if (profile.avatar_image) {
      avatarWrap.innerHTML = `
        <div class="avatar-glow"></div>
        <img class="hero-avatar"
             src="${profile.avatar_image}"
             alt="${profile.name}"
             onerror="this.parentElement.innerHTML='<div class=\'hero-avatar-placeholder\'>🎮</div>'">
      `;
    } else {
      avatarWrap.innerHTML = `<div class="avatar-glow"></div><div class="hero-avatar-placeholder">🎮</div>`;
    }
  }

  // Commission badge
  const badgeEl = document.getElementById('commission-badge');
  if (badgeEl && profile.commission_status) {
    const open = profile.commission_status === 'open';
    badgeEl.className = `commission-badge ${open ? 'open' : 'closed'}`;
    badgeEl.textContent = open ? '依頼受付中' : '依頼停止中';
    badgeEl.style.display = 'inline-flex';
  }

  setText('hero-name',    profile.name    || '');
  setText('hero-tagline', profile.tagline || '');

  // Social links
  const socialEl = document.getElementById('hero-social');
  if (socialEl && profile.social) {
    socialEl.innerHTML = Object.entries(profile.social)
      .filter(([, url]) => url)
      .map(([key, url]) => {
        const cfg = SOCIAL_ICONS[key] || { icon: 'fa-solid fa-link', label: key };
        return `<a href="${url}" target="_blank" rel="noopener" class="social-btn">
          <i class="${cfg.icon}"></i><span>${cfg.label}</span>
        </a>`;
      }).join('');
  }
}

/* ---- About ---- */
function renderAbout(profile) {
  setText('bio-text', profile.bio || '');

  const statsEl = document.getElementById('stats-grid');
  if (statsEl && profile.stats) {
    statsEl.innerHTML = profile.stats.map((s, i) => `
      <div class="stat-card reveal reveal-delay-${i % 3 + 1}">
        <div class="stat-icon">${s.icon}</div>
        <div class="stat-value">${s.value}<span class="stat-suffix">${s.suffix || ''}</span></div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }
}

/* ---- Works ---- */
let currentFilter = 'all';

function renderWorks(works) {
  const grid = document.getElementById('works-grid');
  if (!grid) return;

  const published = works.filter(w => w.published !== false);
  if (published.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-3);text-align:center;grid-column:1/-1;padding:60px 0;">
      まだ作品がありません。<code>content/works.json</code> に追加してください。
    </p>`;
    return;
  }

  grid.innerHTML = published.map(work => buildWorkCard(work)).join('');

  grid.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id, published));
  });

  applyFilter(currentFilter, published);
}

function buildWorkCard(work) {
  const cat = CATEGORIES[work.category] || CATEGORIES.other;
  const thumb = work.thumbnail
    ? `<img class="work-thumbnail" src="${work.thumbnail}" alt="${work.title}" loading="lazy" onerror="this.outerHTML='<div class=&quot;work-thumbnail-placeholder&quot;>${cat.icon}</div>'">`
    : `<div class="work-thumbnail-placeholder">${cat.icon}</div>`;

  return `
    <div class="work-card reveal${work.featured ? ' featured' : ''}"
         data-id="${work.id}"
         data-category="${work.category}">
      ${thumb}
      <div class="work-body">
        <div class="work-meta">
          <span class="category-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
          ${work.featured ? '<span class="featured-mark">⭐ Featured</span>' : ''}
          ${work.date ? `<span class="work-date">${work.date}</span>` : ''}
        </div>
        <h3 class="work-title">${work.title}</h3>
        <p class="work-desc">${work.description || ''}</p>
        ${work.tags && work.tags.length > 0
          ? `<div class="work-tags">${work.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
          : ''}
      </div>
    </div>
  `;
}

function applyFilter(filter, works) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  document.querySelectorAll('.work-card').forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !match);
  });
  const count = filter === 'all'
    ? works.filter(w => w.published !== false).length
    : works.filter(w => w.category === filter && w.published !== false).length;
  const countEl = document.getElementById('works-count');
  if (countEl) countEl.textContent = `${count}件`;
}

function initFilters(works) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter, works));
  });
}

/* ---- Modal ---- */
function openModal(id, works) {
  const work = works.find(w => w.id === id);
  if (!work) return;

  const cat = CATEGORIES[work.category] || CATEGORIES.other;
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  const thumb = work.thumbnail
    ? `<img class="modal-thumbnail" src="${work.thumbnail}" alt="${work.title}">`
    : `<div class="modal-thumbnail-placeholder">${cat.icon}</div>`;

  const links = work.links ? Object.entries(work.links)
    .filter(([, url]) => url)
    .map(([key, url]) => {
      const cfg = SOCIAL_ICONS[key] || { icon: 'fa-solid fa-link', label: key };
      return `<a href="${url}" target="_blank" rel="noopener" class="modal-link">
        <i class="${cfg.icon}"></i>${cfg.label}で見る
      </a>`;
    }).join('') : '';

  content.innerHTML = `
    ${thumb}
    <div class="modal-meta">
      <span class="category-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
      ${work.featured ? '<span class="featured-mark">⭐ Featured</span>' : ''}
      ${work.date ? `<span class="work-date">${work.date}</span>` : ''}
    </div>
    <h2 class="modal-title">${work.title}</h2>
    ${work.client ? `<p class="modal-client">クライアント: ${work.client}</p>` : ''}
    <p class="modal-desc">${work.description || ''}</p>
    ${work.tags && work.tags.length > 0
      ? `<div class="work-tags">${work.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
      : ''}
    ${links ? `<div class="modal-links">${links}</div>` : ''}
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initModal() {
  const overlay   = document.getElementById('modal-overlay');
  const closeBtn  = document.getElementById('modal-close');

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn)  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ---- Skills ---- */
function renderSkills(skills) {
  const container = document.getElementById('skills-container');
  if (!container || !skills) return;

  // Group by category
  const groups = {};
  skills.forEach(skill => {
    const cat = skill.category || 'その他';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(skill);
  });

  container.innerHTML = Object.entries(groups).map(([cat, items]) => `
    <div class="skills-section reveal">
      <div class="skill-category-title">${cat}</div>
      <div class="skill-tags">
        ${items.map(s => {
          const lvlKey = s.level >= 80 ? 'expert' : s.level >= 60 ? 'advanced' : s.level >= 40 ? 'mid' : 'beginner';
          const lvl = SKILL_LEVELS[lvlKey];
          return `<span class="skill-tag ${lvl.cls}" title="${s.name}: ${s.level || '?'}%">
            ${s.name}
          </span>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

/* ---- Contact ---- */
function renderContact(profile) {
  const grid = document.getElementById('contact-grid');
  if (!grid || !profile.social) return;

  grid.innerHTML = Object.entries(profile.social)
    .filter(([, url]) => url)
    .map(([key, url]) => {
      const cfg = SOCIAL_ICONS[key] || { icon: 'fa-solid fa-link', label: key };
      return `
        <a href="${url}" target="_blank" rel="noopener" class="contact-card">
          <i class="${cfg.icon}"></i>
          <div class="contact-card-info">
            <div class="contact-card-label">${cfg.label}</div>
            <div class="contact-card-value">${formatUrl(url)}</div>
          </div>
        </a>
      `;
    }).join('');
}

/* ---- Footer ---- */
function renderFooter(profile) {
  const el = document.getElementById('footer-text');
  if (el) {
    const year = new Date().getFullYear();
    el.innerHTML = `© ${year} ${profile.name || 'Portfolio'}. All rights reserved.`;
  }
}

/* ---- Particles (CSS-based, no canvas) ---- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (canvas) canvas.style.display = 'none';
  // Particles handled via CSS in .hero-grid
}

/* ---- Scroll reveal ---- */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function reinitScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/* ---- Helpers ---- */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function formatUrl(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/* ---- Skills data (default, used if not in profile.json) ---- */
const DEFAULT_SKILLS = [
  { name: 'VRChat SDK', level: 85, category: '3D / ゲームエンジン' },
  { name: 'Unity',      level: 80, category: '3D / ゲームエンジン' },
  { name: 'Blender',    level: 70, category: '3D / ゲームエンジン' },
  { name: 'U#/Udon',    level: 65, category: 'プログラミング' },
  { name: 'Photoshop',  level: 60, category: 'デザイン' },
  { name: 'Illustrator',level: 50, category: 'デザイン' },
];

/* ---- Self-made works section ---- */
function renderSelfmade(works) {
  const grid = document.getElementById('selfmade-grid');
  if (!grid) return;

  const items = works.filter(w => w.published !== false && w.category === 'privatework');
  if (items.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-3);text-align:center;grid-column:1/-1;padding:60px 0;">
      まだ自主制作作品がありません。管理画面で PrivateWork カテゴリに設定してください。
    </p>`;
    return;
  }

  grid.innerHTML = items.map(work => buildWorkCard(work)).join('');
  grid.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id, works));
  });
}

/* ---- Boot ---- */
async function main() {
  initParticles();
  initModal();

  try {
    const { profile, works } = await loadData();

    initNavbar(profile);
    renderHero(profile);
    renderAbout(profile);
    renderWorks(works);
    initFilters(works);
    renderSelfmade(works);
    renderSkills(profile.skills || DEFAULT_SKILLS);
    renderContact(profile);
    renderFooter(profile);

  } catch (err) {
    console.error('Portfolio data load error:', err);
    // Show error hint in hero
    const heroName = document.getElementById('hero-name');
    if (heroName) heroName.textContent = 'ポートフォリオ';
    const heroTagline = document.getElementById('hero-tagline');
    if (heroTagline) heroTagline.textContent = 'content/profile.json を編集してください';
  }

  // Run after DOM is updated
  setTimeout(() => {
    initScrollReveal();
  }, 100);
}

document.addEventListener('DOMContentLoaded', main);
