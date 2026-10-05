/**
 * ornaments.js — Pustaka ornamen adat Jawa (SVG, gradasi emas + bayangan = kesan 3D)
 * Menyuntikkan sprite SVG sekali, lalu mengisi semua elemen [data-orn="..."]
 * dan membuat kelopak melati yang jatuh di elemen .petals
 */
window.Orn = (() => {
  const VB = { kayon: '0 0 120 200', melati: '0 0 100 100', janur: '0 0 160 160' };

  const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="og" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff3c9"/><stop offset=".35" stop-color="#e4bf63"/>
    <stop offset=".72" stop-color="#b98a2c"/><stop offset="1" stop-color="#6e4d10"/>
  </linearGradient>
  <radialGradient id="op" cx=".5" cy=".35" r=".75">
    <stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fcf3e8"/><stop offset="1" stop-color="#e6c98f"/>
  </radialGradient>
  <filter id="osh" x="-25%" y="-15%" width="150%" height="150%">
    <feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="#000" flood-opacity=".45"/>
  </filter>
</defs>

<!-- GUNUNGAN / KAYON : pohon kehidupan pembuka lakon wayang -->
<symbol id="kayon" viewBox="0 0 120 200"><g filter="url(#osh)">
  <path d="M60 4C86 40 114 82 109 132 104 172 80 196 60 196 40 196 16 172 11 132 6 82 34 40 60 4Z" fill="url(#og)" stroke="#5c3d0a" stroke-width="1.5"/>
  <path d="M60 22C80 52 98 86 95 128 92 160 76 180 60 180 44 180 28 160 25 128 22 86 40 52 60 22Z" fill="#4f0d19" stroke="url(#og)" stroke-width="2"/>
  <path d="M60 40V176" stroke="url(#og)" stroke-width="3"/>
  <g fill="url(#og)">
    <path d="M60 78C46 74 38 64 36 52 50 54 58 64 60 78ZM60 78C74 74 82 64 84 52 70 54 62 64 60 78Z"/>
    <path d="M60 116C42 112 33 100 31 86 49 88 58 100 60 116ZM60 116C78 112 87 100 89 86 71 88 62 100 60 116Z"/>
    <path d="M60 154C44 150 36 140 34 128 50 130 58 140 60 154ZM60 154C76 150 84 140 86 128 70 130 62 140 60 154Z"/>
  </g>
  <circle cx="60" cy="40" r="4" fill="#fff3c9"/>
  <path d="M33 72C25 102 28 140 44 170" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/>
</g></symbol>

<!-- MELATI : bunga ronce pengantin -->
<symbol id="melati" viewBox="0 0 100 100"><g stroke="#d9bd86" stroke-width=".8" fill="url(#op)">
  <ellipse cx="50" cy="27" rx="13" ry="24"/>
  <ellipse cx="50" cy="27" rx="13" ry="24" transform="rotate(72 50 50)"/>
  <ellipse cx="50" cy="27" rx="13" ry="24" transform="rotate(144 50 50)"/>
  <ellipse cx="50" cy="27" rx="13" ry="24" transform="rotate(216 50 50)"/>
  <ellipse cx="50" cy="27" rx="13" ry="24" transform="rotate(288 50 50)"/>
</g><circle cx="50" cy="50" r="7" fill="url(#og)"/></symbol>

<!-- JANUR : daun kelapa muda, hiasan sudut -->
<symbol id="janur" viewBox="0 0 160 160"><g filter="url(#osh)" fill="url(#og)" stroke="#5c3d0a" stroke-width="1">
  <path d="M4 4C70 6 140 50 156 156 110 90 60 50 4 4Z"/>
  <path d="M4 4C50 30 100 70 120 150 80 100 40 60 4 4Z" opacity=".9"/>
  <path d="M4 4C30 40 60 90 70 140 40 100 20 60 4 4Z" opacity=".8"/>
</g></symbol>
</svg>`;

  function mount() {
    if (!document.getElementById('osh')) document.body.insertAdjacentHTML('afterbegin', SPRITE);
    document.querySelectorAll('[data-orn]').forEach(el => {
      const id = el.dataset.orn;
      el.innerHTML = `<svg viewBox="${VB[id]}" aria-hidden="true"><use href="#${id}"/></svg>`;
    });
    document.querySelectorAll('.petals').forEach(c => {
      for (let i = 0, n = +c.dataset.n || 10; i < n; i++) {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), r = Math.random;
        s.setAttribute('viewBox', '0 0 100 100');
        s.innerHTML = '<use href="#melati"/>';
        s.style.cssText = `--x:${r() * 100}%;--s:${14 + r() * 22}px;--d:${9 + r() * 10}s;--dl:${-r() * 14}s;--dx:${(r() - .5) * 160}px`;
        c.appendChild(s);
      }
    });
  }
  return { mount };
})();
Orn.mount();