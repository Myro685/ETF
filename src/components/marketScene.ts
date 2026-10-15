import {
  AmbientLight,
  BoxGeometry,
  Box3,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  PCFShadowMap,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  WebGLRenderer,
  Vector3,
} from "three";

// Imported only when the illustration approaches the viewport.
export function createMarketScene(element: HTMLDivElement) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  element.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(-5, 5, 4, -4, 0.1, 50);
  camera.position.set(7, 9, 12);
  camera.lookAt(0, 0, 0);
  scene.add(new AmbientLight(0xffffff, 2.1));

  const light = new DirectionalLight(0xffffff, 3.2);
  light.position.set(-4, 8, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -7;
  light.shadow.camera.right = 7;
  light.shadow.camera.top = 7;
  light.shadow.camera.bottom = -7;
  light.shadow.normalBias = 0.05;
  scene.add(light);

  const materials = [
    new MeshStandardMaterial({ color: "#203a30", roughness: 0.84 }),
    new MeshStandardMaterial({ color: "#e0e8e1", roughness: 0.9 }),
    new MeshStandardMaterial({ color: "#39725a", roughness: 0.85 }),
  ];
  const geometry = new BoxGeometry(1, 1, 1);
  const blocks: { mesh: Mesh; height: number; base: number; delay: number }[] = [];
  function box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    material: number,
    delay?: number,
  ) {
    const mesh = new Mesh(geometry, materials[material]);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    if (delay !== undefined) blocks.push({ mesh, height: h, base: y - h / 2, delay });
  }

  [-2.7, 0, 2.7].forEach((x) => box(x, -0.3, 0, 2.35, 0.16, 3.1, 1));
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      box(-2.7 + (c - 0.5) * 1.04, 0.32, r * 0.96 - 0.96, 0.92, 1.08, 0.84, 0, (r * 2 + c) * 50);
    }
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const height = 0.38 + ((r + c) % 3) * 0.17;
      box(
        (c - 1) * 0.7,
        -0.22 + height / 2,
        r * 0.71 - 1.07,
        0.59,
        height,
        0.59,
        (r + c) % 3 === 0 ? 0 : 1,
        150 + (r * 3 + c) * 50,
      );
    }
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if ((r + c) % 2 === 0)
        box(2.7 + (c - 1) * 0.68, 0.13, r * 0.92 - 0.92, 0.54, 0.7, 0.73, 2, 300 + Math.floor((r * 3 + c) / 2) * 50);
    }
  }

  // Fit the complete, fully raised illustration rather than a fixed width.
  // The shadow floor is deliberately excluded from these bounds.
  camera.updateMatrixWorld();
  const viewBounds = new Box3();
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const bounds = new Box3().setFromObject(object);
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          viewBounds.expandByPoint(new Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
        }
      }
    }
  });
  const horizontalExtent = (viewBounds.max.x - viewBounds.min.x) / 2;
  const verticalExtent = (viewBounds.max.y - viewBounds.min.y) / 2;
  const centerX = (viewBounds.max.x + viewBounds.min.x) / 2;
  const centerY = (viewBounds.max.y + viewBounds.min.y) / 2 - 0.12;

  const floorGeometry = new PlaneGeometry(200, 200);
  const floorMaterial = new ShadowMaterial({ opacity: 0.15 });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.39;
  floor.receiveShadow = true;
  scene.add(floor);

  // Finite, once-per-mount extrusion: actual mesh transforms, not DOM layout.
  // Same strong ease-out as --cl-ease. Fifty ms stagger; 650 ms per block.
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const duration = 650;
  const total = Math.max(...blocks.map((block) => block.delay)) + duration;
  let elapsed = motion.matches ? total : 0;
  let lastTime: number | undefined;
  let frame = 0;
  let contextLost = false;
  let disposed = false;
  let visible = false;
  let sizeDirty = true;

  function easeOut(progress: number) {
    if (progress <= 0 || progress >= 1) return progress;
    // Invert cubic-bezier(.23, 1, .32, 1)'s x component.
    let low = 0;
    let high = 1;
    for (let i = 0; i < 14; i++) {
      const t = (low + high) / 2;
      const x = 3 * (1 - t) ** 2 * t * 0.23 + 3 * (1 - t) * t ** 2 * 0.32 + t ** 3;
      if (x < progress) low = t;
      else high = t;
    }
    return 1 - (1 - (low + high) / 2) ** 3;
  }

  function pose() {
    for (const { mesh, height, base, delay } of blocks) {
      const progress = easeOut(Math.max(0, Math.min(1, (elapsed - delay) / duration)));
      const risenHeight = height * (0.1 + 0.9 * progress);
      mesh.scale.y = risenHeight;
      mesh.position.y = base + risenHeight / 2;
    }
    element.dataset.motion = elapsed >= total ? "complete" : "entering";
  }

  function draw(time: number) {
    frame = 0;
    if (disposed || contextLost || document.hidden || !visible) {
      lastTime = undefined;
      return;
    }
    if (sizeDirty) {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      const halfWidth = Math.max(horizontalExtent * 1.12, verticalExtent * (width / height) * 1.18);
      const halfHeight = (halfWidth * height) / width;
      camera.left = centerX - halfWidth;
      camera.right = centerX + halfWidth;
      camera.top = centerY + halfHeight;
      camera.bottom = centerY - halfHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      sizeDirty = false;
    }
    if (lastTime !== undefined) elapsed = Math.min(total, elapsed + time - lastTime);
    lastTime = time;
    pose();
    renderer.render(scene, camera);
    element.dataset.rendered = "true";
    if (elapsed < total) scheduleDraw();
    else lastTime = undefined;
  }
  function scheduleDraw() {
    if (!disposed && !frame && !contextLost && visible && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  function pause() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = undefined;
  }
  const observer = new ResizeObserver(() => {
    sizeDirty = true;
    scheduleDraw();
  });
  observer.observe(element);
  const viewport = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) scheduleDraw();
    else pause();
  });
  viewport.observe(element);
  const visibilityChanged = () => {
    if (document.hidden) pause();
    else scheduleDraw();
  };
  const preferenceChanged = () => {
    // Enabling reduced motion completes the illustration; disabling never replays it.
    if (motion.matches) {
      elapsed = total;
      pose();
      scheduleDraw();
    }
  };
  const lost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    pause();
    element.dataset.rendered = "false";
  };
  const restored = () => {
    contextLost = false;
    sizeDirty = true;
    scheduleDraw();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  renderer.domElement.addEventListener("webglcontextrestored", restored);
  document.addEventListener("visibilitychange", visibilityChanged);
  motion.addEventListener("change", preferenceChanged);
  pose();

  return () => {
    disposed = true;
    observer.disconnect();
    viewport.disconnect();
    pause();
    document.removeEventListener("visibilitychange", visibilityChanged);
    motion.removeEventListener("change", preferenceChanged);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    renderer.domElement.removeEventListener("webglcontextrestored", restored);
    geometry.dispose();
    materials.forEach((material) => material.dispose());
    floorGeometry.dispose();
    floorMaterial.dispose();
    light.shadow.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    element.dataset.rendered = "false";
  };
}
