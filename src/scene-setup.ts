import * as THREE from "three";

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  return scene;
}

export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 15, 30); // Slightly higher and further back
  return camera;
}

export function createRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Recommended: Soft shadows
  return renderer;
}

export function createLights(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Slightly less intense ambient
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffe0, 1);
  sunLight.position.set(50, 100, -50); // Adjusted sun position (more above and behind)
  sunLight.castShadow = true;

  sunLight.shadow.mapSize.width = 50; // High resolution shadows
  sunLight.shadow.mapSize.height = 50;
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 2000; // Increased far plane (important!)

  sunLight.shadow.camera.left = -1000; // CRUCIAL: Shadow camera bounds
  sunLight.shadow.camera.right = 1000; // Adjust these based on your scene size
  sunLight.shadow.camera.top = 1000; // A little larger than your ocean's dimensions
  sunLight.shadow.camera.bottom = -1000;
  sunLight.shadow.bias = -0.0005; // Helps prevent shadow acne

  scene.add(sunLight);

  // Hemisphere Light (for softer overall lighting)
  const hemisphereLight = new THREE.HemisphereLight(0xbbd4ff, 0x99aaaf, 0.3); // Adjusted
  scene.add(hemisphereLight);

  // Optional: Sun sphere (for visualization)
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32); // Slightly larger sphere
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffd0 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.copy(sunLight.position);
  scene.add(sun);
}
