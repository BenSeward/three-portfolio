import { Environment, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useRef } from "react";
import { NPC } from "./NPC";
import { Map } from "./Map";
import { CharacterController } from "./CharacterController";

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
      <Physics debug key={"medieval_village"}>
        <Map
          scale={0.125}
          position={[-1.5, -4, 2]}
          model={`models/medieval_village.glb`}
        />

        <CharacterController />

        <NPC
          animation="idle" // Animation to play
          scale={0.18}
          position={[0.75, 0, 1.5]} // Position of the NPC
          initialRotation={[0, Math.PI, 0]}
        />
      </Physics>
    </>
  );
};
