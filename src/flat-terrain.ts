import * as THREE from "three";

export function createTerrain(scene: THREE.Scene): Promise<THREE.Mesh> {
  return new Promise<THREE.Mesh>((resolve) => {
    const width = 2000;
    const height = 2000;

    const geometry = new THREE.PlaneGeometry(width, height, 1, 1); // Simplified plane

    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load("/grass.jpg");
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(150, 150);

    const detailTexture = textureLoader.load("/path/to/grass_detail.jpg");
    detailTexture.wrapS = THREE.RepeatWrapping;
    detailTexture.wrapT = THREE.RepeatWrapping;
    detailTexture.repeat.set(5, 5);

    const material = new THREE.MeshStandardMaterial({
      map: grassTexture,
      normalMap: detailTexture,
      side: THREE.DoubleSide,
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    scene.add(terrain);

    resolve(terrain);
  });
}
