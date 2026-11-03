import { create } from "zustand";

export const HDRIS = [
  "gallery_neutral",
  "white_neutral",
  "white_studio_03",
  "sculpture_exhibition",
  "studio_small_09",
  "photo_studio_loft_hall",
  "monochrome_studio_02",
  "studio_kontrast_02",
] as const;
export type Hdri = (typeof HDRIS)[number];
export type ToneMap = "neutral" | "agx" | "aces";
export type ShadowTechnique = "pcss" | "vsm";
export type StringLook = "nylon" | "thread" | "wire";

/** Everything about how the object is lit and rendered. The lab edits it; the site uses defaults. */
export interface Look {
  hdri: Hdri;
  envIntensity: number;
  envRotation: number;
  toneMap: ToneMap;
  exposure: number;
  shadow: ShadowTechnique;
  shadowOpacity: number;
  /** Physical size of the spotlight's emitter (m), drives PCSS penumbra width. */
  lightSize: number;
  keyIntensity: number;
  keyPosition: [number, number, number];
  /** Wall distance behind the ball centres (m). */
  wallDistance: number;
  string: StringLook;
  pool: number;
}

export const defaultLook: Look = {
  hdri: "gallery_neutral",
  envIntensity: 1,
  envRotation: 0,
  toneMap: "neutral",
  exposure: 1,
  shadow: "vsm",
  shadowOpacity: 0.24,
  lightSize: 0.05,
  keyIntensity: 40,
  keyPosition: [-0.3, 0.45, 3],
  wallDistance: 0.3,
  string: "nylon",
  pool: 0.03,
};

export const useLook = create<Look & { set: (patch: Partial<Look>) => void }>((set) => ({
  ...defaultLook,
  set: (patch) => set(patch),
}));
