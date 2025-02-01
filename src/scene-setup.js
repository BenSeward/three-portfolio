import * as THREE from "three";

export function createScene() {
  return new THREE.Scene();
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);
  return camera;
}

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xadd8e6);
  return renderer;
}

export function createLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
}

export function createGrid(scene) {
  const gridSize = 100;
  const gridDivisions = 10;
  const gridHelper = new THREE.GridHelper(
    gridSize,
    gridDivisions,
    0x008000,
    0x008000
  );
  gridHelper.position.y = -0.1;
  scene.add(gridHelper);
}
