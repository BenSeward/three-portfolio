import { useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WaterMaterial } from "./materials/water-material";

extend({ WaterMaterial });

interface WaterBodyProps {
  position: THREE.Vector3;
  waveSpeed?: number;
  waveHeight?: number;
}

const WaterBody: React.FC<WaterBodyProps> = ({
  position,
  waveHeight = 0.09,
  waveSpeed = 0.8,
}) => {
  const waterRef = useRef<THREE.Mesh>(null);
  const { gl, camera, scene } = useThree();

  useEffect(() => {
    const supportsDepth =
      gl.capabilities.isWebGL2 || gl.extensions.get("WEBGL_depth_texture");

    console.log("Depth texture supported:", supportsDepth);
    console.log(
      "WebGL version:",
      gl.capabilities.isWebGL2 ? "WebGL2" : "WebGL1"
    );
  }, [gl]);

  // Textures
  const waterSpec = useTexture("/textures/Water_001_SPEC.jpg");
  const waterNoise = useTexture("/textures/PerlinNoise.png");
  const waterDistortion = useTexture("/textures/WaterDistortion.png");
  const waterRoughness = useTexture("/textures/water_2_roughness_2k.jpg");

  waterNoise.wrapS = waterNoise.wrapT = THREE.RepeatWrapping;
  waterDistortion.wrapS = waterNoise.wrapT = THREE.RepeatWrapping;
  waterSpec.wrapS = waterSpec.wrapT = THREE.RepeatWrapping;
  waterNoise.wrapS = THREE.RepeatWrapping;
  waterNoise.wrapT = THREE.RepeatWrapping;

  waterNoise.colorSpace = THREE.SRGBColorSpace;

  // update noise and distortion texture
  useEffect(() => {
    if (waterRef.current) {
      const material = waterRef.current.material as WaterMaterial;
      material.updateNoiseTexture(waterNoise);
      material.updateDistortionTexture(waterDistortion);
    }
  }, [waterNoise, waterDistortion]);

  // create depth buffer render target
  const rt = useMemo(() => {
    const rt = new THREE.WebGLRenderTarget(
      window.innerWidth * 3,
      window.innerHeight * 3
    );
    rt.texture.minFilter = THREE.NearestFilter;
    rt.texture.magFilter = THREE.NearestFilter;
    rt.stencilBuffer = false;

    const depthTexture = new THREE.DepthTexture(
      window.innerWidth * 3,
      window.innerHeight * 3
    );

    depthTexture.format = THREE.DepthFormat;
    depthTexture.magFilter = THREE.NearestFilter;
    depthTexture.minFilter = THREE.NearestFilter;
    depthTexture.type = THREE.FloatType;
    rt.depthTexture = depthTexture;
    return rt;
  }, [scene]);

  const [yPos, setYPos] = useState(0);

  useFrame(({ clock }) => {
    gl.setRenderTarget(rt);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // update uniforms
    if (waterRef.current) {
      // Physically move the entire mesh in the X direction
      setYPos(Math.sin(clock.elapsedTime * waveSpeed) * waveHeight);
      const material = waterRef.current.material as WaterMaterial;
      material.updateTime(clock.getElapsedTime());
      material.updateResolution(
        new THREE.Vector2(window.innerWidth, window.innerHeight)
      );
      material.updateDepthTexture(rt.depthTexture);
    }
  });

  return (
    <group
      position={[position.x, position.y + yPos, position.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <mesh name="water" ref={waterRef}>
        <planeGeometry args={[100, 100, 2000, 2000]} />
        <waterMaterial
          transparent
          opacity={0.4}
          lightMap={waterSpec}
          roughnessMap={waterRoughness}
          depthTest
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default WaterBody;
