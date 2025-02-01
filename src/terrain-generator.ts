import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/Addons.js";

export function createTerrain(scene: THREE.Scene): Promise<THREE.Mesh> {
  return new Promise<THREE.Mesh>((resolve) => {
    const width = 2000;
    const height = 2000;
    const widthSegments = 100;
    const heightSegments = 100;

    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );
    geometry.rotateX(-Math.PI / 2);

    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load("/grass.jpg"); // Replace with your texture path
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(150, 150); // Adjust tiling as needed

    const detailTexture = textureLoader.load("/path/to/grass_detail.jpg"); // Path to your detail texture
    detailTexture.wrapS = THREE.RepeatWrapping;
    detailTexture.wrapT = THREE.RepeatWrapping;
    detailTexture.repeat.set(5, 5); // More tiling for detail texture

    const material = new THREE.MeshStandardMaterial({
      map: grassTexture,
      normalMap: detailTexture, // Use detail texture as normal map
      side: THREE.DoubleSide,
      // wireframe: true, // Uncomment for debugging
    });

    const terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    const vertices = geometry.attributes.position.array;
    const simplex = new SimplexNoise(); // Seed for consistent terrain

    if (vertices) {
      for (let j = 0; j <= heightSegments; j++) {
        for (let i = 0; i <= widthSegments; i++) {
          const vertexIndex = (j * (widthSegments + 1) + i) * 3;

          const x = -width / 2 + (i / widthSegments) * width;
          const z = -height / 2 + (j / heightSegments) * height;

          const scale = 5;
          const frequency = 0.02;
          const heightScale = 10;

          let y = heightScale * simplex.noise(x * frequency, z * frequency);

          const octaves = 3;
          for (let o = 1; o <= octaves; o++) {
            const f = frequency * Math.pow(2, o);
            const s = scale / Math.pow(2, o);
            y += s * simplex.noise(x * f, z * f);
          }

          vertices[vertexIndex + 1] = y;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    } else {
      console.error("Vertices array is undefined!");
    }

    resolve(terrain);
  });
}
