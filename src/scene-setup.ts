import * as THREE from "three";

export function createScene(): THREE.Scene {
  return new THREE.Scene();
}

export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);
  return camera;
}

export function createRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xadd8e6);
  return renderer;
}

export function createLights(scene: THREE.Scene): void {
  // 1. Ambient Light (Less yellow, brighter)
  const ambientLight = new THREE.AmbientLight(0xf8f8ff, 0.8); // Very slightly blueish, increased intensity
  scene.add(ambientLight);

  // 2. Directional Light (Less yellow, brighter, higher position)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Pure white, very bright
  directionalLight.position.set(8, 8, 8); // Higher position for softer shadows
  directionalLight.castShadow = true;

  scene.add(directionalLight);

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.01;
  directionalLight.shadow.camera.far = 1000;

  // 3. Hemisphere Light (More blue sky, less green ground)
  const hemisphereLight = new THREE.HemisphereLight(0xadd8e6, 0xb0c4de, 1.0); // Light blue sky, light steel blue ground
  scene.add(hemisphereLight);
}
