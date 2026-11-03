import { create } from "zustand";

export type Material = "chrome" | "porcelain" | "darkMetal";
export type Reveal = "a" | "b" | "c";

/** Interface state only. The physics never reads this store. */
interface UiState {
  material: Material;
  reveal: Reveal;
  hovered: number | null;
  setMaterial: (material: Material) => void;
  setReveal: (reveal: Reveal) => void;
  setHovered: (hovered: number | null) => void;
}

export const useUi = create<UiState>((set) => ({
  material: "chrome",
  reveal: "b",
  hovered: null,
  setMaterial: (material) => set({ material }),
  setReveal: (reveal) => set({ reveal }),
  setHovered: (hovered) => set({ hovered }),
}));
