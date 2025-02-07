import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import { NPC } from "./npc";
import { CharacterController } from "./character/character-controller";
import { Euler, Vector3 } from "three";
import { Map } from "./map";
import { BackgroundMusic } from "./audio/background-music";

export const Experience = () => {
  return (
    <>
      <Environment preset="sunset" />

      <BackgroundMusic />

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
