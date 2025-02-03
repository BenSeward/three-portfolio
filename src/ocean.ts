import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  Vector3,
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  MathUtils,
  Clock,
} from "three";

export function createLowPolyOcean(
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera
) {
  let clock = new Clock();
  let g = new PlaneGeometry(1000, 1000, 15, 15);

  g.rotateX(-Math.PI * 0.5);

  let vertData = [];
  let v3 = new Vector3(); // for re-use

  for (let i = 0; i < g.attributes.position.count; i++) {
    v3.fromBufferAttribute(g.attributes.position, i);
    vertData.push({
      initH: v3.y,
      amplitude: MathUtils.randFloatSpread(2),
      phase: MathUtils.randFloat(0, Math.PI),
    });
  }

  let m = new MeshStandardMaterial({
    color: "aqua",
    flatShading: false,
  });

  let o = new Mesh(g, m);
  o.position.y = -2;

  scene.add(o);

  // Add lights (essential for shadows)
  const dirLight = new DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(0, 1000, 0); // Adjust light position
  dirLight.castShadow = true; // Light casts shadows
  dirLight.shadow.mapSize.width = 2048; // Increase shadow resolution
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  const ambientLight = new AmbientLight(0x404040); // Add some ambient light
  scene.add(ambientLight);

  renderer.setAnimationLoop(() => {
    let time = clock.getElapsedTime();

    vertData.forEach((vd, idx) => {
      let y = vd.initH + Math.sin(time + vd.phase) * vd.amplitude;
      g.attributes.position.setY(idx, y);
    });
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();

    renderer.render(scene, camera);
  });
}
