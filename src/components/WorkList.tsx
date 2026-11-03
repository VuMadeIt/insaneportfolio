import Link from "next/link";
import { type Project, hrefOf } from "@/content/projects";
import { ExhibitMedia } from "./ExhibitMedia";

/**
 * One project row (Sam-style catalogue): title and accolades, description, year, thin rules, and
 * the project's video beside the row on hover (inline on tablets and phones). Every row opens
 * something: the case study, else its Devpost, live site or an email.
 */
function Row({ p, level: H }: { p: Project; level: "h2" | "h3" }) {
  const href = hrefOf(p)!;
  const external = !p.caseStudy;
  const media = p.media.hover ? { ...p.media, video: p.media.hover, poster: p.media.image } : p.media;
  const meta = [p.event !== p.title && p.event, p.medium, p.credit].filter(Boolean).join(". ");
  const title = <H className="text-[clamp(30px,3.6vw,52px)] leading-[1]">{p.title}</H>;
  const cover = "after:absolute after:inset-0";
  return (
    <li className="catalogue-row reveal group relative border-t border-rule py-8 md:py-10">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_9em] md:gap-10">
        <div>
          {external ? (
            <a
              href={href}
              className={cover}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {title}
            </a>
          ) : (
            <Link href={href} className={cover}>
              {title}
            </Link>
          )}
          {p.accolades && (
            <ul className="mt-4 flex flex-col gap-1.5 text-[15px] leading-[1.35]">
              {p.accolades.map((a) => (
                <li key={a} className="flex items-baseline gap-2.5">
                  <span aria-hidden className="award-dot" />
                  {a}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-[16px] leading-[1.5]">
          <p>{p.description}</p>
          <p className="mt-2 text-[15px] text-muted">
            {!meta.includes(p.year) && <span className="md:hidden">{p.year}. </span>}
            {meta}.{" "}
            <span className="whitespace-nowrap">
              {p.caseStudy ? "Case study" : p.link!.label}{" "}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                {href.startsWith("http") ? "\u2197" : "\u2192"}
              </span>
            </span>
          </p>
        </div>
        <p className="hidden text-[15px] text-muted md:block md:text-right">{p.year}</p>
      </div>
      <div className="catalogue-preview mt-6 lg:pointer-events-none lg:absolute lg:right-[12em] lg:top-1/2 lg:z-10 lg:mt-0 lg:w-[clamp(300px,26vw,400px)]">
        <ExhibitMedia media={media} sizes="(min-width: 1024px) 400px, 100vw" hoverPlay />
      </div>
    </li>
  );
}

export function WorkList({ projects, level = "h2" }: { projects: Project[]; level?: "h2" | "h3" }) {
  return (
    <ul className="border-b border-rule">
      {projects.map((p) => (
        <Row key={p.slug} p={p} level={level} />
      ))}
    </ul>
  );
}
