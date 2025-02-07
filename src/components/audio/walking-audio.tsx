import { useRef, useEffect, useState } from "react";
import { useAudioStore } from "../../store/audio-store";

interface Props {
  status: string;
}

export const WalkingSound = ({ status }: Props) => {
  const walkingAudio = useRef(new Audio("/sounds/walking.mp3"));
  const runningAudio = useRef(new Audio("/sounds/running.mp3"));
  const { volume } = useAudioStore();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null); // Store previous status

  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (volume === 0) {
      walkingAudio.current.volume = 0;
      runningAudio.current.volume = 0;
    } else {
      walkingAudio.current.volume = 0.5;
      runningAudio.current.volume = 0.5;
    }
  }, [volume]);

  useEffect(() => {
    (async () => {
      if (!hasInteracted) return;

      if (status === previousStatus) return; // Prevent restart if status hasn't changed

      await walkingAudio.current.pause();
      await runningAudio.current.pause();

      walkingAudio.current.currentTime = 0;
      runningAudio.current.currentTime = 0;

      if (status === "walk") {
        walkingAudio.current.loop = true;
        await walkingAudio.current.play();
      } else if (status === "run") {
        runningAudio.current.loop = true;
        await runningAudio.current.play();
      }

      setPreviousStatus(status); // Update previous status
    })();
  }, [status, hasInteracted, previousStatus]); // Add previousStatus to dependency array

  return null;
};
