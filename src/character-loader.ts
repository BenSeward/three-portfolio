import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadCharacterModel(
  modelPath: string,
  scene: THREE.Scene
): Promise<THREE.Group> {
  return new Promise<THREE.Group>((resolve, reject) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      modelPath,
      (gltf) => {
        const model: THREE.Group = gltf.scene; // Type the model
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(-85, 1.6, 2.1);

        const mesh = model.getObjectByName("Root_Scene");
        if (mesh instanceof THREE.Mesh) {
          // Type guard for mesh
          mesh.rotation.y += Math.PI / 2;
        } else {
          console.error("Mesh not found or is not a Mesh! Check the name.");
        }

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
