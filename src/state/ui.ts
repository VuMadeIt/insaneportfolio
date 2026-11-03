import { create } from "zustand";

export type Material = "chrome" | "porcelain" | "darkMetal";
export type Reveal = "a" | "b" | "c";

/** Interface state only. The physics never reads this store. */
interface UiState {
  material: Material;
  reveal: Reveal;
  /** Ball under the pointer or with keyboard focus. */
  hovered: number | null;
  /** Ball whose story is open (PLAN 1.3). */
  selected: number | null;
  sound: boolean;
  setMaterial: (material: Material) => void;
  setReveal: (reveal: Reveal) => void;
  setHovered: (hovered: number | null) => void;
  setSelected: (selected: number | null) => void;
  setSound: (sound: boolean) => void;
}

export const useUi = create<UiState>((set) => ({
  material: "chrome",
  reveal: "b",
  hovered: null,
  selected: null,
  sound: true,
  setMaterial: (material) => set({ material }),
  setReveal: (reveal) => set({ reveal }),
  setHovered: (hovered) => set({ hovered }),
  setSelected: (selected) => set({ selected }),
  setSound: (sound) => {
    localStorage.setItem("sound", sound ? "on" : "off");
    set({ sound });
  },
}));
