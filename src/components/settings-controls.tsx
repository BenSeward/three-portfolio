import { useAudioStore } from "../store/audio-store";
import { MapIcon } from "./icons/map";
import { SettingsIcon } from "./icons/settings";
import { VolumeIcon } from "./icons/volume";

export const SettingsControls = () => {
  const { volume, toggleVolume } = useAudioStore();

  return (
    <div className="settings-controls">
      <VolumeIcon
        width={30}
        isMute={volume === 0}
        color="white"
        onClick={() => toggleVolume()}
      />
      <MapIcon width={30} color="white" />
      <SettingsIcon width={30} color="white" />
    </div>
  );
};
