import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Color4,
  Animation,
  CubicEase,
  EasingFunction,
  Matrix,
} from "@babylonjs/core";
import { createGaussianSplattingFromSpzUrl } from "@spz-loader/babylonjs";

const canvas    = document.getElementById("renderCanvas");
const overlay   = document.getElementById("overlay");
const statusEl  = document.getElementById("status");
const errorBox  = document.getElementById("error-box");
const errorMsg  = document.getElementById("error-msg");
const btnAuto   = document.getElementById("btn-auto");
const btnZoomIn = document.getElementById("btn-zoom-in");
const btnZoomOut= document.getElementById("btn-zoom-out");
const btnReset  = document.getElementById("btn-reset");

// ── tunables ──────────────────────────────────────────────────────────────────
const AUTO_ROTATE_SPEED = 0.004;   // radians per frame
const ZOOM_STEP         = 0.75;    // multiply radius on each button click
const RESUME_DELAY_MS   = 2500;    // pause auto-rotate after user input (ms)
// ─────────────────────────────────────────────────────────────────────────────

async function init() {
  // Engine & Scene
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.04, 0.04, 0.06, 1);

  // Camera
  const camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI - Math.PI / 2.8, 5, Vector3.Zero(), scene);
  // No radius limits — scroll all the way in or out
  camera.lowerRadiusLimit  = null;
  camera.upperRadiusLimit  = null;
  // No vertical limits — full top-to-bottom flip
  camera.lowerBetaLimit    = null;
  camera.upperBetaLimit    = null;
  camera.wheelDeltaPercentage = 0.015;
  camera.pinchDeltaPercentage = 0.015;
  camera.attachControl(canvas, true);

  // Ambient light
  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // ── Auto-rotation state ───────────────────────────────────────────────────
  let autoRotate    = true;
  let resumeTimer   = null;
  let defaultRadius = 5;
  let defaultAlpha  = -Math.PI / 2;
  let defaultBeta   = Math.PI - Math.PI / 2.8;
  let defaultTarget = Vector3.Zero();

  function pauseAutoRotate() {
    autoRotate = false;
    btnAuto.classList.remove("active");
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      autoRotate = true;
      btnAuto.classList.add("active");
    }, RESUME_DELAY_MS);
  }

  // pause on any pointer/wheel interaction
  canvas.addEventListener("pointerdown", pauseAutoRotate);
  canvas.addEventListener("wheel", pauseAutoRotate);

  // ── Button handlers ───────────────────────────────────────────────────────
  btnAuto.addEventListener("click", () => {
    clearTimeout(resumeTimer);
    autoRotate = !autoRotate;
    btnAuto.classList.toggle("active", autoRotate);
  });

  btnZoomIn.addEventListener("click", () => {
    animateRadius(camera.radius * ZOOM_STEP);
  });

  btnZoomOut.addEventListener("click", () => {
    animateRadius(camera.radius / ZOOM_STEP);
  });

  btnReset.addEventListener("click", () => {
    animateCamera(defaultAlpha, defaultBeta, defaultRadius, defaultTarget);
    autoRotate = true;
    btnAuto.classList.add("active");
  });

  // ── Animated zoom helper ──────────────────────────────────────────────────
  function animateRadius(targetRadius) {
    targetRadius = Math.max(0.01, targetRadius); // only prevent going negative
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

    Animation.CreateAndStartAnimation(
      "zoomAnim", camera, "radius",
      60, 20,
      camera.radius, targetRadius,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      ease
    );
    pauseAutoRotate();
  }

  function animateCamera(alpha, beta, radius, target) {
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    const frames = 40;

    Animation.CreateAndStartAnimation("resetAlpha",  camera, "alpha",  60, frames, camera.alpha,  alpha,  Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
    Animation.CreateAndStartAnimation("resetBeta",   camera, "beta",   60, frames, camera.beta,   beta,   Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
    Animation.CreateAndStartAnimation("resetRadius", camera, "radius", 60, frames, camera.radius, radius, Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
    Animation.CreateAndStartAnimation("resetTargetX", camera.target, "x", 60, frames, camera.target.x, target.x, Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
    Animation.CreateAndStartAnimation("resetTargetY", camera.target, "y", 60, frames, camera.target.y, target.y, Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
    Animation.CreateAndStartAnimation("resetTargetZ", camera.target, "z", 60, frames, camera.target.z, target.z, Animation.ANIMATIONLOOPMODE_CONSTANT, ease);
  }

  // ── Load SPZ ──────────────────────────────────────────────────────────────
  statusEl.textContent = "Decoding splat…";

  try {
    const splat = await createGaussianSplattingFromSpzUrl("/scene.spz", scene);

    scene.executeWhenReady(() => {
      if (splat?.getBoundingInfo) {
        const bounds  = splat.getBoundingInfo().boundingBox;
        const centre  = bounds.centerWorld.clone();
        const extents = bounds.extendSizeWorld;
        const radius  = Math.max(extents.x, extents.y, extents.z) * 2.8;

        camera.target = centre;
        camera.radius = Math.max(radius, 1);

        // save defaults for reset
        defaultAlpha  = camera.alpha;
        defaultBeta   = camera.beta;
        defaultRadius = camera.radius;
        defaultTarget = centre.clone();

        // place petal label anchors
        initLabelAnchors(centre, Math.max(extents.x, extents.y, extents.z));
      }

      overlay.classList.add("hidden");
      btnAuto.classList.add("active");
    });
  } catch (err) {
    console.error("SPZ load error:", err);
    overlay.classList.add("hidden");
    errorBox.classList.add("visible");
    errorMsg.textContent = String(err?.message ?? err) || "Unknown error loading the splat file.";
  }

  // ── Petal labels ──────────────────────────────────────────────────────────
  const PETAL_LABELS = [
    { name: "VS Code Extension",              angle: 0 },
    { name: "IDE",                            angle: Math.PI * 2 / 5 },
    { name: "TUI\nTerminal User Interface",   angle: Math.PI * 4 / 5 },
    { name: "CLI\nCommand Line Interface",    angle: Math.PI * 6 / 5 },
    { name: "MCP\nModel Context Protocol",   angle: Math.PI * 8 / 5 },
  ];

  // Container that sits over the canvas
  const labelContainer = document.createElement("div");
  labelContainer.id = "petal-labels";
  labelContainer.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;
  `;
  document.getElementById("canvas-container").appendChild(labelContainer);

  // Build one label element per petal
  const labelEls = PETAL_LABELS.map((p) => {
    const el = document.createElement("div");
    el.className = "petal-label";
    el.innerHTML = p.name.replace(/\n/g, "<br>");
    el.style.cssText = `
      position: absolute;
      transform: translate(-50%, -50%);
      pointer-events: none;
      text-align: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.6px;
      line-height: 1.4;
      color: #ffffff;
      text-shadow:
        0 0 6px #ffffff,
        0 0 14px rgba(212,170,255,1),
        0 0 28px rgba(212,170,255,0.8),
        0 2px 4px rgba(0,0,0,1);
      white-space: nowrap;
      opacity: 0;
    `;
    labelContainer.appendChild(el);
    return { el, angle: p.angle, world: null };
  });


  // Called once the splat bounds are known — place anchors around the flower
  function initLabelAnchors(centre, radius) {
    const petalRadius = radius * 0.72;   // sits near the outer edge of petals
    const petalHeight = centre.y + radius * 0.08;

    labelEls.forEach((item) => {
      item.world = new Vector3(
        centre.x + Math.cos(item.angle) * petalRadius,
        petalHeight,
        centre.z + Math.sin(item.angle) * petalRadius
      );
      item.el.style.opacity = "1";
    });
  }

  // Project 3D → 2D each frame, and hide labels that are behind the flower
  function updateLabelPositions() {
    if (!labelEls[0].world) return;

    const viewport  = camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
    const transform = scene.getTransformMatrix();

    labelEls.forEach(({ el, world }) => {
      // Project to screen
      const projected = Vector3.Project(world, Matrix.Identity(), transform, viewport);
      el.style.left = `${projected.x}px`;
      el.style.top  = `${projected.y}px`;

      // Visibility: compare horizontal angle of label vs camera
      // same side as camera → front (show), opposite side → back (hide)
      const camPos  = camera.position;
      const centre  = camera.target;
      const dx = world.x - centre.x;
      const dz = world.z - centre.z;
      const cx = camPos.x - centre.x;
      const cz = camPos.z - centre.z;
      const sideDot = dx * cx + dz * cz;

      const scale = Math.sqrt(cx * cx + cz * cz) * 0.25;
      const t     = Math.max(0, Math.min(1, sideDot / scale + 0.5));
      el.style.opacity = t.toFixed(3);
    });
  }

  // ── Render loop ───────────────────────────────────────────────────────────
  engine.runRenderLoop(() => {
    if (autoRotate) {
      camera.alpha += AUTO_ROTATE_SPEED;
    }
    scene.render();
    updateLabelPositions();
  });

  window.addEventListener("resize", () => engine.resize());
}

init();
