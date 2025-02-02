import * as THREE from "three";
import { CharacterController } from "./character-controller";
import {
  createScene,
  createCamera,
  createRenderer,
  createLights,
} from "./scene-setup";
import { loadCharacterModel } from "./character-loader";
import { loadVillageModel } from "./village-loader";

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

createLights(scene);

let model: THREE.Group | undefined;
let characterController: CharacterController | undefined;
let villageGround: THREE.Mesh | undefined;

async function initialize() {
  try {
    const village = await loadVillageModel(scene);
    model = await loadCharacterModel("/character.glb", scene);

    if (!model) {
      console.error("Failed to load character model.");
      return;
    }

    villageGround = village.children[0].children[0].children.find(
      (child) => child.name === "Object_13"
    ) as THREE.Mesh | undefined; // ***REPLACE "Ground" with the actual name***

    if (!villageGround) {
      console.error("Ground mesh not found in village model!");
      return;
    }

    if (model && villageGround) {
      characterController = new CharacterController(
        model,
        camera,
        villageGround
      );
    } else {
      console.error("Failed to load village or model.");
    }

    console.log("Village and model loaded!");
    animate();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (characterController) {
    characterController.update();
  }

  renderer.render(scene, camera);
}

document.body.appendChild(renderer.domElement);

initialize();
