"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { type Role, chronology } from "@/content/about";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
/** Months since year 0, so ranges are simple subtraction. */
const m = (ym: string) => {
  const [y, mo] = ym.split("-").map(Number);
  return y! * 12 + mo! - 1;
};
const label = (n: number) => `${FULL[n % 12]} ${Math.floor(n / 12)}`;
const span = (r: Role) => {
  const a = m(r.start);
  const from = `${MONTHS[a % 12]} ${Math.floor(a / 12)}`;
  if (!r.end) return `${from} to now`;
  const b = m(r.end);
  return Math.floor(a / 12) === Math.floor(b / 12)
    ? `${MONTHS[a % 12]} to ${MONTHS[b % 12]} ${Math.floor(b / 12)}`
    : `${from} to ${MONTHS[b % 12]} ${Math.floor(b / 12)}`;
};
const endOf = (r: Role, now: number) => (r.end ? m(r.end) : now);
const overlaps = (a: Role, b: Role, now: number) =>
  a !== b && m(a.start) <= endOf(b, now) && m(b.start) <= endOf(a, now);
const query = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const subscribe = (cb: () => void) => {
  const mq = matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Greedy lanes: a role takes the first lane whose last role ended before it starts. */
function lanes(roles: Role[], now: number) {
  const ends: number[] = [];
  return roles.map((r) => {
    const start = m(r.start);
    let lane = ends.findIndex((e) => e < start);
    if (lane < 0) lane = ends.length;
    ends[lane] = endOf(r, now);
    return lane;
  });
}

function Logo({ role, size }: { role: Role; size: "lg" | "sm" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden ${size === "lg" ? "size-[clamp(80px,8vw,128px)] rounded-lg p-3.5" : "size-7 rounded-[6px] p-1"} ${role.dark ? "bg-night" : "bg-white"}`}
    >
      <Image
        src={`/media/logos/${role.logo}.png`}
        alt=""
        width={size === "lg" ? 128 : 40}
        height={size === "lg" ? 128 : 40}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

function Section({ role, also }: { role: Role; also: Role[] }) {
  return (
    <div className="grid w-full gap-x-[clamp(24px,3vw,56px)] gap-y-6 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,0.5fr)] md:items-start">
      <Logo role={role} size="lg" />
      <div>
        <h3 className="max-w-[18em] text-[clamp(32px,4.2vw,72px)] leading-[0.98]">{role.role}</h3>
        <p className="mt-4 text-[clamp(19px,1.6vw,24px)]">
          {role.place} <span className="text-muted">· {span(role)}</span>
        </p>
        <p className="mt-6 max-w-[32em] text-[clamp(17px,1.35vw,20px)] leading-[1.55]">{role.text}</p>
        {role.link && (
          <a
            href={role.link.href}
            className="link-arrow mt-5 inline-block text-[16px]"
            {...(role.link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {role.link.label} <span aria-hidden>&rarr;</span>
          </a>
        )}
      </div>
      {also.length > 0 && (
        <div className="text-[15px]">
          <p className="text-muted">At the same time</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {also.map((a) => (
              <li key={a.place} className="flex items-center gap-3">
                <Logo role={a} size="sm" />
                <span>
                  {a.role}, {a.place}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * The chronology (PLAN 13.5). A pinned stage: the time axis runs across the bottom with every
 * role as a bar in its own lane, so roles that overlap are seen overlapping. Scrolling moves a
 * small dark-metal ball along the axis from one role's start to the next, and the role it reaches
 * gets the stage above: logo, title, place, dates, a line, and what else was going on then.
 * Without the pin (phones, reduced motion) every section is listed above the same chart.
 */
const roles = chronology;
const ROW = 40;

export function Timeline({ now: nowYm }: { now: string }) {
  const g = useMemo(() => {
    const now = m(nowYm);
    const first = Math.min(...roles.map((r) => m(r.start)));
    const months = now - first + 1;
    const lane = lanes(roles, now);
    const x = (month: number) => ((month - first) / months) * 100;
    return {
      now,
      first,
      months,
      lane,
      laneCount: Math.max(...lane) + 1,
      x,
      stops: roles.map((r) => x(m(r.start))),
    };
  }, [nowYm]);
  const { now, first, months, lane, laneCount, x } = g;

  const track = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const pinned = useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => false,
  );

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      const f = p * (roles.length - 1);
      const i = Math.min(roles.length - 2, Math.floor(f));
      const t = f - i;
      // Ease between stops so the ball rests a moment on each role, then rolls to the next.
      const e = t < 0.35 ? 0 : t > 0.85 ? 1 : (t - 0.35) / 0.5;
      const s = e * e * (3 - 2 * e);
      const at = g.stops[i]! + (g.stops[i + 1]! - g.stops[i]!) * s;
      if (head.current) head.current.style.left = `${at}%`;
      if (readout.current) readout.current.textContent = label(Math.round(g.first + (at / 100) * g.months));
      setActive(Math.round(i + s));
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinned, g]);

  const jump = (i: number) => {
    const el = track.current;
    if (!el || !pinned) return;
    const top = el.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + ((el.offsetHeight - innerHeight) * i) / (roles.length - 1) });
  };

  const also = (i: number) => roles.filter((o) => overlaps(roles[i]!, o, now));

  const chart = (
    <div className="relative" style={{ height: laneCount * ROW + 44 }}>
      {roles.map((r, i) => {
        const end = r.end ? m(r.end) + 1 : now + 1;
        const on = pinned && i === active;
        const near = pinned && also(active).includes(r);
        return (
          <button
            key={r.place + r.role}
            type="button"
            onClick={() => jump(i)}
            tabIndex={pinned ? 0 : -1}
            aria-label={`${r.role}, ${r.place}, ${span(r)}`}
            className={`absolute flex h-8 items-center gap-2 overflow-hidden rounded-full pl-1 pr-3 text-left text-[14px] transition-colors duration-500 ${on ? "bg-ink text-wall" : near ? "bg-[#d9d6cf] text-ink" : "bg-[#e8e5de] text-[#55524b]"}`}
            style={{ left: `${x(m(r.start))}%`, width: `${x(end) - x(m(r.start))}%`, top: lane[i]! * ROW }}
          >
            <Logo role={r} size="sm" />
            <span className="truncate">{r.place}</span>
          </button>
        );
      })}
      <div className="absolute inset-x-0 bg-ink" style={{ top: laneCount * ROW + 6, height: 2 }} />
      {Array.from({ length: months }, (_, k) => first + k).map((n) => (
        <span
          key={n}
          className="absolute -translate-x-1/2 text-[12px] text-muted tabular-nums"
          style={{ left: `${x(n)}%`, top: laneCount * ROW + 18 }}
        >
          {n % 12 === 0 || n === first ? (
            <b className="font-medium text-ink">{Math.floor(n / 12)}</b>
          ) : (
            MONTHS[n % 12]![0]
          )}
        </span>
      ))}
      {pinned && (
        <div
          ref={head}
          aria-hidden
          className="pointer-events-none absolute top-[-14px] w-0"
          style={{ left: `${g.stops[0]}%`, height: laneCount * ROW + 21 }}
        >
          <span className="absolute -left-px inset-y-0 w-[2px] bg-ink/60" />
          <span className="metal-ball absolute -left-[10px] -bottom-[10px] size-[20px]" />
        </div>
      )}
    </div>
  );

  if (!pinned) {
    return (
      <section aria-labelledby="chronology-title" className="px-[var(--gutter)] pb-[clamp(96px,14vh,180px)]">
        <h2 id="chronology-title" className="text-[clamp(36px,4.5vw,64px)] leading-[1]">
          Chronology
        </h2>
        <ol className="mt-12 flex flex-col gap-16">
          {roles.map((r, i) => (
            <li key={r.place + r.role} className="timeline-stop reveal">
              <Section role={r} also={also(i)} />
            </li>
          ))}
        </ol>
        <div className="mt-16 overflow-x-auto pb-2">
          <div className="min-w-[640px]">{chart}</div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="chronology-title">
      <div ref={track} style={{ height: `${roles.length * 70 + 100}svh` }}>
        <div className="sticky top-0 flex h-svh flex-col px-[var(--gutter)] pb-[clamp(32px,6vh,72px)] pt-[clamp(40px,8vh,96px)]">
          <div className="flex items-baseline justify-between gap-6">
            <h2 id="chronology-title" className="text-[clamp(36px,4.5vw,64px)] leading-[1]">
              Chronology
            </h2>
            <p
              ref={readout}
              aria-hidden
              className="font-display text-[clamp(20px,2vw,30px)] font-medium tabular-nums"
            >
              {label(first)}
            </p>
          </div>
          <ol className="relative my-[clamp(24px,4vh,48px)] flex-1">
            {roles.map((r, i) => (
              <li
                key={r.place + r.role}
                className="timeline-stop absolute inset-0 flex items-center"
                aria-current={i === active ? "step" : undefined}
                data-on={i === active ? "" : undefined}
              >
                <Section role={r} also={also(i)} />
              </li>
            ))}
          </ol>
          {chart}
        </div>
      </div>
    </section>
  );
}
