import { useGLTF } from "@react-three/drei";
import { UseGLTF } from "../../types/use-gltf";
import { forwardRef, useState } from "react";
import { ExtendedGroup } from ".";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";

export const ChatBubble = forwardRef<ExtendedGroup>((_, ref) => {
  const { nodes } = useGLTF("/models/chat-bubble-v2.glb") as UseGLTF;
  const [isActive, setIsActive] = useState(false);

  const { scale } = useSpring({ scale: isActive ? 1 : 0 });

  useFrame(() => {
    if (!ref || typeof ref === "function" || !ref.current) return;

    if (ref.current.isActive && !isActive) {
      setIsActive(true);
    }

    if (!ref.current.isActive && isActive) {
      setIsActive(false);
    }
  });

  return (
    <group ref={ref} dispose={null}>
      <animated.mesh scale={scale}>
        <group scale={0.01}>
          <mesh
            geometry={nodes.Plane003_Plane005.geometry}
            material={nodes.Plane003_Plane005.material}
            position={[109.144, 38.224, -0.833]}
            scale={[34.96, 41.072, 42.3]}
          />
        </group>
      </animated.mesh>
    </group>
  );
});

useGLTF.preload("/models/chat-bubble-v2.glb");
