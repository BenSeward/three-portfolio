import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, Clone } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three"; // Import Three.js
import { ChatBubble } from "./ChatBubble";

interface NPCProps {
  animation: string;
  scale: number | [number, number, number];
  position: [number, number, number];
  initialRotation: [number, number, number];
}

export const NPC: React.FC<NPCProps> = ({ animation, ...props }) => {
  const group = useRef<THREE.Group>(null!);
  const chatBubbleRef = useRef<THREE.Group>(null!);
  const activateNPCRef = useRef(false);

  const model = useGLTF("/models/npc.glb");
  const { actions } = useAnimations(model.animations, group);
  const { scene } = useThree();

  const activationDistance = 1;

  useEffect(() => {
    if (!animation || !actions || !actions[animation]) {
      console.warn(`Animation "${animation}" not found in model.`);
      return;
    }

    const animAction = actions[animation];
    animAction.reset().fadeIn(0.24).play();

    return () => {
      animAction?.fadeOut(0.24);
    };
  }, [animation, actions]);

  useFrame(() => {
    if (!group.current) return;

    let character: THREE.Object3D | undefined;

    scene.traverse((obj) => {
      if (obj.name === "Character") {
        character = obj;
      }
    });

    if (!character) return;

    const npcPosition = new THREE.Vector3();
    const characterPosition = new THREE.Vector3();

    group.current.getWorldPosition(npcPosition);
    character.getWorldPosition(characterPosition);

    if (npcPosition.distanceTo(characterPosition) > activationDistance) {
      activateNPCRef.current = false;
      return;
    }

    activateNPCRef.current = true;

    const direction = new THREE.Vector3()
      .subVectors(characterPosition, npcPosition)
      .normalize();

    const targetRotation = Math.atan2(direction.x, direction.z);

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation,
      0.1
    );

    // chat bubble
    if (!chatBubbleRef.current) return;

    chatBubbleRef.current.position.set(
      npcPosition.x,
      npcPosition.y + 0.65,
      npcPosition.z
    );

    chatBubbleRef.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation,
      0.1
    );
  });

  return (
    <>
      <group>
        <ChatBubble ref={chatBubbleRef} isActive={true} />
        <RigidBody type="dynamic" density={50} lockRotations={true}>
          <Clone
            ref={group}
            object={model.scene}
            scale={props.scale}
            position={props.position}
            rotation={props.initialRotation}
          />
        </RigidBody>
      </group>
    </>
  );
};
