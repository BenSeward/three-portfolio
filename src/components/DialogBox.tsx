/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDialogStore } from "../store/dialog-store";
import { WavyText } from "./WavyText";

export const DialogBox = () => {
  const { dialog, setDialog } = useDialogStore();

  if (dialog.length === 0) return;

  return (
    <>
      <div className="dialog-box">
        <span className="dialog-close" onClick={() => setDialog([])}>
          X
        </span>
        {dialog.map((item, index) => (
          <WavyText key={index} text={item} />
        ))}
      </div>
    </>
  );
};
