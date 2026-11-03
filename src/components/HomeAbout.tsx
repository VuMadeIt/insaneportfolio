import Link from "next/link";
import { statement } from "@/content/about";

/**
 * The home page's about teaser (PLAN 13.4): light like the rest of the site, no photos. The line
 * across the left, who I am on the right, and the way to the full About page.
 */
export function HomeAbout() {
  return (
    <section
      aria-labelledby="about-teaser-title"
      className="grid gap-10 px-[var(--gutter)] pb-[clamp(40px,8vh,96px)] pt-[clamp(120px,18vh,220px)] md:grid-cols-2 md:gap-x-[clamp(40px,6vw,112px)]"
    >
      <h2
        id="about-teaser-title"
        className="reveal text-[clamp(40px,7.4vw,132px)] leading-[0.92] tracking-[-0.045em] md:col-span-2"
      >
        Let&apos;s get things moving.
      </h2>
      <div className="md:col-start-2">
        {statement.map((s, k) => (
          <p key={k} className="reveal mt-5 max-w-[32em] leading-[1.55] first:mt-0">
            {s}
          </p>
        ))}
        <Link href="/about" className="link-arrow reveal mt-8 inline-block text-[18px]">
          More about me <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
