import * as THREE from "three";

export function createTerrain(scene) {
  return new Promise((resolve) => {
    const geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    geometry.rotateX(-Math.PI / 2); // Ensure the plane is properly oriented

    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
      wireframe: true, // Useful for debugging terrain shape
    });
    const terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    const vertices = geometry.attributes.position.array;
    const widthSegments = 100;
    const heightSegments = 100;

    for (let j = 0; j <= heightSegments; j++) {
      for (let i = 0; i <= widthSegments; i++) {
        const vertexIndex = (j * (widthSegments + 1) + i) * 3;

        const x = -100 + (i / widthSegments) * 200;
        const z = -100 + (j / heightSegments) * 200;

        let y = 0;

        y += hillFunction(x, z, 100, 12.5, 50, -50);

        vertices[vertexIndex + 1] = y;
      }
    }

    geometry.attributes.position.needsUpdate = true; // Ensure changes are reflected
    geometry.computeVertexNormals(); // Improve shading
    resolve(terrain);
  });
}

function hillFunction(x, z, width, height, centerX, centerZ) {
  const distance = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
  if (distance < width) {
    return height * Math.cos((distance / width) * Math.PI);
  } else {
    return 0;
  }
}
