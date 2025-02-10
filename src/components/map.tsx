/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { PropsWithChildren, useEffect, useRef } from "react";
import { UseGLTF } from "../types/use-gltf";
import { Mesh } from "three";

interface MapProps extends PropsWithChildren {
  model: any;
  scale: number;
  position: [number, number, number];
}

export const Map = ({ model, position, scale }: MapProps) => {
  const { scene, animations } = useGLTF(model) as UseGLTF;
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!actions || animations.length === 0) {
      return;
    }

    const firstAnimationName = animations[0]?.name;
    if (firstAnimationName && actions[firstAnimationName]) {
      actions[firstAnimationName].play();
    }
  }, [actions, animations]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          object={scene}
          position={position}
          rotation={[0, Math.PI, 0]}
          scale={scale}
          ref={group}
        />
      </RigidBody>
    </group>
  );
};
