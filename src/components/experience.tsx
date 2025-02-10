import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import { NPC } from "./npc";
import { CharacterController } from "./character/character-controller";
import { Euler, Vector3 } from "three";
import { Map } from "./map";
import { BackgroundMusic } from "./audio/background-music";
import { IntroScene } from "./intro-scene";
import { useState } from "react";

export const Experience = () => {
  const [isIntroScene, setIsIntroScene] = useState(true);

  return (
    <>
      {isIntroScene && (
        <>
          <OrbitControls />
          <IntroScene setIsIntroScene={() => setIsIntroScene(false)} />
        </>
      )}

      <Environment preset="sunset" />

      <BackgroundMusic />

      <Physics key={"medieval_village"}>
        <Map
          scale={0.5}
          position={[0, -10, 0]}
          model={`models/island_town.glb`}
        />

        <CharacterController followCharacter={!isIntroScene} />

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
