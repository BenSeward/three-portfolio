import { useState } from "react";
import { useDialogStore } from "../../store/dialog-store";
import { WavyText } from "./WavyText";
import { CrossIcon } from "../icons/close";
import { SingleArrowDownIcon } from "../icons/single-arrow-down";

export const DialogBox = () => {
  const { dialog, author, setDialog } = useDialogStore();
  const [currentDialogStep, setCurrentDialogStep] = useState(1);

  if (dialog.length === 0) return;

  const closeDialog = () => {
    setDialog({ author: "", dialog: [] });
    setCurrentDialogStep(1);
  };

  return (
    <div className="dialog-box">
      <span className="dialog-author">{author}:</span>
      <span className="dialog-close" onClick={() => closeDialog()}>
        <CrossIcon width={10} color="#ffffff" />
      </span>

      {dialog.map((item, index) => {
        if (index !== currentDialogStep - 1) return null;

        return <WavyText key={index} text={item} />;
      })}

      {currentDialogStep < dialog.length && (
        <span
          className="dialog-next"
          onClick={() => setCurrentDialogStep(currentDialogStep + 1)}
        >
          <SingleArrowDownIcon width={10} />
        </span>
      )}
    </div>
  );
};
