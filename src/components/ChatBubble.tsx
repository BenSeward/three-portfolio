import { useGLTF } from "@react-three/drei";
import { UseGLTF } from "../types/use-gltf";
import { forwardRef } from "react";

interface ChatBubbleProps {
  isActive: boolean;
}

export const ChatBubble = forwardRef((props: ChatBubbleProps, ref: any) => {
  const { nodes } = useGLTF("/models/chat-bubble-v2.glb") as UseGLTF;

  return (
    <group ref={ref} dispose={null}>
      <group scale={0.01}>
        <mesh
          geometry={nodes.Plane003_Plane005.geometry}
          material={nodes.Plane003_Plane005.material}
          position={[109.144, 38.224, -0.833]}
          scale={[34.96, 41.072, 42.3]}
        />
      </group>
    </group>
  );
});

useGLTF.preload("/chat-bubble-v2.glb");
