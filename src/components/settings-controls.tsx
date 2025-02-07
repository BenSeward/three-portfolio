import { MapIcon } from "./icons/map";
import { SettingsIcon } from "./icons/settings";
import { VolumeIcon } from "./icons/volume";

export const SettingsControls = () => {
  return (
    <div className="settings-controls">
      <VolumeIcon width={30} isMute={false} color="white" />
      <MapIcon width={30} color="white" />
      <SettingsIcon width={30} color="white" />
    </div>
  );
};
