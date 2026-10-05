/** Data undangan — ubah di sini tanpa menyentuh HTML */
const invitationData = {
  eventDate: '2026-12-12T08:00:00+07:00',
  endDate:   '2026-12-12T14:00:00+07:00',
  venue: 'Grand Ballroom Jakarta, Jl. Contoh No. 123, Jakarta Selatan',
  mapsUrl: 'https://maps.app.goo.gl/placeholder',
  whatsappNumber: '', // opsional, format 628xxxx. Kosongkan jika tidak dipakai.
  galleryImages: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80'
  ]
};

document.documentElement.classList.add('js');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lock = on => window.Motion ? Motion.lock(on) : document.body.classList.toggle('locked', on);
const bgMusic = $('#bg-music'), btnMusic = $('#btn-music');
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
  guestName(); gate(); $('#btn-maps').href = invitationData.mapsUrl;
  countdown(); navigation(); gallery(); music(); rsvp(); wishes(); gift(); modals();
  calendar(); heroVideo(); tilt(); cursorGlow();
  if (window.Scene3D) {
    Scene3D.mount($('#k3d-hero'), { wide: [3.4, .2, .95], narrow: [0, 1.35, .55], fade: true });
    Scene3D.mount($('#k3d-end'), { pair: true, wide: [4.2, 0, .8], narrow: [1.5, -.2, .38] });
  }
  if (window.Motion) Motion.init();
});

function guestName() {
  const g = new URLSearchParams(location.search).get('to');
  $('#guest-name').textContent = g && g.trim() ? g.trim() : 'Tamu Undangan';
}

/* Gerbang: pintu membuka 3D, lalu hero tampil */
function gate() {
  const el = $('#cover-page');
  $('#btn-open-invitation').addEventListener('click', () => {
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'true');
    lock(false); scrollTo(0, 0);
    document.body.classList.add('opened');
    if (window.Motion) Motion.intro();
    playMusic(); btnMusic.classList.add('show');
    setTimeout(() => el.style.display = 'none', 2100);
  });
}

function countdown() {
  const target = new Date(invitationData.eventDate).getTime(), pad = n => String(n).padStart(2, '0');
  const set = (id, v) => { const e = $('#' + id), t = pad(v); if (e.textContent !== t) { e.textContent = t; e.classList.remove('tick'); void e.offsetWidth; e.classList.add('tick'); } };
  const tick = () => {
    const d = target - Date.now();
    if (d <= 0) { clearInterval(iv); $('#countdown-timer').classList.add('hidden'); $('#cd-arrived').classList.remove('hidden'); return; }
    set('cd-days', Math.floor(d / 864e5)); set('cd-hours', Math.floor(d % 864e5 / 36e5));
    set('cd-minutes', Math.floor(d % 36e5 / 6e4)); set('cd-seconds', Math.floor(d % 6e4 / 1e3));
  };
  const iv = setInterval(tick, 1000); tick();
}

function navigation() {
  const nav = $('#navbar'), menu = $('#nav-links'), burger = $('.burger'), top = $('#btn-totop'), bar = $('#progress'), icon = $('i', burger);
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); icon.className = o ? 'ph ph-x' : 'ph ph-list'; };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

  // Semua tautan #anchor: scroll halus lewat Lenis
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href') === '#') return;
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); setMenu(false); Motion.scrollTo(t);
  });

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('solid', scrollY > 60);
    top.classList.toggle('show', scrollY > 500 && !document.body.classList.contains('locked'));
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => Motion.scrollTo(document.body, 0));

  const map = {};
  $$('a', menu).forEach(a => { const s = $(a.getAttribute('href')); if (s) map[s.id] = a; });
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && map[e.target.id]) { $$('a', menu).forEach(l => l.classList.remove('on')); map[e.target.id].classList.add('on'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(map).forEach(id => spy.observe(document.getElementById(id)));
}

/* Galeri: carousel geser/seret + lightbox */
function gallery() {
  const track = $('#gallery-grid'), lb = $('#lightbox'), img = $('#lightbox-img'), imgs = invitationData.galleryImages;
  let i = 0, moved = 0;
  const show = () => img.src = imgs[i];
  const close = () => { lb.classList.remove('on'); lock(false); };
  const step = n => { i = (i + n + imgs.length) % imgs.length; show(); };

  imgs.forEach((src, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', `Buka foto ${n + 1}`);
    b.innerHTML = `<img src="${src}" loading="lazy" alt="Foto galeri ${n + 1}" draggable="false">`;
    b.addEventListener('click', () => { if (moved > 6) return; i = n; show(); lb.classList.add('on'); lock(true); });
    track.appendChild(b);
  });

  let down = false, sx = 0, sl = 0;
  track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = track.scrollLeft; track.classList.add('drag'); });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); track.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { down = false; track.classList.remove('drag'); });
  const by = d => track.scrollBy({ left: d * Math.min(track.clientWidth * .8, 600), behavior: 'smooth' });
  $('#gal-prev').addEventListener('click', () => by(-1));
  $('#gal-next').addEventListener('click', () => by(1));

  $('.lb-close').addEventListener('click', close);
  $('.lb-prev').addEventListener('click', () => step(-1));
  $('.lb-next').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1);
  });
  let x0 = 0;
  lb.addEventListener('touchstart', e => x0 = e.changedTouches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) step(d > 0 ? -1 : 1); }, { passive: true });
}

function setMusic(on) {
  isPlaying = on; btnMusic.classList.toggle('spin', on);
  btnMusic.innerHTML = `<i class="ph ph-${on ? 'speaker-high' : 'speaker-slash'}"></i>`;
}
function playMusic() { bgMusic.play().then(() => setMusic(true)).catch(() => setMusic(false)); }
function music() {
  btnMusic.addEventListener('click', () => isPlaying ? (bgMusic.pause(), setMusic(false)) : playMusic());
  let was = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { was = isPlaying; if (isPlaying) bgMusic.pause(); } else if (was) bgMusic.play().catch(() => {});
  });
}

function rsvp() {
  const f = $('#rsvp-form');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#rsvp-name').value.trim(), st = $('#rsvp-status').value, n = $('#rsvp-guest').value;
    if (invitationData.whatsappNumber) {
      const t = `Halo, saya ${name}. Konfirmasi kehadiran: ${st} (${n} orang). Terima kasih.`;
      window.open(`https://wa.me/${invitationData.whatsappNumber}?text=${encodeURIComponent(t)}`, '_blank', 'noopener');
    }
    $('#modal-rsvp').classList.add('show'); lock(true); f.reset();
  });
}

function wishes() {
  const f = $('#wishes-form'), list = $('#wishes-list'), KEY = 'wedding_wishes';
  let data = [];
  try { data = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const ago = t => { const s = (Date.now() - t) / 1000; return s < 60 ? 'Baru saja' : s < 3600 ? `${~~(s / 60)} menit lalu` : s < 86400 ? `${~~(s / 3600)} jam lalu` : `${~~(s / 86400)} hari lalu`; };
  const render = () => {
    list.innerHTML = data.length ? data.map(w => `<div class="wish"><div><b>${esc(w.name)}</b><small>${ago(w.ts)}</small></div><p>"${esc(w.message)}"</p></div>`).join('')
      : '<p class="soft">Jadilah yang pertama mengirim ucapan.</p>';
  };
  render();
  f.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#wish-name').value.trim(), message = $('#wish-message').value.trim();
    if (!name || !message) return;
    data.unshift({ name, message, ts: Date.now() });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    render(); f.reset();
  });
  setInterval(render, 60000);
}

function gift() {
  const fallback = t => { const a = document.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; document.body.append(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); };
  $$('.btn-copy').forEach(b => {
    const label = b.textContent;
    b.addEventListener('click', async () => {
      const t = document.getElementById(b.dataset.copy).innerText.trim();
      try { navigator.clipboard && isSecureContext ? await navigator.clipboard.writeText(t) : fallback(t); } catch (e) { fallback(t); }
      b.textContent = 'Tersalin!'; b.style.cssText = 'background:var(--m);border-color:var(--m);color:#fff';
      setTimeout(() => { b.textContent = label; b.style.cssText = ''; }, 2000);
    });
  });
  $('#btn-show-qr').addEventListener('click', () => { $('#modal-qr').classList.add('show'); lock(true); });
}

function modals() {
  const all = $$('.modal'), closeAll = () => { all.forEach(m => m.classList.remove('show')); if (!$('#lightbox').classList.contains('on')) lock(false); };
  all.forEach(m => {
    $$('.close-modal', m).forEach(b => b.addEventListener('click', closeAll));
    m.addEventListener('click', e => { if (e.target === m) closeAll(); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
}

/* Simpan ke kalender (.ics) */
function calendar() {
  const fmt = d => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, '');
  $('#btn-cal').addEventListener('click', () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//ID', 'BEGIN:VEVENT',
      `DTSTART:${fmt(invitationData.eventDate)}`, `DTEND:${fmt(invitationData.endDate)}`,
      'SUMMARY:Pernikahan Alexandra & Rizky', `LOCATION:${invitationData.venue}`,
      'DESCRIPTION:Ijab Qabul 08.00 WIB dan Panggih & Resepsi 11.00 WIB', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'pernikahan-alexandra-rizky.ics'; a.click(); URL.revokeObjectURL(a.href);
  });
}

function heroVideo() {
  const v = $('#hero-video'); if (!v) return;
  const src = $$('source', v), last = src[src.length - 1];
  if (last) last.addEventListener('error', () => { console.warn('Video hero gagal dimuat. Cek: video/prewedding.mp4'); v.style.display = 'none'; });
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: .1 }).observe(v);
}

/* Kartu miring 3D mengikuti kursor (desktop) */
function tilt() {
  if (matchMedia('(hover:none)').matches) return;
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      el.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}

/* Cahaya emas lembut mengikuti kursor (desktop) */
function cursorGlow() {
  if (matchMedia('(hover:none)').matches) return;
  const g = $('#glow'); let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; g.classList.add('on'); });
  (function loop() { cx += (x - cx) * .12; cy += (y - cy) * .12; g.style.transform = `translate(${cx - 200}px,${cy - 200}px)`; requestAnimationFrame(loop); })();
}