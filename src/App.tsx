import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/experience";
import { DialogBox } from "./components/dialog-box";
import { SettingsControls } from "./components/settings-controls";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        shadows
        // camera={{ position: [3, 10, 3], near: 0.1, fov: 40 }}
        style={{
          touchAction: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
      <DialogBox />
      <SettingsControls />
    </KeyboardControls>
  );
}

export default App;
