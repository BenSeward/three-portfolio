import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadTreeModel(
  modelPath: string,
  scene: THREE.Scene,
  x: number = 0, // Add x position parameter, default 0
  y: number = 0, // Add y position parameter, default 0
  z: number = 0 // Add z position parameter, default 0
): Promise<THREE.Group> {
  return new Promise<THREE.Group>((resolve, reject) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      modelPath,
      (gltf) => {
        const model: THREE.Group = gltf.scene;
        model.scale.set(15, 15, 15);

        const mesh = model.getObjectByName("Root_Scene");
        if (mesh instanceof THREE.Mesh) {
          mesh.rotation.y += Math.PI / 2;
        } else {
          console.error("Mesh not found or is not a Mesh! Check the name.");
          console.log(model);
        }

        // Set the position here, after the model is loaded:
        model.position.set(x, y, z); // Use the provided x, y, z values

        scene.add(model);
        resolve(model);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(Math.round(percentComplete) + "% downloaded");
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}
