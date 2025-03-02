import * as THREE from "three";

const Sky = () => {
  const uniforms = {
    topColor: { value: new THREE.Color("#bfdeff") }, // Red at the top
    bottomColor: { value: new THREE.Color("#52a4fa") }, // Blue at ground level
    offset: { value: 1 },
    exponent: { value: 1.5 },
  };

  return (
    <mesh scale={100} rotation={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        attach="material"
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition).y * 0.5 + 0.5;
            gl_FragColor = vec4(mix(bottomColor, topColor, pow(h, exponent)), 1.0);
          }
        `}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

export default Sky;
