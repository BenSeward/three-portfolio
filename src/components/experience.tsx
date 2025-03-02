import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import { NPC } from "./npc";
import { CharacterController } from "./character/character-controller";
import { Color, Euler, Vector3 } from "three";
import { Map } from "./map";
import { BackgroundMusic } from "./audio/background-music";
import { IntroScene } from "./intro-scene";
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import Sky from "./sky";

export const Experience = () => {
  const [isIntroScene, setIsIntroScene] = useState(true);

  const { scene } = useThree();
  useEffect(() => {
    scene.background = new Color("skyblue");
  }, [scene]);

  return (
    <>
      {isIntroScene && (
        <>
          <OrbitControls />
          <IntroScene setIsIntroScene={() => setIsIntroScene(false)} />
        </>
      )}
      <Environment preset="city" />

      <Sky />

      <BackgroundMusic />
      <Physics key={"medieval_village"}>
        <CharacterController followCharacter={!isIntroScene} />
        <Map
          scale={0.5}
          position={[0, -10, 0]}
          model={`models/island_town_2.glb`}
        />

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
