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
  camera.position.set(0, 5, 10);
  return camera;
}

export function createRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  return renderer;
}

export function createLights(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Slightly reduced ambient light
  scene.add(ambientLight);

  // Sun (using a DirectionalLight)
  const sunLight = new THREE.DirectionalLight(0xffffe0, 1); // Warm yellowish light for the sun
  sunLight.position.set(20, 30, -10); // Position the sun (adjust as needed)
  sunLight.castShadow = true;

  sunLight.shadow.mapSize.width = 4096;
  sunLight.shadow.mapSize.height = 4096;
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 100; // Increased far plane for the sun's light
  sunLight.shadow.bias = -0.0005;

  scene.add(sunLight);

  // Hemisphere Light (Adjusted to complement the sun)
  const hemisphereLight = new THREE.HemisphereLight(0xbbd4ff, 0x99aaaf, 0.4); // Adjusted intensity
  scene.add(hemisphereLight);

  // Optional: Add a visual representation of the sun (a sphere)
  const sunGeometry = new THREE.SphereGeometry(3, 32, 32); // Radius, width segments, height segments
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffd0 }); // Slightly less intense yellow
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.copy(sunLight.position); // Position the sphere at the light's position
  scene.add(sun);
}
