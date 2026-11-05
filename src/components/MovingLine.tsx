"use client";

import gsap from "gsap";
import { Roboto_Flex } from "next/font/google";
import { Fragment, useEffect, useRef } from "react";
import {
  FILL,
  WDTHS,
  WGHTS,
  type Axes,
  bump,
  clamp,
  markerTargets,
  restEm,
  restWidthFor,
  solve,
} from "./flexFit";

// Only this line needs a real width axis; it sits below the fold, so the font is not preloaded.
const flex = Roboto_Flex({ subsets: ["latin"], axes: ["wdth", "opsz"], display: "swap", preload: false });

/** One line on wide screens; on phones each of these is its own line. */
const LINES = ["Let\u2019s get", "things moving."];
/** The resting width: condensed, with room to condense further as neighbours widen. */
const REST_WDTH = 50;
/** On wide screens the cap height stays within this share of the viewport height. */
const CAP_LIMIT = 0.42;
const CAP_RATIO = 0.712;
/** The pulse that travels through the line once it scrolls into view, like a clack down the cradle. */
const INTRO_MS = 1400;

const fvs = (a: Axes) => `"wght" ${a.wght.toFixed(1)}, "wdth" ${a.wdth.toFixed(2)}, "opsz" 144`;
const pulseEase = gsap.parseEase("power2.inOut");

interface Line {
  el: HTMLElement;
  letters: HTMLElement[];
  grids: Float64Array[];
  W: number;
  size: number;
  restW: number;
  es: number[];
  restCx: number[];
  cx: number[];
  shown: string[];
  targets?: number[];
  markerFor?: number;
}

/**
 * "Let's get things moving." (PLAN 15.1), reverse-engineered from Kern Society's hero: the line
 * always fills the column; letters near the pointer swell to black and extended while the rest
 * condense to hairlines, solved every frame so the advances add up exactly. Driven from GSAP's
 * ticker and stopped once everything settles. Phones have no pointer: a small ball on the ruler
 * follows the scroll and the letters above it swell. Reduced motion: the line rests.
 */
export function MovingLine({ id, className = "" }: { id?: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current!;
    const title = host.querySelector<HTMLElement>(".flex-line")!;
    const wm = host.querySelector<HTMLElement>(".flex-wm")!;
    const ruler = host.querySelector<HTMLElement>(".flex-ruler")!;
    const marker = host.querySelector<HTMLElement>(".flex-marker")!;
    const mqPhone = matchMedia("(max-width: 767px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, active: false };
    const scroll = { p: 0, target: 0 };
    let table: Record<string, Float64Array> | null = null;
    let lines: Line[] = [];
    let phone = false;
    let width = 0;
    let visible = false;
    let running = false;
    let scrolled = false;
    let introPending = !reduced;
    let introAt = 0;
    let cancelled = false;

    // Every glyph's advance at each grid weight and width, measured once the font is in.
    const measure = () => {
      const chars = [...new Set([...wm.querySelectorAll(".flex-l")].map((l) => l.textContent!))];
      const box = document.createElement("div");
      box.style.cssText =
        "position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;visibility:hidden;white-space:pre;font-size:200px;line-height:1;letter-spacing:0";
      const spans = chars.flatMap((ch) =>
        WGHTS.flatMap((wg) =>
          WDTHS.map((wd) => {
            const s = document.createElement("span");
            s.textContent = ch;
            s.style.cssText = `display:block;width:max-content;font-variation-settings:"wght" ${wg}, "wdth" ${wd}, "opsz" 144`;
            box.append(s);
            return s;
          }),
        ),
      );
      title.append(box);
      const n = WGHTS.length * WDTHS.length;
      table = Object.fromEntries(
        chars.map((ch, c) => [
          ch,
          Float64Array.from(spans.slice(c * n, (c + 1) * n), (s) => s.getBoundingClientRect().width / 200),
        ]),
      );
      box.remove();
    };

    const layout = (force = false) => {
      for (const L of lines) {
        const { axes, left, width: w } = solve(L.grids, L.es, L.restW, (L.W * FILL) / L.size);
        L.letters.forEach((el, i) => {
          const x = Math.round(left[i]! * L.size * 4) / 4;
          const f = fvs(axes[i]!);
          const key = `${f}|${x}`;
          if (force || key !== L.shown[i]) {
            el.style.fontVariationSettings = f;
            el.style.transform = `translate3d(${x}px,0,0)`;
            L.shown[i] = key;
          }
          L.cx[i] = (left[i]! + w[i]! / 2) * L.size;
        });
      }
    };

    const build = () => {
      if (!table) return;
      phone = mqPhone.matches;
      width = wm.getBoundingClientRect().width;
      wm.style.fontSize = "";
      wm.querySelectorAll<HTMLElement>(".flex-wm-line").forEach((l) => (l.style.fontSize = ""));
      wm.dataset.live = "";
      wm.toggleAttribute("data-phone", phone);
      const hosts = phone ? [...wm.querySelectorAll<HTMLElement>(".flex-wm-line")] : [wm];
      lines = hosts.map((el) => {
        const letters = [...el.querySelectorAll<HTMLElement>(".flex-l")];
        const grids = letters.map((l) => table![l.textContent!]!);
        let size = (width * FILL) / restEm(grids, REST_WDTH);
        if (!phone) size = Math.min(size, (CAP_LIMIT * innerHeight) / CAP_RATIO);
        el.style.fontSize = `${size.toFixed(3)}px`;
        const target = (width * FILL) / size;
        const restW = restWidthFor(grids, target);
        const rest = solve(
          grids,
          grids.map(() => 0),
          restW,
          target,
        );
        return {
          el,
          letters,
          grids,
          W: width,
          size,
          restW,
          es: grids.map(() => 0),
          restCx: rest.left.map((l, i) => l + rest.width[i]! / 2),
          cx: [],
          shown: [],
        };
      });
      layout(true);
      start();
    };

    const tick = (_time: number, deltaMs: number) => {
      const dt = clamp(deltaMs / 1000, 0.001, 0.064);
      const now = performance.now();
      const intro = introAt ? (now - introAt) / INTRO_MS : 1;
      let moving = intro < 1;
      if (!moving) introAt = 0;
      const ease = 1 - Math.exp(-dt * (phone ? 12 : 7.5));
      const vh = innerHeight;
      const r = ruler.getBoundingClientRect();
      let markerX = clamp(pointer.x - r.left, 0, width);
      let markerOn = false;

      if (phone) {
        // 0 as the line comes up from the bottom of the screen, 1 once it nears the top.
        const top = wm.getBoundingClientRect().top;
        scroll.target = clamp((vh * 0.9 - top) / (vh * 0.65), 0, 1);
        const dp = scroll.target - scroll.p;
        if (Math.abs(dp) > 0.0004) {
          scroll.p += dp * (1 - Math.exp(-dt * 10));
          moving = true;
        } else scroll.p = scroll.target;
        markerX = scroll.p * width;
        markerOn = true;
      }

      for (const L of lines) {
        const box = L.el.getBoundingClientRect();
        const radius = 2.4 * (L.W / L.letters.length);
        if (phone && scrolled && L.markerFor !== markerX) {
          const em = (px: number) => px / L.size;
          L.targets = markerTargets(L.grids, L.restCx, L.restW, em(L.W * FILL), em(markerX), em(radius));
          L.markerFor = markerX;
        }
        const py = pointer.y - box.top;
        const near = clamp(1 - (py < 0 ? -py : Math.max(0, py - box.height)) / (vh * 0.5), 0, 1);
        if (!phone && pointer.active && intro >= 1) markerOn = near > 0.4;
        L.es.forEach((e, i) => {
          let target = 0;
          if (phone) target = scrolled && L.targets ? L.targets[i]! : 0;
          else if (intro < 1)
            target = bump(pulseEase(clamp(intro, 0, 1)) * (L.W + 2 * radius) - radius, L.cx[i]!, radius);
          else if (pointer.active) target = near * bump(pointer.x - box.left, L.cx[i]!, radius);
          const d = target - e;
          if (Math.abs(d) > 0.001) {
            L.es[i] = e + d * ease;
            moving = true;
          } else L.es[i] = target;
        });
      }
      layout();
      marker.style.transform = `translate3d(${markerX.toFixed(1)}px,0,0)`;
      marker.toggleAttribute("data-on", markerOn);
      if (!moving) stop();
    };

    const start = () => {
      if (running || reduced || !visible || !lines.length) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      running = false;
      gsap.ticker.remove(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      start();
    };
    const onLeave = () => {
      pointer.active = false;
      start();
    };
    // The line moves under a still pointer too.
    const onScroll = () => {
      scrolled ||= phone;
      start();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        if (visible && introPending && !mqPhone.matches) {
          introPending = false;
          introAt = performance.now() + 150;
        }
        start();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    const ro = new ResizeObserver(() => {
      if (Math.abs(wm.getBoundingClientRect().width - width) > 0.5) build();
    });

    const family = getComputedStyle(wm).fontFamily;
    Promise.race([
      document.fonts.load(`600 100px ${family}`, LINES.join(" ")),
      new Promise((done) => setTimeout(done, 3000)),
    ])
      .catch(() => {})
      .then(() => {
        if (cancelled) return;
        measure();
        build();
        io.observe(host);
        ro.observe(wm);
      });
    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={root} className={className}>
      <h2 id={id} className={`flex-line ${flex.className}`}>
        <span className="sr-only">{LINES.join(" ")}</span>
        <span aria-hidden className="flex-wm">
          {LINES.map((line, li) => (
            <Fragment key={line}>
              {li > 0 && <span className="flex-l flex-sp"> </span>}
              <span className="flex-wm-line">
                {[...line].map((ch, i) => (
                  <span key={i} className="flex-l">
                    {ch}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </span>
      </h2>
      <div aria-hidden className="flex-ruler">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
        <i className="flex-marker metal-ball" />
      </div>
    </div>
  );
}
