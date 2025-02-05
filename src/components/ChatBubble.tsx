import { useGLTF } from "@react-three/drei";
import { UseGLTF } from "../types/use-gltf";
import { useSpring, animated } from "@react-spring/three";
import { useEffect } from "react";

interface ChatBubbleProps {
  isActive: boolean;
}

export function ChatBubble({ isActive }: ChatBubbleProps) {
  const { nodes, materials } = useGLTF("/models/speech_bubble.glb") as UseGLTF;
  const { scale } = useSpring({ scale: isActive ? 0.5 : 0.2 });

  useEffect(() => console.log(isActive), [isActive]);

  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Object_2.geometry}
        material={materials["Scene_-_Root"]}
        rotation={[Math.PI, 0, 0]}
        scale={0.2}
        position={[-1.25, 7.5, 0]}
      />
    </group>
  );
}

useGLTF.preload("/speech_bubble.glb");
