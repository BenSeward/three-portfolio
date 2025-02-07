import { useAudioStore } from "../store/audio-store";
import { MapIcon } from "./icons/map";
import { SettingsIcon } from "./icons/settings";
import { VolumeIcon } from "./icons/volume";

export const SettingsControls = () => {
  const { toggleVolume } = useAudioStore();

  return (
    <div className="settings-controls">
      <VolumeIcon
        width={30}
        isMute={false}
        color="white"
        onClick={() => {
          console.log("clicking...");
          toggleVolume();
        }}
      />
      <MapIcon width={30} color="white" />
      <SettingsIcon width={30} color="white" />
    </div>
  );
};
