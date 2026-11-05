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

  it("Shufflr and Ripple follow the case-study structure (PLAN 13.6)", () => {
    for (const slug of ["shufflr", "ripple"]) {
      const study = caseStudies.find((c) => c.slug === slug)!;
      const labels = study.blocks.map((b) => b.label);
      expect(labels.slice(0, 2), slug).toEqual(["The brief", "My role"]);
      expect(labels.at(-1), slug).toBe("Key learnings");
      for (const must of [
        "Insight #1",
        "Insight #2",
        "Solution",
        "Design decision",
        "Outcome",
        "Looking back",
      ])
        expect(labels, `${slug} ${must}`).toContain(must);
      expect(labels.indexOf("Outcome")).toBeLessThan(labels.indexOf("Looking back"));
      // A visual for nearly every block (Caleb's density).
      expect(study.blocks.filter((b) => !b.visual).length, slug).toBeLessThanOrEqual(1);
      expect(study.meta.outcome, slug).toBeTruthy();
    }
  });

  it("every diagram edge joins two nodes that exist", () => {
    for (const study of caseStudies)
      for (const b of study.blocks)
        if (b.visual?.kind === "diagram") {
          const ids = new Set(b.visual.nodes.map((n) => n.id));
          for (const e of b.visual.edges)
            expect(ids.has(e.from) && ids.has(e.to), `${study.slug}/${b.id}`).toBe(true);
        }
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
