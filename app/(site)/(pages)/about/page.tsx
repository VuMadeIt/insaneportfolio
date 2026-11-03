import Image from "next/image";
import { ExhibitMedia } from "@/components/ExhibitMedia";
import { Timeline } from "@/components/Timeline";
import { essay, objects, portrait, statement } from "@/content/about";

export const metadata = {
  title: "About",
  description:
    "Lucas Vu: product designer, Systems Design Engineering at Waterloo, cadet, chess player, fisherman.",
};

/** About as a museum room: wall text with a portrait, the timeline, objects with labels, a reading room. */
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
            <span className="font-medium">Lucas at Senso-ji</span>
            <span className="block text-muted">Tokyo, a solo backpacking trip. Photograph.</span>
          </figcaption>
        </figure>
      </section>

      <Timeline />

      <section aria-labelledby="objects-title" className="px-[var(--gutter)] pb-[clamp(96px,14vh,180px)]">
        <h2 id="objects-title" className="reveal text-[clamp(36px,4.5vw,64px)] leading-[1]">
          Selected objects
        </h2>
        <div className="mt-12 grid gap-x-12 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
          {objects.map((o, k) => (
            <figure key={o.id} id={o.id} className={`reveal scroll-mt-24 ${k % 3 === 1 ? "lg:mt-24" : ""}`}>
              {o.image && (
                <ExhibitMedia
                  media={{
                    image: o.image.src,
                    alt: o.image.alt,
                    width: o.image.width,
                    height: o.image.height,
                  }}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                />
              )}
              {o.video && (
                <ExhibitMedia
                  media={{
                    video: o.video.src,
                    poster: o.video.poster,
                    alt: o.video.alt,
                    width: o.video.width,
                    height: o.video.height,
                  }}
                  sizes="30vw"
                />
              )}
              <figcaption className="mt-4 text-[15px] leading-[1.5]">
                <h3 className="text-[18px] leading-[1.3]">{o.title}</h3>
                <p className="text-muted">
                  {o.year}. {o.medium}.
                </p>
                <p className="mt-2 max-w-[30em] text-[16px]">{o.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <article
        aria-labelledby="essay-title"
        className="bg-[#e9e6df] px-[var(--gutter)] py-[clamp(96px,14vh,180px)]"
      >
        <div className="mx-auto max-w-[640px]">
          <h2 id="essay-title" className="text-[clamp(28px,4vw,56px)] leading-[1.05]">
            {essay.title}
          </h2>
          <p className="mt-4 text-[15px] text-muted">Reading room. An essay, {essay.date}.</p>
          <div className="mt-10 flex flex-col gap-6 text-[19px] leading-[1.65]">
            {essay.paragraphs.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
