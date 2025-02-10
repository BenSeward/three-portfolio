/* eslint-disable @typescript-eslint/no-explicit-any */
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Leva, useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { Character } from "./character";
import { MovementAudio } from "../audio/movement-audio";

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start: any, end: any, t: any) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

interface Props {
  followCharacter: boolean;
}

export const CharacterController = ({ followCharacter }: Props) => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 1.4, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 2, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: 0.06,
        min: 0.01,
        max: 0.1,
        step: 0.01,
      },
    }
  );

  const initialPosition = new Vector3(1, -1, -15);

  const rb = useRef<any>(null!);
  const container = useRef<any>(null);
  const character = useRef<any>(null);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<any>(null);
  const cameraPosition = useRef<any>(null);
  const characterRotationTarget = useRef(0);
  const cameraLookAtWorldPosition = useRef(initialPosition);
  const isClicking = useRef(false);

  const [animation, setAnimation] = useState("idle");

  const cameraWorldPosition = useRef(initialPosition);
  const cameraLookAt = useRef(initialPosition);
  const [, get] = useKeyboardControls();

  useEffect(() => {
    const onMouseDown = () => {
      // @todo need to check here if whgere we are clicking is a button, dialog or npc
      isClicking.current = true;
    };

    const onMouseUp = () => {
      isClicking.current = false;
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // touch
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  useFrame(({ camera, mouse }) => {
    if (rb.current && character.current) {
      const vel = rb.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (isClicking.current) {
        if (Math.abs(mouse.x) > 0.1) {
          movement.x = -mouse.x;
        }
        movement.z = mouse.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        if (speed === RUN_SPEED) {
          setAnimation("run");
        } else {
          setAnimation("walk");
        }
      } else {
        setAnimation("idle");
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );

      rb.current.setLinvel(vel, true);
    }

    if (!followCharacter) return;

    // CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.2);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.2);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <>
      <Leva hidden />
      <MovementAudio status={animation} />
      <RigidBody
        ref={rb}
        colliders={false}
        mass={5}
        lockRotations={true}
        position={initialPosition}
      >
        <group ref={container}>
          <group ref={cameraTarget} position-z={1} />
          <group ref={cameraPosition} position-y={2} position-z={-2} />
          <group ref={character}>
            <Character scale={0.18} animation={animation} />
          </group>
        </group>
        <CapsuleCollider args={[0.08, 0.15]} />
      </RigidBody>
    </>
  );
};
