import { useRef, useEffect, useState } from "react";

interface Props {
  status: string;
}
export const WalkingSound = ({ status }: Props) => {
  const walkingAudio = useRef(new Audio("/sounds/walking.mp3"));
  const runningAudio = useRef(new Audio("/sounds/running.mp3"));
  const [hasInteracted, setHasInteracted] = useState(false);

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
    (async () => {
      if (!hasInteracted) return;

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
    })();
  }, [status, hasInteracted]);

  return null;
};
