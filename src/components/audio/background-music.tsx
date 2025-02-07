import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useAudioStore } from "../../store/audio-store";
import * as THREE from "three";

export const BackgroundMusic = () => {
  const { camera } = useThree();
  const { volume } = useAudioStore();
  const [audioStarted, setAudioStarted] = useState(false);
  const soundRef = useRef<THREE.Audio | null>(null);

  useEffect(() => {
    const startMusic = () => {
      if (!audioStarted) {
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const sound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();

        audioLoader.load("/sounds/bg-audio.mp3", (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(volume);
          sound.play();
        });

        soundRef.current = sound; // Store sound instance
        setAudioStarted(true);
        document.removeEventListener("click", startMusic);
      }
    };

    document.addEventListener("click", startMusic);
    return () => document.removeEventListener("click", startMusic);
  }, [audioStarted, camera, volume]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolume(volume);
    }
  }, [volume]);

  return null;
};
