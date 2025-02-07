import { create } from "zustand";

interface DialogState {
  volume: number; // Value between 0 and 1
  toggleVolume: () => void;
}

export const useAudioStore = create<DialogState>((set) => ({
  volume: 0.1,
  toggleVolume: () =>
    set((currentState) => ({ volume: currentState.volume ? 0 : 0.1 })),
}));
