import { hackCanada } from "./hackCanada";
import { hackCanadaLanding } from "./hackCanadaLanding";
import { mapleLeaf } from "./mapleLeaf";
import { passionNails } from "./passionNails";
import { reboot } from "./reboot";
import { ripple } from "./ripple";
import { shufflr } from "./shufflr";
import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  shufflr,
  ripple,
  reboot,
  mapleLeaf,
  passionNails,
  hackCanada,
  hackCanadaLanding,
];
export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
export type { Block, CaseStudy } from "./types";
