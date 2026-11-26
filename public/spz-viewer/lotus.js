// The hero's 3D lotus: the view, a slow turn, and six labels on petal tips.
//
// Runs inside /spz-viewer/index.html, which the home page puts in an iframe
// (src/components/HeroLotus.tsx). The page shows a still image of this same
// view first, and fades this in once it has drawn the lotus ("mochiii-lotus").
import { ArcRotateCamera, Color4, Engine, GaussianSplattingMesh, Scene, Vector3, decodeSpz } from './assets/viewer.js';

// ── THE VIEW: every camera value, in one place ────────────────────────────
// Points are in the coordinates of /scene.spz itself; the mesh is never moved.
// AXIS and CENTRE were measured from the splats (the pink petals' least-spread
// direction, and the middle of the bloom on the line through the stamens).
const VIEW = {
  axis: [-0.0596, -0.995, 0.0801], // the flower's vertical axis, pointing out of the open centre
  centre: [-0.0265, -0.1603, -0.0402], // the middle of the bloom: what the camera looks at
  bloomRadius: 0.4341, // a sphere round the bloom (stem left out); framing keeps it whole
  elevationDeg: 56, // how far above the flower's horizon the camera sits
  startAzimuthDeg: 210, // where around the flower the camera starts (the still image is this view)
  // Framing, as shares of the frame's shorter side, so phones get the same picture:
  fill: 0.806, // the bloom sphere's width
  lift: 0.054, // how far above the middle the flower sits
  fovRad: 0.8, // vertical field of view
};
const TURN_SECONDS = 40; // one full turn, about the flower's vertical axis

// The stem is left out: splats this far below the middle of the bloom (along
// the axis) and this close to the axis. Petals there are much further out.
const STEM = { below: -0.21, within: 0.07 };

// One label per petal, on that petal's tip, in order round the flower.
const LABELS = [
  { text: 'Knows your codebase', tip: [-0.4109, 0.0536, -0.0791] },
  { text: 'VS Code', tip: [-0.1245, -0.0706, -0.4158] },
  { text: 'Terminal app', tip: [0.2227, -0.1948, -0.3767] },
  { text: 'Agent mode', tip: [0.3704, -0.0271, 0.0325] },
  { text: 'Long tasks', tip: [0.1327, -0.262, 0.3171] },
  { text: 'MCP servers', tip: [-0.1997, -0.0835, 0.3738] },
];

// Phones: the page's own width decides (this frame is narrower than the page).
const host = (() => {
  try {
    return window.parent !== window && window.parent.matchMedia ? window.parent : window;
  } catch {
    return window;
  }
})();
const phoneQuery = host.matchMedia('(max-width: 767.98px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const PHONE_MAX_DPR = 1.5;

const canvas = document.getElementById('renderCanvas');
const labelLayer = document.getElementById('labels');
const v3 = (a) => new Vector3(a[0], a[1], a[2]);
const AXIS = v3(VIEW.axis).normalize();
const CENTRE = v3(VIEW.centre);

// The splats (32 bytes each, position first) minus the stem's.
function withoutStem(buffer) {
  const pos = new Float32Array(buffer);
  const src = new Uint8Array(buffer);
  const out = new Uint8Array(buffer.byteLength);
  const count = buffer.byteLength / 32;
  const [ax, ay, az] = [AXIS.x, AXIS.y, AXIS.z];
  let kept = 0;
  for (let i = 0; i < count; i++) {
    const x = pos[i * 8] - CENTRE.x;
    const y = pos[i * 8 + 1] - CENTRE.y;
    const z = pos[i * 8 + 2] - CENTRE.z;
    const h = x * ax + y * ay + z * az;
    if (h < STEM.below && Math.hypot(x - ax * h, y - ay * h, z - az * h) < STEM.within) continue;
    out.set(src.subarray(i * 32, i * 32 + 32), kept++ * 32);
  }
  return out.buffer.slice(0, kept * 32);
}

function tell(ready) {
  if (window.parent !== window) window.parent.postMessage({ type: 'mochiii-lotus', ready }, location.origin);
}

async function main() {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: false, alpha: true });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0);

  const deg = Math.PI / 180;
  const camera = new ArcRotateCamera('cam', VIEW.startAzimuthDeg * deg, (90 - VIEW.elevationDeg) * deg, 2, CENTRE.clone(), scene);
  camera.upVector = AXIS.clone(); // alpha now turns about the flower's own axis
  camera.fov = VIEW.fovRad;
  camera.minZ = 0.01;
  // No camera controls: the view stays as set, and the page scrolls over it.

  // Distance that makes the bloom sphere VIEW.fill of the frame's shorter
  // side, and the shift that lifts it by VIEW.lift of that side. The still
  // image is a square of the same picture, drawn with object-fit: contain.
  function frame() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const side = Math.min(w, h);
    const tanHalf = Math.tan(VIEW.fovRad / 2);
    camera.radius = VIEW.bloomRadius / Math.sin(Math.atan(((VIEW.fill * side) / h) * tanHalf));
    camera.targetScreenOffset.y = ((VIEW.lift * side * 2) / h) * camera.radius * tanHalf;
  }

  function applyDevice() {
    const phone = phoneQuery.matches;
    engine.setHardwareScalingLevel(phone ? 1 / Math.min(window.devicePixelRatio || 1, PHONE_MAX_DPR) : 1);
    document.documentElement.classList.toggle('phone', phone);
    engine.resize();
    frame();
    measure();
  }

  const labels = LABELS.map(({ text, tip }) => {
    const el = document.createElement('div');
    el.className = 'label';
    el.innerHTML = '<span class="dot"></span><span class="pill"></span>';
    el.querySelector('.pill').textContent = text;
    labelLayer.appendChild(el);
    return { el, pill: el.querySelector('.pill'), dot: el.querySelector('.dot'), tip: v3(tip), pw: 0, ph: 0 };
  });
  // Pill sizes change only with the font and the phone size, not per frame.
  function measure() {
    for (const L of labels) {
      L.pw = L.pill.offsetWidth;
      L.ph = L.pill.offsetHeight;
    }
  }
  document.fonts?.ready.then(measure);

  // Where a point lands in the frame, in CSS pixels.
  function project(p, m, w, h) {
    const q = Vector3.TransformCoordinates(p, m);
    return { x: ((q.x + 1) / 2) * w, y: ((1 - q.y) / 2) * h };
  }
  // The part of v at right angles to the axis.
  function flat(v) {
    return v.subtract(AXIS.scale(Vector3.Dot(v, AXIS)));
  }

  function placeLabels() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const m = scene.getTransformMatrix();
    const c = project(CENTRE, m, w, h);
    const toCamera = flat(camera.position.subtract(CENTRE)).normalize();
    const pad = 4;
    for (const L of labels) {
      // Facing: 1 when the petal points at the camera, -1 when it is behind the flower.
      const facing = Vector3.Dot(flat(L.tip.subtract(CENTRE)).normalize(), toCamera);
      const opacity = Math.min(1, Math.max(0, (facing + 0.15) / 0.4));
      const t = project(L.tip, m, w, h);
      L.el.style.opacity = opacity.toFixed(3);
      L.el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
      L.dot.style.transform = `translate(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px)`;
      // The pill sits just outside the tip, away from the middle of the flower,
      // and always wholly inside the frame (so never over the headline).
      let dx = t.x - c.x;
      let dy = t.y - c.y;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const { pw, ph } = L;
      const reach = 8 + Math.abs(dx) * (pw / 2) + Math.abs(dy) * (ph / 2);
      let x = t.x + dx * reach - pw / 2;
      let y = t.y + dy * reach - ph / 2;
      x = Math.min(Math.max(x, pad), w - pw - pad);
      y = Math.min(Math.max(y, pad), h - ph - pad);
      L.pill.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }

  // ── The turn ──
  let angle = 0;
  let last = 0;
  let hover = false;
  document.documentElement.addEventListener('pointerenter', () => (hover = true));
  document.documentElement.addEventListener('pointerleave', () => (hover = false));
  window.addEventListener('blur', () => (hover = false));

  let drawn = 0;
  function render() {
    const now = performance.now();
    const dt = last ? Math.min(now - last, 100) / 1000 : 0;
    last = now;
    if (!hover && !reducedMotion.matches) angle += (dt * 2 * Math.PI) / TURN_SECONDS;
    camera.alpha = VIEW.startAzimuthDeg * deg + angle;
    scene.render();
    placeLabels();
    if (++drawn === 10) tell(true);
  }

  // ── Draw only while the lotus is on screen and the tab is showing ──
  let loaded = false;
  let onScreen = true;
  let running = false;
  function update() {
    const want = loaded && onScreen && !document.hidden;
    if (want && !running) {
      last = 0;
      engine.runRenderLoop(render);
      running = true;
    } else if (!want && running) {
      engine.stopRenderLoop();
      running = false;
    }
  }
  new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    update();
  }).observe(canvas);
  document.addEventListener('visibilitychange', update);

  applyDevice();
  phoneQuery.addEventListener('change', applyDevice);
  window.addEventListener('resize', () => {
    engine.resize();
    frame();
  });

  const all = await decodeSpz(await (await fetch('/scene.spz')).arrayBuffer(), { unpackOptions: { coordinateSystem: 'UNSPECIFIED' } });
  const mesh = new GaussianSplattingMesh('lotus', null, scene);
  await mesh.loadDataAsync(withoutStem(all));
  scene.executeWhenReady(() => {
    loaded = true;
    update();
  });

  // For checks only: ?debug exposes the engine and camera.
  if (/[?&]debug\b/.test(location.search)) window.lotus = { engine, scene, camera, VIEW };
}

main().catch((e) => {
  console.error('lotus:', e);
  tell(false);
});
