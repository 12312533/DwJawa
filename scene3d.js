/**
 * scene3d.js — Gunungan (kayon) emas 3D sungguhan dengan Three.js
 * Dibangun dari geometri (extrude + bevel) sehingga punya ketebalan, kilau logam,
 * dan bereaksi pada kursor. Dipakai di hero (satu) dan penutup (sepasang).
 */
window.Scene3D = (() => {
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const outline = k => {
    const s = new THREE.Shape();
    s.moveTo(0, 2.6 * k);
    s.bezierCurveTo(.5 * k, 1.6 * k, 1.35 * k, .6 * k, 1.25 * k, -.8 * k);
    s.bezierCurveTo(1.2 * k, -1.9 * k, .7 * k, -2.4 * k, 0, -2.4 * k);
    s.bezierCurveTo(-.7 * k, -2.4 * k, -1.2 * k, -1.9 * k, -1.25 * k, -.8 * k);
    s.bezierCurveTo(-1.35 * k, .6 * k, -.5 * k, 1.6 * k, 0, 2.6 * k);
    return s;
  };
  const leaf = () => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.quadraticCurveTo(.55, .05, .7, .62); s.quadraticCurveTo(.12, .6, 0, 0);
    return s;
  };
  const ext = (shape, depth, b) => new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 4, curveSegments: 48
  });

  function buildKayon() {
    const g = new THREE.Group();
    const gold = new THREE.MeshStandardMaterial({ color: 0xe3bd5f, metalness: .9, roughness: .22, emissive: 0x2a1c04, side: THREE.DoubleSide });
    const wine = new THREE.MeshStandardMaterial({ color: 0x6d0f1f, metalness: .35, roughness: .55, emissive: 0x1a0308 });
    g.add(new THREE.Mesh(ext(outline(1), .22, .07), gold));
    const inner = new THREE.Mesh(ext(outline(.8), .1, .04), wine); inner.position.z = .3; g.add(inner);
    const stem = new THREE.Mesh(new THREE.BoxGeometry(.07, 3.6, .1), gold); stem.position.set(0, -.1, .52); g.add(stem);
    [[1.1, .6], [.35, .8], [-.4, .9], [-1.15, .8]].forEach(([y, sc]) => {
      [0, Math.PI].forEach(ry => {
        const l = new THREE.Mesh(ext(leaf(), .04, .02), gold);
        l.scale.setScalar(sc); l.position.set(0, y, .5); l.rotation.y = ry; g.add(l);
      });
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(.12, 24, 24), gold); orb.position.set(0, 1.55, .55); g.add(orb);
    return g;
  }

  function mount(cv, opt = {}) {
    if (!cv || !window.THREE || REDUCE) return;
    let ren;
    try { ren = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); } catch (e) { return; }
    ren.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, .1, 100);
    cam.position.z = 10;

    const items = [];
    const count = opt.pair ? 2 : 1;
    for (let i = 0; i < count; i++) { const k = buildKayon(); scene.add(k); items.push(k); }

    const N = 160, pos = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - .5) * 14;
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xf0d588, size: .05, transparent: true, opacity: .8 }));
    scene.add(dust);

    scene.add(new THREE.AmbientLight(0xffe9c0, .75));
    const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(4, 5, 6); scene.add(key);
    const rim = new THREE.PointLight(0xff6a7a, 2.4, 30); rim.position.set(-6, -2, 4); scene.add(rim);
    const warm = new THREE.PointLight(0xffd27a, 2.2, 30); warm.position.set(5, -3, 5); scene.add(warm);

    const host = cv.parentElement;
    const fit = () => {
      const w = host.clientWidth, h = host.clientHeight, wide = w / h > 1.1;
      ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      const [x, y, s] = wide ? opt.wide : opt.narrow;
      items.forEach((k, i) => {
        const side = count === 2 ? (i ? 1 : -1) : 1;
        k.position.set(count === 2 ? side * x : x, y, 0); k.scale.setScalar(s); k.userData.y0 = y;
      });
    };
    fit(); new ResizeObserver(fit).observe(host);

    let mx = 0, my = 0, vis = true, t = 0;
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    new IntersectionObserver(es => vis = es[0].isIntersecting).observe(host);

    (function loop() {
      requestAnimationFrame(loop);
      if (!vis || document.hidden) return;
      t += .012;
      items.forEach((k, i) => {
        k.rotation.y += (Math.sin(t * .7 + i) * .55 + mx * .8 - k.rotation.y) * .05;
        k.rotation.x += (my * .35 - k.rotation.x) * .05;
        k.position.y = k.userData.y0 + Math.sin(t + i) * .12;
      });
      dust.rotation.y = t * .06;
      if (opt.fade) cv.style.opacity = Math.max(0, 1 - scrollY / (innerHeight * .8));
      ren.render(scene, cam);
    })();
  }
  return { mount };
})();