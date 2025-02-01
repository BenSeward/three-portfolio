import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterController } from "./character-controller";
import {
  createScene,
  createCamera,
  createRenderer,
  createLights,
} from "./scene-setup";
import { loadCharacterModel } from "./model-loader";
import { createTerrain } from "./terrain-generator";

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

createLights(scene);

camera.position.set(0, 10, 20);
controls.target.set(0, 0, 0);

let terrain: THREE.Mesh | undefined; // Explicitly type terrain
let model: THREE.Group | undefined; // Explicitly type model
let characterController: CharacterController | undefined; // Explicitly type characterController

async function initialize() {
  terrain = await createTerrain(scene);
  model = await loadCharacterModel("/character.glb", scene);

  if (model && terrain) {
    characterController = new CharacterController(
      model,
      camera,
      controls,
      terrain
    );
  } else {
    console.error("Failed to load terrain or model.");
  }

  console.log("Terrain and model loaded!");
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (characterController) {
    characterController.update();
  }

  controls.update();
  renderer.render(scene, camera);
}

document.body.appendChild(renderer.domElement);

initialize(); // Call the initialization function
