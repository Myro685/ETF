import {
  AmbientLight,
  BoxGeometry,
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
    new MeshStandardMaterial({ color: "#242a23", roughness: 0.84 }),
    new MeshStandardMaterial({ color: "#d9d7c7", roughness: 0.9 }),
    new MeshStandardMaterial({ color: "#70794c", roughness: 0.85 }),
  ];
  const geometry = new BoxGeometry(1, 1, 1);
  function box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    material: number,
  ) {
    const mesh = new Mesh(geometry, materials[material]);
    mesh.position.set(x, y, z);
    mesh.scale.set(w, h, d);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  [-2.7, 0, 2.7].forEach((x) => box(x, -0.3, 0, 2.35, 0.16, 3.1, 1));
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      box(-2.7 + (c - 0.5) * 1.04, 0.32, r * 0.96 - 0.96, 0.92, 1.08, 0.84, 0);
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
      );
    }
  }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if ((r + c) % 2 === 0)
        box(2.7 + (c - 1) * 0.68, 0.13, r * 0.92 - 0.92, 0.54, 0.7, 0.73, 2);
    }
  }

  const floorGeometry = new PlaneGeometry(200, 200);
  const floorMaterial = new ShadowMaterial({ opacity: 0.15 });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.39;
  floor.receiveShadow = true;
  scene.add(floor);

  let frame = 0;
  let contextLost = false;
  function draw() {
    frame = 0;
    if (contextLost || document.hidden) return;
    const { width, height } = element.getBoundingClientRect();
    if (!width || !height) return;
    const halfWidth = 4.8;
    const halfHeight = (halfWidth * height) / width;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
    element.dataset.rendered = "true";
  }
  // One frame per batch of resize events, no continuous animation loop.
  function scheduleDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  const observer = new ResizeObserver(scheduleDraw);
  observer.observe(element);
  const lost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    element.dataset.rendered = "false";
  };
  const restored = () => {
    contextLost = false;
    scheduleDraw();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  renderer.domElement.addEventListener("webglcontextrestored", restored);
  document.addEventListener("visibilitychange", scheduleDraw);
  scheduleDraw();

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", scheduleDraw);
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
