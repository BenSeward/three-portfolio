/* eslint-disable @typescript-eslint/no-explicit-any */
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface UseGLTF extends GLTF {
  nodes: any;
  materials: { [key: string]: THREE.Material };
  animations: any;
}
