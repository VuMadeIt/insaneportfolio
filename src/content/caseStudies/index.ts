import { mapleLeaf } from "./mapleLeaf";
import { ripple } from "./ripple";
import { shufflr } from "./shufflr";
import type { CaseStudy } from "./types";
import { warframe } from "./warframe";

export const caseStudies: CaseStudy[] = [shufflr, ripple, mapleLeaf, warframe];
export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
export type { CaseStudy, Section } from "./types";
