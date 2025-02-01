import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadCharacterModel(modelPath, scene) {
  return new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);

        const mesh = model.getObjectByName("Root_Scene"); // Replace with your mesh's name
        if (mesh) {
          mesh.rotation.y += Math.PI / 2;
        } else {
          console.error("Mesh not found! Check the name.");
          console.log(model);
        }

        scene.add(model);
        resolve(model); // Resolve the promise with the loaded model
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(Math.round(percentComplete, 2) + "% downloaded");
        }
      },
      (error) => {
        reject(error); // Reject the promise if there's an error
      }
    );
  });
}
