import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTACT } from "@/components/Close";
import { ExhibitMedia } from "@/components/ExhibitMedia";
import { ProgressBar } from "@/components/ProgressBar";
import { type Section, caseStudies, caseStudyBySlug } from "@/content/caseStudies";
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

function Block({ section }: { section: Section }) {
  const media = section.media ?? [];
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="scroll-mt-24 px-[var(--gutter)] py-[clamp(64px,10vh,120px)]"
    >
      <div className="mx-auto max-w-[900px]">
        <h2 id={`${section.id}-title`} className="reveal text-[clamp(24px,2.6vw,36px)] leading-[1.15]">
          {section.headline}
        </h2>
        <div className="mt-6 flex max-w-[660px] flex-col gap-4 text-[18px] leading-[1.6]">
          {section.body.map((b, k) => (
            <p key={k} className="reveal">
              {b}
            </p>
          ))}
        </div>
      </div>
      {section.stats && (
        <dl className="mx-auto mt-14 grid max-w-[1100px] gap-10 md:grid-cols-3">
          {section.stats.map((s) => (
            <div key={s.value} className="reveal">
              <dt className="font-display text-[clamp(56px,6vw,88px)] font-medium leading-none tracking-[-0.03em]">
                {s.value}
              </dt>
              <dd className="mt-3 text-[17px] leading-[1.5]">
                {s.text}{" "}
                <a href={s.href} className="text-muted underline decoration-1 underline-offset-4">
                  {s.source}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      )}
      {section.quotes && (
        <div className="mx-auto mt-14 grid max-w-[1100px] gap-x-12 gap-y-10 md:grid-cols-2">
          {section.quotes.map((q) => (
            <figure key={q.text} className="reveal">
              <blockquote className="font-display text-[clamp(20px,1.8vw,26px)] italic leading-[1.35] tracking-[-0.01em]">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[15px] text-muted">{q.who}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {media.length > 0 && (
        <div
          className={`mx-auto mt-14 grid max-w-[1200px] gap-6 ${media.length > 1 ? "md:grid-cols-2" : ""}`}
        >
          {media.map((m) => (
            <figure key={m.alt} className="reveal">
              <ExhibitMedia
                media={m}
                sizes={
                  media.length > 1 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1200px) 1200px, 100vw"
                }
              />
              <figcaption className="mt-3 text-[14px] text-muted">{m.alt}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {section.points && (
        <dl className="mx-auto mt-12 grid max-w-[900px] gap-6 md:grid-cols-2">
          {section.points.map((p) => (
            <div key={p.title} className="reveal">
              <dt className="font-display text-[18px] font-semibold tracking-[-0.02em]">{p.title}</dt>
              <dd className="mt-1 text-[17px] leading-[1.55]">{p.body}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
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

  return (
    <article>
      <header className="px-[var(--gutter)] pb-[clamp(48px,8vh,96px)] pt-[clamp(96px,16vh,180px)]">
        <h1 className="text-[clamp(56px,9vw,148px)] leading-[0.9]">{project.title}</h1>
        <p className="mt-8 max-w-[28em] text-[clamp(20px,1.9vw,28px)] leading-[1.35]">{study.claim}</p>
        <dl className="mt-12 grid max-w-[1100px] gap-6 text-[15px] leading-[1.5] sm:grid-cols-2 lg:grid-cols-4">
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
      </header>
      {study.hero && (
        <div className="px-[var(--gutter)]">
          <ExhibitMedia media={study.hero} sizes="100vw" priority />
        </div>
      )}
      {study.sections.map((s) => (
        <Block key={s.id} section={s} />
      ))}
      {slug === "warframe" && (
        <div className="px-[var(--gutter)] pb-24">
          <div className="mx-auto max-w-[660px]">
            <a
              href={`mailto:${CONTACT.email}?subject=Warframe`}
              className="link-arrow text-[clamp(22px,2.2vw,30px)]"
            >
              Ask me about it <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </div>
      )}
      <ProgressBar sections={study.sections.map((s) => ({ id: s.id, label: s.label }))} />
      <Link
        href={`/work/${next.slug}`}
        className="group mt-[clamp(64px,10vh,120px)] block bg-[#e9e6df] px-[var(--gutter)] py-[clamp(72px,12vh,140px)]"
      >
        <p className="mt-3 font-display text-[clamp(48px,7vw,112px)] font-medium leading-[0.95] tracking-[-0.03em]">
          {next.title}{" "}
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-3"
          >
            &rarr;
          </span>
        </p>
        <p className="mt-4 max-w-[30em] text-[17px]">
          <span className="text-muted">Next exhibit. </span>
          {next.description}
        </p>
      </Link>
    </article>
  );
}
