"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useLayoutEffect, useRef } from "react";
import { objects, statement } from "@/content/about";
import { Close } from "./Close";

gsap.registerPlugin(ScrollTrigger);

const QUOTE = ["Let's", "get", "things"];
/** Photos for the strip; each opens its object on /about. */
const STRIP = ["cadets", "chess", "hack-the-6ix", "fishing"].map((id) => objects.find((o) => o.id === id)!);
const pic = (o: (typeof objects)[number]) =>
  o.image ? { src: o.image.src, alt: o.image.alt } : { src: o.video!.poster, alt: o.video!.alt };

/**
 * The home page's dark half. As it arrives the whole page fades to black (the work list above
 * included), the quote lights up word by word with the scroll, then the about teaser, a strip of
 * photos that open their stories on /about, and the contact close. Without JavaScript it is simply
 * dark; under reduced motion nothing is scrubbed.
 */
export function HomeAbout() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current!;
    const ctx = gsap.context(() => {
      const light = {
        backgroundColor: "#f3f1ec",
        color: "#121212",
        "--color-muted": "#68655e",
        "--color-rule": "#d9d6cf",
      };
      const dark = {
        backgroundColor: "#0e0e0c",
        color: "#f3f1ec",
        "--color-muted": "#a29f97",
        "--color-rule": "#2c2c29",
      };
      gsap.fromTo([document.getElementById("work"), el], light, {
        ...dark,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", end: "top 30%", scrub: true },
      });
      gsap.fromTo(
        el.querySelectorAll(".quote-word"),
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: el.querySelector(".quote"),
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="home-dark bg-night text-wall">
      <section aria-labelledby="quote" className="px-[var(--gutter)] pt-[clamp(160px,26vh,300px)]">
        <h2
          id="quote"
          className="quote max-w-[10em] text-[clamp(56px,10vw,172px)] leading-[0.92] tracking-[-0.045em]"
        >
          {QUOTE.map((w) => (
            <Fragment key={w}>
              <span className="quote-word inline-block">{w}</span>{" "}
            </Fragment>
          ))}
          <em className="quote-word inline-block font-normal">moving.</em>
        </h2>
      </section>

      <section
        aria-labelledby="about-teaser-title"
        className="grid gap-12 px-[var(--gutter)] pt-[clamp(120px,20vh,240px)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] md:items-start md:gap-[clamp(40px,6vw,96px)]"
      >
        <figure className="reveal relative aspect-[4/5] overflow-hidden rounded-lg">
          <Image
            src="/media/about/profile.webp"
            alt="Lucas in a bright hallway, arms crossed, grinning"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover object-[50%_30%]"
          />
        </figure>
        <div className="md:sticky md:top-[clamp(96px,14vh,160px)]">
          <p className="reveal text-[15px] text-muted">about me</p>
          <h3 id="about-teaser-title" className="reveal mt-3 text-[clamp(40px,5vw,76px)] leading-[1]">
            Who&apos;s Vu?
          </h3>
          {statement.map((s, k) => (
            <p key={k} className="reveal mt-6 max-w-[30em] leading-[1.55]">
              {s}
            </p>
          ))}
          <Link href="/about" className="link-arrow reveal mt-10 inline-block text-[18px]">
            More about me <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="strip-title" className="px-[var(--gutter)] pt-[clamp(120px,18vh,220px)]">
        <h3 id="strip-title" className="reveal text-[15px] font-normal tracking-normal text-muted">
          Things I&apos;ve done, away from a screen
        </h3>
        <ul className="mt-6 grid grid-cols-2 gap-[clamp(12px,1.4vw,20px)] md:grid-cols-4">
          {STRIP.map((o) => {
            const { src, alt } = pic(o);
            return (
              <li key={o.id} className="reveal">
                <Link
                  href={`/about#${o.id}`}
                  className="group block"
                  aria-label={`${o.title}. Read more on About.`}
                >
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-md">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-3 text-[15px]">
                    <span>{o.year}</span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Close title="Let's talk." className="bg-transparent" />
    </div>
  );
}
