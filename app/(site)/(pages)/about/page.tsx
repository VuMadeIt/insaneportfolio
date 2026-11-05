import Image from "next/image";
import { SelectedObjects } from "@/components/SelectedObjects";
import { Timeline } from "@/components/Timeline";
import { objects, portrait, statement } from "@/content/about";

export const metadata = {
  title: "About",
  description: "Product designer, Systems Design Engineering at Waterloo, cadet, chess player, fisherman.",
};

/** About: who I am with a portrait, the timeline, things from outside work. */
export default function AboutPage() {
  return (
    <>
      <section
        aria-labelledby="about-title"
        className="grid gap-12 px-[var(--gutter)] pb-[clamp(96px,14vh,180px)] pt-[clamp(72px,12vh,140px)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:items-end"
      >
        <div>
          <h1 id="about-title" className="text-[clamp(56px,9vw,148px)] leading-[0.9]">
            About
          </h1>
          <div className="mt-10 flex max-w-[34em] flex-col gap-5 text-[clamp(19px,1.6vw,23px)] leading-[1.5]">
            {statement.map((s, k) => (
              <p key={k} className="reveal">
                {s}
              </p>
            ))}
          </div>
        </div>
        <figure className="reveal">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="h-auto w-full rounded-md"
            priority
          />
          <figcaption className="mt-3 text-[15px] leading-[1.5]">
            <span>Senso-ji, Tokyo</span>
            <span className="block text-muted">A solo backpacking trip.</span>
          </figcaption>
        </figure>
      </section>

      <Timeline now={new Date().toISOString().slice(0, 7)} />

      <SelectedObjects objects={objects} />
    </>
  );
}
