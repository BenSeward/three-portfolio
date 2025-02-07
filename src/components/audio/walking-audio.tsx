import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useAudioStore } from "../../store/audio-store";
import * as THREE from "three";

interface Props {
  status: string;
}
export const WalkingSound = ({ status }: Props) => {
  const { camera } = useThree();
  const { volume } = useAudioStore(); // Get walking status and volume from the store
  const soundRef = useRef<THREE.Audio | null>(null);

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load("/sounds/walking.wav", (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.2);
      if (status !== "idle") {
        sound.play();
      }
    });

    soundRef.current = sound;

    return () => {
      sound.stop();
      camera.remove(listener);
    };
  }, [camera]);

  // Handle play/pause based on walking status
  useEffect(() => {
    if (soundRef.current) {
      if (status !== "idle") {
        if (!soundRef.current.isPlaying) {
          soundRef.current.play();
        }
      } else {
        soundRef.current.stop();
      }
    }
  }, [status]);

  // Adjust volume dynamically
  useEffect(() => {
    if (soundRef.current && volume === 0) {
      soundRef.current.setVolume(volume);
    }
  }, [volume]);

  return null;
};
