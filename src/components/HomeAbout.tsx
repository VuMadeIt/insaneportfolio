import Link from "next/link";
import { statement } from "@/content/about";
import { MovingLine } from "./MovingLine";

/**
 * The home page's about teaser (PLAN 13.4, 14.5): the line across the top with a ball for the "o",
 * then who I am in two columns, the way to the full About page under the second.
 */
export function HomeAbout() {
  const [first, second] = statement;
  return (
    <section
      aria-labelledby="about-teaser-title"
      className="grid gap-x-[clamp(40px,6vw,112px)] gap-y-6 px-[var(--gutter)] pb-[clamp(96px,14vh,180px)] pt-[clamp(120px,18vh,220px)] md:grid-cols-2"
    >
      <MovingLine
        id="about-teaser-title"
        className="mb-[clamp(24px,5vh,56px)] text-[clamp(40px,7.4vw,132px)] leading-[0.92] tracking-[-0.045em] md:col-span-2"
      />
      <p className="reveal max-w-[32em] leading-[1.55]">{first}</p>
      <div>
        <p className="reveal max-w-[32em] leading-[1.55]">{second}</p>
        <Link href="/about" className="link-arrow reveal mt-8 inline-block text-[18px]">
          More about me <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
