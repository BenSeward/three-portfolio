/* eslint-disable @typescript-eslint/no-explicit-any */
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Leva, useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useThree } from "@react-three/fiber";
import { Character } from "./character";
import { WalkingSound } from "../audio/walking-audio";

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

export const CharacterController = () => {
  const {
    WALK_SPEED,
    RUN_SPEED,
    ROTATION_SPEED,
    CAMERA_LOOKAT_X,
    CAMERA_LOOKAT_Y,
    CAMERA_LOOKAT_Z,
  } = useControls("Character Control", {
    WALK_SPEED: { value: 1.4, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 2, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(1),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    CAMERA_LOOKAT_X: {
      value: 0,
      min: 0,
      max: 100,
      step: 0.25,
    },
    CAMERA_LOOKAT_Y: {
      value: 0,
      min: 0,
      max: 100,
      step: 0.25,
    },
    CAMERA_LOOKAT_Z: {
      value: 0,
      min: 0,
      max: 100,
      step: 0.25,
    },
  });
  const rb = useRef<any>(null!);
  const container = useRef<any>(null);
  const character = useRef<any>(null);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<any>(null);
  const cameraPosition = useRef<any>(null);
  const characterRotationTarget = useRef(0);
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const isClicking = useRef(false);

  const [animation, setAnimation] = useState("idle");

  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const test = useThree();

  useEffect(() => {
    test.camera.lookAt(
      new Vector3(CAMERA_LOOKAT_X, CAMERA_LOOKAT_Y, CAMERA_LOOKAT_Z)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CAMERA_LOOKAT_X, CAMERA_LOOKAT_Y, CAMERA_LOOKAT_Z]);

  useEffect(() => {
    const onMouseDown = () => {
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

    // CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <>
      <Leva hidden />
      <WalkingSound status={animation} />
      <RigidBody ref={rb} colliders={false} mass={5} lockRotations={true}>
        <group ref={container}>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} position-y={4} position-z={-4} />
          <group ref={character}>
            <Character scale={0.18} animation={animation} />
          </group>
        </group>
        <CapsuleCollider args={[0.08, 0.15]} />
      </RigidBody>
    </>
  );
};
