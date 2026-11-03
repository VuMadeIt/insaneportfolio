import { describe, expect, it } from "vitest";
import { caseStudies } from "./caseStudies";
import { identities } from "./identities";
import { projects } from "./projects";

const allText = JSON.stringify({ identities, projects, caseStudies });

describe("site copy", () => {
  it("never uses an em dash", () => {
    expect(allText).not.toMatch(/\u2014/);
  });

  it("every case-study headline is a first-person claim (the skim test)", () => {
    for (const study of caseStudies) {
      expect(study.claim, study.slug).toMatch(/\b(I|We|we|I'd|I'm)\b/);
      for (const s of study.sections)
        expect(s.headline, `${study.slug}/${s.id}`).toMatch(/\b(I|We|we|I'd|I'm|So we)\b/);
    }
  });

  it("every featured project has a case study, and every case study points at a real next one", () => {
    const slugs = new Set(caseStudies.map((c) => c.slug));
    for (const p of projects.filter((p) => p.caseStudy)) expect(slugs.has(p.slug), p.slug).toBe(true);
    for (const c of caseStudies) expect(slugs.has(c.next), c.next).toBe(true);
  });

  it("research stats keep their sources", () => {
    for (const s of caseStudies.flatMap((c) => c.sections.flatMap((x) => x.stats ?? [])))
      expect(s.href).toMatch(/^https:\/\//);
  });
});
