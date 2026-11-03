import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Visual } from "@/components/case/Visual";
import { CONTACT } from "@/content/contact";
import { ExhibitMedia } from "@/components/ExhibitMedia";
import { ProgressBar } from "@/components/ProgressBar";
import { type Block, caseStudies, caseStudyBySlug } from "@/content/caseStudies";
import { projectBySlug } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  const project = projectBySlug(slug);
  if (!study || !project) return {};
  return {
    title: project.title,
    description: study.claim,
    openGraph: {
      title: `${project.title} | Lucas Vu`,
      description: study.claim,
      images: project.media?.poster ? [project.media.poster] : undefined,
    },
    alternates: { canonical: `/work/${slug}` },
  };
}

/** Visuals that sit on a tone-step panel (Caleb's grey stage); numbers and lists sit on the wall. */
const PANELLED = new Set(["media", "statement", "dots", "flow", "quotes", "cards", "options", "scrub"]);

/** Visuals whose parts rise in one by one themselves; the others rise in as one figure. */
const STAGGERED = new Set(["stats", "quotes", "cards", "options", "list"]);

/** The rail and progress bar group blocks by label: "Insight #1" and "Insight #2" are "Insight". */
const group = (label: string) => label.replace(/\s*#\d+$/, "");

function Text({ block }: { block: Block }) {
  return (
    <div>
      <p className="reveal text-[15px] text-muted">{block.label}</p>
      <h2
        id={`${block.id}-title`}
        className="reveal mt-3 max-w-[26em] text-[clamp(24px,2.4vw,34px)] leading-[1.15]"
      >
        {block.headline}
      </h2>
      {block.body.map((b, k) => (
        <p key={k} className="reveal mt-4 max-w-[36em] leading-[1.55]">
          {b}
        </p>
      ))}
    </div>
  );
}

function Figure({ block }: { block: Block }) {
  if (!block.visual) return null;
  const panel = PANELLED.has(block.visual.kind);
  return (
    <figure className={`mt-10 ${STAGGERED.has(block.visual.kind) ? "" : "reveal"}`}>
      <div className={panel ? "rounded-lg bg-[#e9e6df] p-[clamp(16px,3vw,48px)]" : ""}>
        <Visual visual={block.visual} />
      </div>
      {block.caption && (
        <figcaption className="mt-3 text-center text-[15px] text-muted">{block.caption}</figcaption>
      )}
    </figure>
  );
}

/** One block of the story: label, claim headline, two lines, then its picture and a caption. */
function BlockView({ blocks }: { blocks: Block[] }) {
  const pair = blocks.length > 1;
  return (
    <section
      id={blocks[0]!.id}
      data-group={group(blocks[0]!.label)}
      aria-labelledby={`${blocks[0]!.id}-title`}
      className="case-block scroll-mt-28 px-[var(--gutter)] py-[clamp(56px,9vh,104px)]"
    >
      <div className={`mx-auto max-w-[1400px] ${pair ? "grid gap-12 md:grid-cols-2" : ""}`}>
        {blocks.map((b) => (
          <div key={b.id} id={b === blocks[0] ? undefined : b.id}>
            <Text block={b} />
            <Figure block={b} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Consecutive `pair` blocks render side by side. */
function grouped(blocks: Block[]): Block[][] {
  const out: Block[][] = [];
  for (const b of blocks) {
    const last = out.at(-1);
    if (b.pair && last?.[0]?.pair && last.length < 2) last.push(b);
    else out.push([b]);
  }
  return out;
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  const project = projectBySlug(slug);
  if (!study || !project) notFound();
  const next = projectBySlug(study.next)!;
  const meta = [
    ["Role", study.meta.role],
    ["Team", study.meta.team],
    ["Timeline", study.meta.timeline],
    ["Scope", study.meta.scope],
  ].filter((m): m is [string, string] => !!m[1]);
  const sections = grouped(study.blocks);
  const rail = sections
    .map((s) => ({ id: s[0]!.id, label: group(s[0]!.label) }))
    .filter((s, i, all) => all.findIndex((x) => x.label === s.label) === i);

  return (
    <article>
      <header className="px-[var(--gutter)] pb-[clamp(40px,6vh,72px)] pt-[clamp(72px,12vh,140px)]">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[15px] text-muted">{study.year}</p>
          <h1 className="mt-2 text-[clamp(56px,9vw,148px)] leading-[0.9]">{project.title}</h1>
          <p className="mt-8 max-w-[36em] text-[clamp(18px,1.5vw,22px)] leading-[1.5]">{study.summary}</p>
          <dl className="mt-10 grid gap-6 text-[15px] leading-[1.5] sm:grid-cols-2 lg:grid-cols-4">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          {study.link && (
            <a href={study.link.href} className="link-arrow mt-8 inline-block text-[16px]">
              {study.link.label} <span aria-hidden>&rarr;</span>
            </a>
          )}
        </div>
      </header>
      {study.hero && (
        <div className="px-[var(--gutter)]">
          <div className="mx-auto max-w-[1400px] rounded-lg bg-[#e9e6df] p-[clamp(16px,3vw,48px)]">
            <ExhibitMedia media={study.hero} sizes="(min-width: 1400px) 1400px, 100vw" priority />
          </div>
        </div>
      )}
      {sections.map((s) => (
        <BlockView key={s[0]!.id} blocks={s} />
      ))}
      <ProgressBar sections={rail} />
      <div className="px-[var(--gutter)] pt-[clamp(40px,6vh,72px)]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-5 rounded-lg bg-[#e9e6df] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-[30em] leading-[1.5]">
            This is a snapshot of the process. Ask me for the full story.
          </p>
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(project.title)}`}
            className="group shrink-0 rounded-full bg-ink px-5 py-2 text-wall transition-colors duration-300 hover:bg-[#2a2a2a]"
          >
            <span className="u-grow group-hover:bg-[length:100%_0.1em]">say hi</span>
          </a>
        </div>
      </div>
      <div className="px-[var(--gutter)] pb-[clamp(24px,4vh,48px)] pt-[clamp(56px,9vh,104px)]">
        <Link
          href={`/work/${next.slug}`}
          className="group mx-auto grid max-w-[1400px] overflow-hidden rounded-lg bg-ink text-wall md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
        >
          <div className="flex flex-col justify-end p-[clamp(24px,3vw,40px)]">
            <p className="text-[15px] text-wall/70">Next exhibit</p>
            <p className="mt-1 font-display text-[clamp(36px,5vw,72px)] font-medium leading-[1] tracking-[-0.03em]">
              {next.title}{" "}
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2"
              >
                &rarr;
              </span>
            </p>
            <p className="mt-3 max-w-[30em] text-wall/80">{next.caption ?? next.description}</p>
          </div>
          {next.media && (
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.04]">
                <ExhibitMedia media={next.media} sizes="(min-width: 1400px) 840px, 60vw" cover />
              </div>
            </div>
          )}
        </Link>
      </div>
    </article>
  );
}
