import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterController } from "./character-controller";
import {
  createScene,
  createCamera,
  createRenderer,
  createLights,
} from "./scene-setup";
import { loadCharacterModel } from "./character-loader";
import { createTerrain } from "./flat-terrain";
import { loadHouseModel } from "./house-loader";
import { loadTreeModel } from "./tree-loader";

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

createLights(scene);

camera.position.set(0, 40, 50);
controls.target.set(0, 0, 0);

let terrain: THREE.Mesh | undefined; // Explicitly type terrain
let model: THREE.Group | undefined; // Explicitly type model
let characterController: CharacterController | undefined; // Explicitly type characterController

async function initialize() {
  terrain = await createTerrain(scene);
  model = await loadCharacterModel("/character.glb", scene);

  await loadHouseModel("/house.glb", scene, 10, 0, 10, 0, -10);
  await loadHouseModel("/huts.glb", scene, 7, 30, -5, 0, -12);

  await loadHouseModel("/trees-cut.glb", scene, 5, 17, 3, 0, -15);

  await loadTreeModel("/pine-trees.glb", scene, -25, 0, -10);
  await loadTreeModel("/pine-trees.glb", scene, -25, 0, 10);
  await loadTreeModel("/pine-trees.glb", scene, -5, 0, 20);
  await loadTreeModel("/pine-trees.glb", scene, 25, 0, 20);
  await loadTreeModel("/pine-trees.glb", scene, 30, 0, -15);
  await loadTreeModel("/pine-trees.glb", scene, 25, 0, -35);
  await loadTreeModel("/pine-trees.glb", scene, 5, 0, -35);
  await loadTreeModel("/pine-trees.glb", scene, -25, 0, -30);

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
