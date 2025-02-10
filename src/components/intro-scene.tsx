import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  setIsIntroScene: () => void;
}

export const IntroScene = ({ setIsIntroScene }: Props) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isLoading = useMemo(() => loadingProgress !== 100, [loadingProgress]);

  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime() * 0.15;
    const radius = 35; // Distance from the center

    camera.position.x = Math.sin(time) * radius;
    camera.position.y = 10;
    camera.position.z = Math.cos(time) * radius;
    camera.lookAt(0, -10, 0); // Always look at the center
  });

  const mockLoading = (
    onProgress: (progress: number) => void,
    duration = 3000
  ) => {
    let progress = 0;
    const interval = 50; // Update every 50ms
    const step = (100 / duration) * interval; // Increment amount

    const loadingInterval = setInterval(() => {
      progress += step;
      onProgress(Math.min(100, Math.round(progress))); // Ensure it doesn't exceed 100%

      if (progress >= 100) {
        clearInterval(loadingInterval);
      }
    }, interval);
  };

  useEffect(() => {
    mockLoading(setLoadingProgress, 2000);
  }, []);

  return (
    <>
      <perspectiveCamera ref={cameraRef} />
      <Html fullscreen className="intro-scene">
        <div className="loading-scene-background" />
        <motion.div
          className="loading-scene-transition-container"
          initial={{ opacity: "100%" }}
          animate={{ opacity: isLoading ? "100%" : "0%" }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.8 }}
        >
          <motion.div
            className="loading-scene-transition"
            initial={{ height: "200%" }}
            animate={{ height: isLoading ? "200%" : "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.div
            className="loading-scene-transition-2"
            initial={{ height: "200%" }}
            animate={{ height: isLoading ? "200%" : "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="loading-scene-transition"
            initial={{ height: "200%" }}
            animate={{ height: isLoading ? "200%" : "0%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="intro-scene-container">
          <AnimatePresence>
            <img key={"image"} src="/images/logo.png" />

            {isLoading && (
              <div className="loading-bar-container">
                <motion.div
                  className="loading-bar"
                  key="loading-bar"
                  initial={{ opacity: 1, scale: 1, visibility: "visible" }}
                  animate={{
                    opacity: isLoading ? 1 : 0,
                    scale: isLoading ? 1 : 0,
                    visibility: isLoading ? "visible" : "hidden", // Prevents interaction when hidden
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    visibility: "hidden", // Ensures it stays hidden once removed
                    display: "none",
                  }}
                >
                  <div
                    className="loading-percentage"
                    style={{ width: `${loadingProgress}%` }}
                  />
                  <span>Loading...{loadingProgress}%</span>
                </motion.div>
              </div>
            )}

            {!isLoading && (
              <motion.button
                className="btn"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isLoading ? 0 : 1,
                  scale: isLoading ? 0.8 : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
                onClick={() => setIsIntroScene()}
              >
                Start exploring
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </Html>
    </>
  );
};
