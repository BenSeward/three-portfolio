import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterController } from "./character-controller";
import {
  createScene,
  createCamera,
  createRenderer,
  createLights,
  createGrid,
} from "./scene-setup";
import { loadCharacterModel } from "./model-loader";

// Initialize core components
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
createLights(scene);
createGrid(scene);

// Model Loading and Character Controller
let characterController;

loadCharacterModel("/character.glb", scene)
  .then((characterModel) => {
    characterController = new CharacterController(
      characterModel,
      camera,
      controls
    );
    console.log("Model loaded and controller initialized!");
  })
  .catch((error) => {
    console.error("Error loading model:", error);
  });

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
