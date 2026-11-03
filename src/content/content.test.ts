import { describe, expect, it } from "vitest";
import { caseStudies } from "./caseStudies";
import { identities } from "./identities";
import { allProjects, homeProjects, hrefOf, monthOf, projects } from "./projects";

const allText = JSON.stringify({ identities, projects, caseStudies });

describe("site copy", () => {
  it("never uses an em dash", () => {
    expect(allText).not.toMatch(/\u2014/);
  });

  it("every case-study headline is a first-person claim (the skim test)", () => {
    for (const study of caseStudies) {
      expect(study.claim, study.slug).toMatch(/\b(I|We|we|I'd|I'm)\b/);
      for (const b of study.blocks)
        expect(b.headline, `${study.slug}/${b.id}`).toMatch(/\b(I|We|we|I'd|I'm|So we)\b/);
    }
  });

  it("every featured project has a case study, and every case study points at a real next one", () => {
    const slugs = new Set(caseStudies.map((c) => c.slug));
    for (const p of projects.filter((p) => p.caseStudy)) expect(slugs.has(p.slug), p.slug).toBe(true);
    for (const c of caseStudies) expect(slugs.has(c.next), c.next).toBe(true);
  });

  it("every project opens something and has a video, and the lists rank it right", () => {
    for (const p of projects) {
      expect(hrefOf(p), p.slug).toBeTruthy();
      expect(p.media.video ?? p.media.hover, p.slug).toBeTruthy();
    }
    expect(homeProjects.map((p) => p.slug)).toEqual(["ripple", "shufflr"]);
    expect(allProjects.slice(0, 3).map((p) => p.slug)).toEqual([
      "ripple",
      "shufflr",
      "we-should-go-to-japan",
    ]);
    expect(new Set(allProjects).size).toBe(projects.length);
  });

  it("dates show as a month, with the year only when it is not this year", () => {
    const now = new Date(2026, 10, 3);
    expect(monthOf("2026-03", now)).toBe("March");
    expect(monthOf("2025-06", now)).toBe("June 2025");
  });

  it("third-party stats keep their sources", () => {
    const stats = caseStudies.flatMap((c) =>
      c.blocks.flatMap((b) => (b.visual?.kind === "stats" ? b.visual.stats : [])),
    );
    for (const s of stats.filter((s) => s.source)) expect(s.href).toMatch(/^https:\/\//);
    // Every outside number on Shufflr and Ripple is sourced; only Lucas's own results go without.
    for (const slug of ["shufflr", "ripple"]) {
      const study = caseStudies.find((c) => c.slug === slug)!;
      for (const b of study.blocks)
        if (b.visual?.kind === "stats") for (const s of b.visual.stats) expect(s.href, s.value).toBeTruthy();
    }
  });

  it("Shufflr and Ripple follow Caleb Wu's rhythm", () => {
    const rhythm = [
      "The problem",
      "Insight #1",
      "Insight #2",
      "Solution",
      "Solution",
      "Design decision",
      "Design decision",
      "Research",
      "Research",
      "Research",
      "Solution ideation",
      "Solution ideation",
      "Solution ideation",
      "Solution ideation",
      "Final solution",
      "Key learnings",
    ];
    for (const slug of ["shufflr", "ripple"])
      expect(caseStudies.find((c) => c.slug === slug)!.blocks.map((b) => b.label)).toEqual(rhythm);
  });

  it("Maple Leaf is an overview and its three apps", () => {
    const labels = caseStudies.find((c) => c.slug === "maple-leaf-foods")!.blocks.map((b) => b.label);
    expect(labels).toEqual([
      "Overview",
      "Maple Leaf Market",
      "Project Tracking and Reporting App",
      "Service Penalty App",
    ]);
  });
});
