"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SoundButton } from "./SiteNav";
import { CONTACT } from "@/content/contact";
import s from "./HavenMenu.module.css";

const LINKS = [
  ["home", "/"],
  ["work", "/work"],
  ["about", "/about"],
  ["contact", `mailto:${CONTACT.email}`],
] as const;

/**
 * The phone nav (PLAN 15.7, 15.11), after havenconstructions.com.au: the whole nav is one pill in
 * the middle that opens into rows rising one after another, with the email, LinkedIn and the sound
 * switch underneath. Escape, a tap outside or picking a link closes it. Shown below 768 px only
 * (HavenMenu.module.css); `hidden` sends it away while a story is open.
 */
export function HavenMenu({ hidden = false }: { hidden?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const pathname = usePathname();

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
    <header
      className={`${s.bar} font-display ${scrolled ? s.scrolled : ""} ${hidden ? s.away : ""}`}
      inert={hidden}
    >
      <nav ref={nav} aria-label="Site" className={`${s.nav} ${open ? s.open : ""}`}>
        <button
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls="haven-menu"
          onClick={() => setOpen((o) => !o)}
        >
          menu
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
            <ul className={s.extras}>
              <li className={s.extra} style={{ transitionDelay: "0.16s" }}>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email} &#8599;</a>
              </li>
              <li className={s.extra} style={{ transitionDelay: "0.2s" }}>
                <a href={CONTACT.linkedin}>linkedin &#8599;</a>
              </li>
              <li className={s.extra} style={{ transitionDelay: "0.24s" }}>
                <SoundButton labelled className="" />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
