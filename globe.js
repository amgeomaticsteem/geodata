/* GEOData realistic 3D Earth.
   Desktop and mobile use the same globe; mobile caps DPR, geometry and frame rate.
   No pointer/touch listeners: the planet rotates on its own. */
const canvas = document.getElementById('earth');
if (canvas) {
  const host = canvas.parentElement;
  const mobile = matchMedia('(max-width: 680px), (pointer: coarse)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frameInterval = mobile ? 1000 / 26 : 1000 / 48;
  let renderer, scene, camera, earth, clouds, frameId = 0, timerId = 0, lastFrame = 0, ready = false, inView = true;

  const startFallback = () => {
    canvas.style.background =
      'radial-gradient(circle at 45% 42%,rgba(32,106,165,.18),transparent 56%),' +
      'radial-gradient(circle at 50% 48%,#09233b 0%,#030914 68%)';
    const fallback = document.createElement('div');
    fallback.className = 'earth-fallback';
    fallback.setAttribute('aria-hidden', 'true');
    fallback.innerHTML = '<span></span>';
    host.append(fallback);
  };

  const resize = () => {
    if (!renderer || !camera) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const stop = () => {
    if (timerId) clearTimeout(timerId);
    if (frameId) cancelAnimationFrame(frameId);
    timerId = 0; frameId = 0; lastFrame = 0;
  };
  const schedule = () => {
    if (reducedMotion || !ready || document.hidden || !inView || timerId || frameId) return;
    timerId = setTimeout(() => {
      timerId = 0;
      frameId = requestAnimationFrame(tick);
    }, Math.max(0, frameInterval - 16));
  };
  const tick = now => {
    frameId = 0;
    if (!ready || document.hidden || !inView) return;
    const delta = lastFrame ? Math.min(.05, (now - lastFrame) / 1000) : frameInterval / 1000;
    lastFrame = now;
    earth.rotation.y += delta * (mobile ? .075 : .095);
    if (clouds) clouds.rotation.y += delta * (mobile ? .082 : .105);
    renderer.render(scene, camera);
    schedule();
  };
  const wake = () => {
    if (reducedMotion) {
      if (renderer && scene && camera && earth) renderer.render(scene, camera);
      return;
    }
    schedule();
  };

  addEventListener('resize', () => { resize(); wake(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else wake();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = Boolean(entries[0]?.isIntersecting);
      if (inView) wake(); else stop();
    }, { threshold: 0.04 });
    observer.observe(host);
  }

  (async () => {
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
      renderer = new THREE.WebGLRenderer({
        canvas, alpha: true, antialias: !mobile,
        powerPreference: 'low-power', failIfMajorPerformanceCaveat: false
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x020812, 0);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, Math.max(1, host.clientWidth) / Math.max(1, host.clientHeight), .1, 60);
      camera.position.set(0, 0, 3.02);

      const ambient = new THREE.AmbientLight(0x9bbfe0, .78);
      const sun = new THREE.DirectionalLight(0xffffff, 2.35);
      sun.position.set(-3, 1.8, 4);
      const rim = new THREE.DirectionalLight(0x287cc3, .72);
      rim.position.set(3, -.8, -2);
      scene.add(ambient, sun, rim);

      const loader = new THREE.TextureLoader();
      const textureRoot = 'https://threejs.org/examples/textures/planets/';
      const loadTexture = (name, color = false) => new Promise((resolve, reject) => {
        loader.load(textureRoot + name, texture => {
          if (color) texture.colorSpace = THREE.SRGBColorSpace;
          resolve(texture);
        }, undefined, reject);
      });
      const [day, normal, specular, cloudMap] = await Promise.all([
        loadTexture('earth_atmos_2048.jpg', true),
        loadTexture('earth_normal_2048.jpg'),
        loadTexture('earth_specular_2048.jpg'),
        loadTexture('earth_clouds_1024.png', true).catch(() => null)
      ]);

      const segments = mobile ? [52, 40] : [88, 64];
      const geometry = new THREE.SphereGeometry(1, segments[0], segments[1]);
      const material = new THREE.MeshPhongMaterial({
        map: day, normalMap: normal, normalScale: new THREE.Vector2(.32, .32),
        specularMap: specular, specular: new THREE.Color(0x263d57), shininess: 10
      });
      earth = new THREE.Mesh(geometry, material);
      earth.rotation.set(-.12, 1.35, -.20);
      scene.add(earth);

      if (cloudMap) {
        const cloudMaterial = new THREE.MeshPhongMaterial({
          map: cloudMap, transparent: true, opacity: .21,
          depthWrite: false, blending: THREE.AdditiveBlending
        });
        clouds = new THREE.Mesh(new THREE.SphereGeometry(1.008, segments[0], segments[1]), cloudMaterial);
        clouds.rotation.copy(earth.rotation);
        scene.add(clouds);
      }

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.055, mobile ? 36 : 56, mobile ? 28 : 44),
        new THREE.MeshBasicMaterial({
          color: 0x2a8fd8, transparent: true, opacity: .105,
          side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
        })
      );
      scene.add(atmosphere);

      const starCount = mobile ? 380 : 950;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const radius = 5 + Math.random() * 13;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = radius * Math.cos(phi);
        starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
        color: 0xd5eaff, size: mobile ? .018 : .014, transparent: true, opacity: .72,
        sizeAttenuation: true
      }));
      scene.add(stars);

      resize();
      ready = true;
      renderer.render(scene, camera);
      wake();
    } catch (error) {
      console.warn('3D Earth could not initialize:', error);
      startFallback();
    }
  })();
}
