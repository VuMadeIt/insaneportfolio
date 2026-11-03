import Link from "next/link";
import { CONTACT } from "@/content/contact";
import { BallPit } from "./BallPit";

const PAGES = [
  ["home", "/"],
  ["work", "/work"],
  ["about", "/about"],
] as const;
const SOCIALS = [
  ["linkedin", CONTACT.linkedin],
  ["github", CONTACT.github],
  ["devpost", CONTACT.devpost],
  ["instagram", CONTACT.instagram],
  ["x", CONTACT.x],
  ["medium", CONTACT.medium],
] as const;
const NAME = "i am lucas vu.";

/**
 * The close, laid out like Lucas's Framer site (PLAN 12.10, 13.4) in the site's light colours:
 * the contact lines top left, pages and socials top right, the name across the middle, the
 * tagline bottom left. On home every text box is solid and clicking empty space drops a ball
 * (`physics`); elsewhere it is the same layout, still.
 */
export function Footer({ physics = false }: { physics?: boolean }) {
  return (
    <footer
      aria-labelledby="footer-title"
      data-cursor={physics ? "drop" : undefined}
      className={`relative flex flex-col overflow-hidden bg-wall px-[var(--gutter)] pb-[clamp(24px,4vh,40px)] pt-[clamp(96px,14vh,160px)] ${physics ? "min-h-[100svh] select-none" : ""}`}
    >
      <div className="relative z-10 grid gap-12 text-[17px] leading-[1.6] md:grid-cols-[minmax(0,1fr)_auto]">
        <dl className="grid w-fit grid-cols-[auto_auto] content-start gap-x-3">
          <dt data-solid className="text-muted">
            email:
          </dt>
          <dd data-solid>
            <a href={`mailto:${CONTACT.email}`} className="u-grow">
              {CONTACT.email}
            </a>
          </dd>
          <dt data-solid className="text-muted">
            based in:
          </dt>
          <dd data-solid>toronto, ontario</dd>
          <dt data-solid className="text-muted">
            available for:
          </dt>
          <dd data-solid>summer 2027 co-ops</dd>
        </dl>
        <div className="flex gap-[clamp(40px,6vw,96px)]">
          {(
            [
              ["pages", PAGES],
              ["socials", SOCIALS],
            ] as const
          ).map(([label, links]) => (
            <div key={label}>
              <p data-solid className="w-fit text-muted">
                {label}
              </p>
              <ul className="mt-1">
                {links.map(([name, href]) => (
                  <li key={name}>
                    {href.startsWith("/") ? (
                      <Link href={href} className="u-grow" data-solid>
                        {name}
                      </Link>
                    ) : (
                      <a href={href} className="u-grow" data-solid>
                        {name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <h2
        id="footer-title"
        data-solid={physics ? "letters" : undefined}
        className="footer-name relative z-10 mt-auto self-center whitespace-nowrap pt-[clamp(72px,12vh,140px)] font-display"
      >
        {physics ? (
          <>
            <span className="sr-only">{NAME}</span>
            {[...NAME].map((c, i) => (
              <span key={i} aria-hidden data-letter>
                {c === " " ? "\u00a0" : c}
              </span>
            ))}
          </>
        ) : (
          NAME
        )}
      </h2>
      <p data-solid className="relative z-10 mt-[clamp(32px,6vh,64px)] w-fit text-[17px]">
        to excel, all i need is wifi + good vibes.
      </p>
      {physics && <BallPit />}
    </footer>
  );
}
