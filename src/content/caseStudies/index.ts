import { mapleLeaf } from "./mapleLeaf";
import { ripple } from "./ripple";
import { shufflr } from "./shufflr";
import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [shufflr, ripple, mapleLeaf];
export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
export type { Block, CaseStudy } from "./types";
