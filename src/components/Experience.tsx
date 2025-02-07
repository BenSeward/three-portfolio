import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useRef } from "react";
import { NPC } from "./npc";
import { CharacterController } from "./character/character-controller";
import { Euler, Vector3 } from "three";
import { Map } from "./map";

export const Experience = () => {
  const shadowCameraRef = useRef();

  return (
    <>
      {/* <OrbitControls /> */}
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Physics key={"medieval_village"}>
        <Map
          scale={0.15}
          position={[-1.5, -4, 2]}
          model={`models/medieval_village.glb`}
        />

        <CharacterController />

        <NPC
          position={new Vector3(1.25, 0, 1.5)}
          rotation={new Euler(0, Math.PI, 0)}
        />
        <NPC
          position={new Vector3(6, 0, 6)}
          rotation={new Euler(0, -Math.PI / 2, 0)}
        />
      </Physics>
    </>
  );
};
