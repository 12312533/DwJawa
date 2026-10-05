/**
 * motion.js — Gerak & scroll: Lenis (smooth scroll) + GSAP ScrollTrigger.
 * Semua aman jika library gagal dimuat: konten tetap tampil normal.
 */
window.Motion = (() => {
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
  let lenis = null;

  if (HAS_GSAP && !REDUCE) document.documentElement.classList.add('gsap');

  // --- Smooth scroll ---
  if (window.Lenis && !REDUCE) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    window.__lenis = lenis;
    if (HAS_GSAP) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function r(t) { lenis.raf(t); requestAnimationFrame(r); });
    }
    if (document.body.classList.contains('locked')) lenis.stop();
  } else if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

  /** Kunci / buka scroll (cover, lightbox, modal) */
  function lock(on) {
    document.body.classList.toggle('locked', on);
    if (lenis) on ? lenis.stop() : lenis.start();
  }
  function scrollTo(target, offset = -60) {
    lenis ? lenis.scrollTo(target, { offset, duration: 1.4 }) : target.scrollIntoView({ behavior: 'smooth' });
  }

  /** Dipanggil setelah gerbang terbuka */
  function intro() {
    if (!HAS_GSAP || REDUCE) return;
    gsap.fromTo('.hero .hl', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out', stagger: .16, delay: .8 });
    gsap.from('#k3d-hero', { opacity: 0, scale: .92, duration: 1.8, ease: 'power2.out', delay: .6 });
  }

  /** Animasi scroll — dipanggil sekali saat halaman siap */
  function init() {
    if (!HAS_GSAP || REDUCE) return;
    const st = (trigger, extra = {}) => ({ trigger, start: 'top 88%', once: true, ...extra });

    gsap.utils.toArray('[data-r]').forEach(el =>
      gsap.from(el, { y: 44, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: st(el) }));

    gsap.utils.toArray('[data-stagger]').forEach(box =>
      gsap.from(box.children, { y: 50, opacity: 0, duration: .9, ease: 'power3.out', stagger: .12, scrollTrigger: st(box) }));

    // Parallax video hero + teks
    gsap.to('#hero-video', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -14, opacity: .2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 20%', scrub: true } });

    // Garis perjalanan tergambar mengikuti scroll
    gsap.fromTo('.tl-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top',
      scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 70%', scrub: true } });

    // Ornamen melayang berbeda kecepatan (kedalaman)
    gsap.utils.toArray('.orn .kayon').forEach((k, i) =>
      gsap.to(k, { y: i ? -30 : -50, ease: 'none', scrollTrigger: { trigger: '.orn', start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.utils.toArray('.janur').forEach(j =>
      gsap.to(j, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: j.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  }

  return { lock, scrollTo, intro, init };
})();