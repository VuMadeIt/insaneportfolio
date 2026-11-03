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
  setMaterial: (material: Material) => void;
  setReveal: (reveal: Reveal) => void;
  setHovered: (hovered: number | null) => void;
  setSelected: (selected: number | null) => void;
}

export const useUi = create<UiState>((set) => ({
  material: "darkMetal",
  reveal: "b",
  hovered: null,
  selected: null,
  setMaterial: (material) => set({ material }),
  setReveal: (reveal) => set({ reveal }),
  setHovered: (hovered) => set({ hovered }),
  setSelected: (selected) => set({ selected }),
}));
