import { create } from "zustand";

interface DialogState {
  dialog: Array<string>;
  author: string;
  setDialog: ({ dialog, author }: { dialog: string[]; author: string }) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  dialog: [],
  author: "",
  setDialog: ({ dialog, author }) => set(() => ({ dialog, author })),
}));
