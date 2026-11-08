/* Blurred Earth + animated mesh that reacts to the pointer. Land shapes come from a public CDN; if it can't load, a dotted globe is still drawn. */
const cv = document.getElementById('earth'), g = cv.getContext('2d'), bg = document.querySelector('.bg');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const S = .5; // render at half size: cheap, and the upscale adds to the blur
let W, H, mx = 0, my = 0, sx = 0, sy = 0, px = innerWidth / 2, py = innerHeight * .3, gx = px, gy = py, rot = 0;
const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * S; cv.height = H * S; };
addEventListener('resize', resize); resize();
if (!still) addEventListener('pointermove', e => { mx = e.clientX / W * 2 - 1; my = e.clientY / H * 2 - 1; px = e.clientX; py = e.clientY; });

// dots on a sphere stored flat as [longitude, cos(lat), sin(lat)]
const grid = (step, test = () => true) => {
  const a = [];
  for (let la = -88; la <= 88; la += step) for (let lo = -180; lo < 180; lo += step) if (test(lo, la)) a.push(lo * Math.PI / 180, Math.cos(la * Math.PI / 180), Math.sin(la * Math.PI / 180));
  return Float32Array.from(a);
};
let sea = grid(6), land = new Float32Array(0);

(async () => {
  try {
    const [{ feature }, topo] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm'),
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json').then(r => r.json())
    ]);
    const f = feature(topo, topo.objects.land), c = document.createElement('canvas'); c.width = 360; c.height = 180;
    const x = c.getContext('2d'); x.fillStyle = '#000';
    (f.features ? f.features.map(q => q.geometry) : [f.geometry]).forEach(geo => (geo.type === 'Polygon' ? [geo.coordinates] : geo.coordinates).forEach(poly => {
      x.beginPath(); poly.forEach(r => { r.forEach(([lo, la], i) => x[i ? 'lineTo' : 'moveTo'](lo + 180, 90 - la)); x.closePath(); }); x.fill('evenodd');
    }));
    const d = x.getImageData(0, 0, 360, 180).data;
    land = grid(2, (lo, la) => d[((Math.min(179, Math.floor(90 - la)) * 360) + Math.min(359, Math.floor(lo + 180))) * 4 + 3] > 100);
    if (still) frame();
  } catch (e) { console.warn('Globe land data not loaded', e); }
})();

function frame() {
  sx += (mx - sx) * .05; sy += (my - sy) * .05; gx += (px - gx) * .09; gy += (py - gy) * .09;
  if (!still) rot += .0014 + sx * .0035; // moving the pointer left/right changes the spin
  const dark = document.body.dataset.theme !== 'light', w = W * S, h = H * S;
  const R = Math.min(w * .55, h * .62), cx = w / 2 - sx * w * .02, cy = h * .93 - sy * h * .02, tilt = .38 + sy * .15, ct = Math.cos(tilt), st = Math.sin(tilt);
  g.clearRect(0, 0, w, h);
  let gr = g.createRadialGradient(cx, cy, R * .9, cx, cy, R * 1.2);
  gr.addColorStop(0, dark ? 'rgba(92,225,230,.4)' : 'rgba(40,110,255,.3)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R * 1.2, 0, 7); g.fill();
  gr = g.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R);
  gr.addColorStop(0, dark ? 'rgba(60,140,255,.42)' : 'rgba(255,255,255,.8)'); gr.addColorStop(1, dark ? 'rgba(10,25,90,.6)' : 'rgba(90,140,255,.4)');
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
  const dots = (a, size, rgb, alphas) => {
    const P = [new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < a.length; i += 3) {
      const l = a[i] + rot, c = a[i + 1], s = a[i + 2], z0 = c * Math.cos(l), y = s * ct - z0 * st, z = s * st + z0 * ct;
      if (z <= 0) continue;
      const d = size * (.55 + .45 * z); P[z < .35 ? 0 : z < .7 ? 1 : 2].rect(cx + R * c * Math.sin(l) - d / 2, cy - R * y - d / 2, d, d);
    }
    P.forEach((p, k) => { g.fillStyle = `rgba(${rgb},${alphas[k]})`; g.fill(p); });
  };
  dots(sea, R * .012, dark ? '130,190,255' : '40,90,200', [.12, .22, .32]);
  dots(land, R * .029, dark ? '150,238,255' : '15,60,150', dark ? [.2, .38, .58] : [.3, .5, .72]);
  bg.style.setProperty('--mx', sx.toFixed(3)); bg.style.setProperty('--my', sy.toFixed(3));
  bg.style.setProperty('--gx', gx.toFixed(0) + 'px'); bg.style.setProperty('--gy', gy.toFixed(0) + 'px');
  if (!still) requestAnimationFrame(frame);
}
frame();
