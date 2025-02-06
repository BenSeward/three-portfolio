import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { ChatBubble } from "./ChatBubble";
import { Euler, Group, MathUtils, Vector3 } from "three";
import { useDialogStore } from "../store/dialog-store";
import { NPCModel } from "./NPCModel";

export interface ExtendedGroup extends Group {
  isActive: boolean;
}

interface Props {
  position: Vector3;
  rotation: Euler;
}

export const NPC: React.FC<Props> = ({ position, rotation }) => {
  const group = useRef<ExtendedGroup>(null);
  const chatBubbleRef = useRef<ExtendedGroup>(null);
  const { setDialog } = useDialogStore();
  const { scene } = useThree();

  const activationDistance = 1;

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
      <group
        onClick={() =>
          setDialog([
            "Hi there! Our creator is still building here but feel free to look around!",
          ])
        }
      >
        <ChatBubble ref={chatBubbleRef} />

        <RigidBody type="dynamic" density={50} lockRotations={true}>
          <NPCModel
            ref={group}
            scale={0.18}
            position={position}
            rotation={rotation}
          />
        </RigidBody>
      </group>
    </>
  );
};
