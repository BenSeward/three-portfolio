import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, Clone } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { ChatBubble } from "./ChatBubble";
import { Group, MathUtils, Vector3 } from "three";

interface NPCProps {
  animation: string;
  scale: number | [number, number, number];
  position: [number, number, number];
  initialRotation: [number, number, number];
}

export interface ExtendedGroup extends Group {
  isActive: boolean;
}

export const NPC: React.FC<NPCProps> = ({ animation, ...props }) => {
  const group = useRef<Group>(null);
  const chatBubbleRef = useRef<ExtendedGroup>(null);

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
    if (!group.current || !chatBubbleRef.current) return;

    let character: THREE.Object3D | undefined;

    scene.traverse((obj) => {
      if (obj.name === "Character") {
        character = obj;
      }
    });

    if (!character) return;

    const npcPosition = new Vector3();
    const characterPosition = new Vector3();

    group.current.getWorldPosition(npcPosition);
    character.getWorldPosition(characterPosition);

    chatBubbleRef.current.isActive = false;

    const direction = new Vector3()
      .subVectors(characterPosition, npcPosition)
      .normalize();

    const targetRotation = Math.atan2(direction.x, direction.z);

    chatBubbleRef.current.position.set(
      npcPosition.x,
      npcPosition.y + 0.65,
      npcPosition.z
    );

    chatBubbleRef.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      targetRotation,
      0.1
    );

    if (npcPosition.distanceTo(characterPosition) > activationDistance) return;

    chatBubbleRef.current.isActive = true;

    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      targetRotation,
      0.1
    );
  });

  return (
    <>
      <group>
        <ChatBubble ref={chatBubbleRef} />
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
