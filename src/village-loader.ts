import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function findGroundMesh(
  object: THREE.Object3D,
  groundName: string
): THREE.Mesh | undefined {
  if (object.name === groundName && object instanceof THREE.Mesh) {
    return object;
  }

  for (const child of object.children) {
    const found = findGroundMesh(child, groundName);
    if (found) {
      return found;
    }
  }

  return undefined;
}

export function loadVillageModel(scene: THREE.Scene): Promise<THREE.Group> {
  return new Promise<THREE.Group>((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      "/village.glb",
      (gltf) => {
        const village = gltf.scene;
        scene.add(village);

        const groundName = "Object_13"; // ***REPLACE with the actual name***
        const ground = findGroundMesh(village, groundName);

        if (!ground) {
          console.error(
            `Ground mesh with name "${groundName}" not found in GLTF!`
          );
          reject(new Error(`Ground mesh with name "${groundName}" not found`));
          return;
        }

        // ground.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Debug: Uncomment to see the ground

        resolve(village);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading GLTF:", error); // More descriptive error message
        reject(error);
      }
    );
  });
}
