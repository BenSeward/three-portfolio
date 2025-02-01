import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterController } from "./character-controller";

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
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xadd8e6);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

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

let characterModel;
let characterController;

const loader = new GLTFLoader();
loader.load(
  "/character.glb",
  function (gltf) {
    characterModel = gltf.scene;
    characterModel.scale.set(0.5, 0.5, 0.5);

    // *** The REAL fix: Rotate the mesh within the model ***
    const mesh = characterModel.getObjectByName("YourMeshName"); // ***REPLACE "YourMeshName"***
    if (mesh) {
      mesh.rotation.y += Math.PI / 2; // Or -Math.PI/2, or Math.PI, or -Math.PI as needed
    } else {
      console.error("Mesh not found! Check the name.");
      // If the mesh isn't found, you can log the entire model to the console
      console.log(characterModel); //Inspect in browser console to find mesh name
    }

    scene.add(characterModel);
    characterController = new CharacterController(
      characterModel,
      camera,
      controls
    );
    console.log("Model loaded successfully!");
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  if (characterController) {
    characterController.update();
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
