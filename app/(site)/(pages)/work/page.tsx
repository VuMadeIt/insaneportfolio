import Link from "next/link";
import { ExhibitMedia } from "@/components/ExhibitMedia";
import { type Project, projects } from "@/content/projects";

export const metadata = {
  title: "Work",
  description: "Everything Lucas Vu has designed and built: case studies, hackathon wins, experiments.",
};

function Row({ p }: { p: Project }) {
  const href = p.caseStudy ? `/work/${p.slug}` : p.link?.href;
  const external = !p.caseStudy && !!p.link;
  const Title = (
    <h2 className="text-[clamp(30px,3.6vw,52px)] font-normal leading-[1] tracking-[-0.02em]">{p.title}</h2>
  );
  return (
    <li className="catalogue-row group relative border-t border-rule py-8 md:py-10">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_9em] md:gap-10">
        {href ? (
          <Link
            href={href}
            className="after:absolute after:inset-0"
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {Title}
          </Link>
        ) : (
          Title
        )}
        <div className="text-[16px] leading-[1.5]">
          <p>{p.description}</p>
          <p className="mt-2 text-[15px] text-muted">
            {p.medium}
            {p.credit ? `. ${p.credit}` : ""}
            {external ? `. ${p.link!.label}` : ""}
          </p>
        </div>
        <p className="text-[15px] text-muted md:text-right">{p.year}</p>
      </div>
      {p.media && (
        <div className="catalogue-preview mt-6 md:pointer-events-none md:absolute md:right-[12em] md:top-1/2 md:z-10 md:mt-0 md:w-[280px] md:-translate-y-1/2">
          <ExhibitMedia media={p.media} sizes="(min-width: 768px) 280px, 100vw" />
        </div>
      )}
    </li>
  );
}

/** The catalogue: Sam-style list, thin rules between rows, preview media on hover (inline on phones). */
export default function WorkPage() {
  return (
    <section
      aria-labelledby="work-title"
      className="px-[var(--gutter)] pb-[clamp(96px,14vh,180px)] pt-[clamp(96px,16vh,180px)]"
    >
      <h1
        id="work-title"
        className="text-[clamp(56px,9vw,148px)] font-normal leading-[0.9] tracking-[-0.035em]"
      >
        All work
      </h1>
      <p className="mt-8 max-w-[32em] text-[clamp(19px,1.6vw,23px)] leading-[1.5]">
        Case studies, hackathon builds and things I made to find out. The first four have the long version.
      </p>
      <ul className="mt-16 border-b border-rule">
        {projects.map((p) => (
          <Row key={p.slug} p={p} />
        ))}
      </ul>
    </section>
  );
}
