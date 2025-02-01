import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterController } from "./character-controller";

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xadd8e6);
document.body.appendChild(renderer.domElement);

// Orbit Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Grid Helper
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

// Model Loading and Character Controller
let characterModel;
let characterController;

const gltfLoader = new GLTFLoader();

gltfLoader.load(
  "/character.glb",
  (gltf) => {
    characterModel = gltf.scene;
    characterModel.scale.set(0.5, 0.5, 0.5);

    // Rotate the mesh within the model (Corrected and improved)
    const mesh = characterModel.getObjectByName("YourMeshName"); // ***REPLACE "YourMeshName"***
    if (mesh) {
      mesh.rotation.y += Math.PI / 2;
    } else {
      console.error("Mesh not found! Check the name.");
      console.log(characterModel); // Inspect in browser console to find mesh name
    }

    scene.add(characterModel);
    characterController = new CharacterController(
      characterModel,
      camera,
      controls
    );
    console.log("Model loaded successfully!");
  },
  (xhr) => {
    // Optional: Add a loading progress callback
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  },
  (error) => {
    console.error("Error loading model:", error);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (characterController) {
    characterController.update();
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
