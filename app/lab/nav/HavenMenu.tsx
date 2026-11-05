"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SoundButton } from "@/components/SiteNav";
import { CONTACT } from "@/content/contact";
import s from "./menu.module.css";

const LINKS = [
  ["home", "/"],
  ["work", "/work"],
  ["about", "/about"],
  ["contact", `mailto:${CONTACT.email}`],
] as const;

/**
 * The Haven Constructions menu, for comparison with the current nav (PLAN 15.7): a quiet pill in
 * the middle that darkens on hover and opens into a panel of rows that rise in one after another.
 * Escape, a click outside or picking a link closes it.
 */
export function HavenMenu() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = useRef<HTMLDivElement>(null);
  // In the lab it stands in for the home page's nav.
  const path = usePathname();
  const pathname = path.startsWith("/lab") ? "/" : path;

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !nav.current?.contains(e.target as Node) && setOpen(false);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <header className={`${s.bar} font-display ${scrolled ? s.scrolled : ""}`}>
      <Link href="/" aria-label="Lucas Vu, home" className={s.home}>
        <Image src="/media/objects/ball.webp" alt="" width={24} height={24} className="size-6" />
      </Link>
      <nav ref={nav} aria-label="Site" className={`${s.nav} ${open ? s.open : ""}`}>
        <button
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls="haven-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "close" : "menu"}
          <span className={s.burger} aria-hidden>
            <span />
            <span />
          </span>
        </button>
        <div id="haven-menu" className={s.menu} inert={!open}>
          <div className={s.inner}>
            <ul className={s.rows}>
              {LINKS.map(([name, href], i) => {
                const A = href.startsWith("/") ? Link : "a";
                return (
                  <li key={name} className={s.row} style={{ transitionDelay: `${i * 0.04}s` }}>
                    <A
                      href={href}
                      className={`${s.link} ${href === pathname ? s.current : ""}`}
                      aria-current={href === pathname ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span>{name}</span>
                    </A>
                  </li>
                );
              })}
            </ul>
            <ul className={s.contacts}>
              <li className={s.contact} style={{ transitionDelay: "0.16s" }}>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email} &#8599;</a>
              </li>
              <li className={s.contact} style={{ transitionDelay: "0.2s" }}>
                <a href={CONTACT.linkedin}>linkedin &#8599;</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className={s.right}>
        <a href={`mailto:${CONTACT.email}`} className="u-grow max-sm:hidden">
          say hi
        </a>
        <SoundButton />
      </div>
    </header>
  );
}
