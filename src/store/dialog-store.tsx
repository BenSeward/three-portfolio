import { create } from "zustand";

interface DialogState {
  dialog: Array<string>;
  setDialog: (dialog: Array<string>) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  dialog: [],
  setDialog: (update) => set(() => ({ dialog: update })),
}));
