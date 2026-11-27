"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Visual } from "@/content/caseStudies/types";
import { COMPONENTS, SpacingScale } from "./Specimens";

type Of = Extract<Visual, { kind: "system" }>;

/** Letters only the Vietnamese cut has (Google Fonts' vietnamese subset, as precomposed letters). */
const VI = /[\u0102\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01A0\u01A1\u01AF\u01B0\u1EA0-\u1EF9]/;
const FACE = { display: "'PN Display', Arial, sans-serif", text: "'PN Text', Arial, sans-serif" };
const INK = "#0e0e0e";
const CREAM = "#f4ebdf";
const ACCENT = "#87133e";
const MUTED = "#5c5148";
const EASE = "transition-opacity motion-reduce:transition-none";

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};
const grade = (r: number, edge: boolean) =>
  r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? (edge ? "AA for edges" : "AA large") : "Fails";

type Page = { id: string; group: string; title: string; lede: string };

/** Tabs that look like the docs' own: text with an ink underline under the chosen one. */
function Tabs({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  return (
    <div role="group" aria-label="View" className="flex gap-5 border-b border-ink/15">
      {["Preview", "Measured", "Code"].map((t, i) => (
        <button
          key={t}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`-mb-px min-h-10 border-b-2 text-[15px] transition-colors duration-200 ${
            value === i ? "border-ink" : "border-transparent text-[#5c5148] hover:text-ink"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function CopyCode({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 2000);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <div className="relative w-full self-stretch">
      <pre className="overflow-x-auto rounded-[10px] bg-ink px-5 py-4 text-[14px] leading-[1.6] text-[#f4ebdf]">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard?.writeText(code).then(
            () => setDone(true),
            () => {},
          )
        }
        className="absolute top-2 right-2 min-h-9 rounded-full bg-[#f4ebdf]/10 px-3.5 text-[13px] text-[#f4ebdf] transition-colors duration-200 hover:bg-[#f4ebdf]/20"
      >
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

const H4 = ({ children, at }: { children: ReactNode; at?: (el: HTMLElement | null) => void }) => (
  <h4 ref={at} className="mt-10 scroll-mt-24 text-[17px] font-semibold">
    {children}
  </h4>
);

function ComponentPage({ i }: { i: number }) {
  const c = COMPONENTS[i]!;
  const [view, setView] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const parts = ["Preview", "Properties", "Accessibility"];
  return (
    <div className="grid gap-10 @5xl:grid-cols-[minmax(0,1fr)_9em]">
      <div className="min-w-0">
        <div ref={(el) => void (refs.current[0] = el)} className="scroll-mt-24">
          <Tabs value={view} onChange={setView} />
        </div>
        <div className="mt-4 grid min-h-[230px] place-items-center overflow-hidden rounded-[12px] border border-ink/15 bg-[#fbf7f1] px-2 py-12 @xl:px-6">
          {[0, 1, 2].map((k) => (
            <div
              key={k}
              inert={view !== k}
              className={`${EASE} [grid-area:1/1] ${k === 2 ? "w-full max-w-[26em]" : "pb-8 @xl:pr-10"} ${view === k ? "duration-300 ease-[var(--ease-out)]" : "pointer-events-none opacity-0 duration-100"}`}
            >
              {k === 2 ? <CopyCode code={c.code} /> : <c.Spec on={k === 1} />}
            </div>
          ))}
        </div>
        <H4 at={(el) => void (refs.current[1] = el)}>Properties</H4>
        <dl className="mt-3 grid text-[15px]">
          {c.rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8em_1fr] gap-4 border-t border-ink/10 py-2.5">
              <dt style={{ color: MUTED }}>{k}</dt>
              <dd className="tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <H4 at={(el) => void (refs.current[2] = el)}>Accessibility</H4>
        <p className="mt-2" style={{ color: MUTED }}>
          {c.a11y}
        </p>
      </div>
      {
        <nav aria-label="On this page" className="sticky top-0 hidden self-start @5xl:block">
          <p className="text-[13px] font-semibold">On this page</p>
          <ul className="mt-2 grid gap-1.5 text-[14px]" style={{ color: MUTED }}>
            {parts.map((t, k) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => refs.current[k]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="text-left hover:text-ink"
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      }
    </div>
  );
}

const Table = ({ head, rows }: { head: [string, string]; rows: [ReactNode, ReactNode][] }) => (
  <table className="w-full text-left text-[15px]">
    <thead>
      <tr style={{ color: MUTED }}>
        {head.map((h) => (
          <th key={h} className="pb-2 text-[13px] font-normal">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map(([a, b], i) => (
        <tr key={i} className="border-t border-ink/10">
          <td className="py-2.5 pr-4">{a}</td>
          <td className="py-2.5 tabular-nums">{b}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/**
 * The salon's design system as a small docs site in a window, modelled on the Hack Canada docs:
 * a side nav of foundations and components, and one page per item in the salon's own fonts.
 */
export function System({ v }: { v: Of }) {
  const pages: Page[] = [
    {
      id: "overview",
      group: "Start here",
      title: "Overview",
      lede: "One system for the booking site and the staff app. Each page is one rule and its specimen.",
    },
    {
      id: "tokens",
      group: "Start here",
      title: "Tokens",
      lede: "Every colour, corner and gap the two apps share, in one place.",
    },
    { id: "colour", group: "Foundations", title: "Colour", lede: v.rules.colour },
    { id: "type", group: "Foundations", title: "Type", lede: v.rules.type },
    { id: "shape", group: "Foundations", title: "Shape", lede: v.rules.shape },
    { id: "spacing", group: "Foundations", title: "Spacing", lede: v.rules.spacing },
    {
      id: "a11y",
      group: "Foundations",
      title: "Accessibility",
      lede: "Big enough to tap, dark enough to read, and every Vietnamese letter in the right font.",
    },
    ...COMPONENTS.map((c, i) => ({ id: `c${i}`, group: "Components", title: c.name, lede: c.lede })),
  ];
  const groups = [...new Set(pages.map((p) => p.group))];
  const [at, setAt] = useState(0);
  const [q, setQ] = useState("");
  const main = useRef<HTMLDivElement>(null);
  useEffect(() => {
    main.current?.scrollTo({ top: 0 });
  }, [at]);
  const go = (id: string) => setAt(pages.findIndex((p) => p.id === id));
  const current = pages[at]!;
  const found = pages.filter((p) => p.title.toLowerCase().includes(q.trim().toLowerCase()));
  const hex = (name: string) => v.colours.find((c) => c.name === name)?.hex ?? INK;
  const pass = (r: number, need: number) => `${r.toFixed(1)}:1 · ${r >= need ? "passes" : "fails"}`;

  const body: Record<string, ReactNode> = {
    overview: (
      <ul className="grid gap-3 @xl:grid-cols-2">
        {pages
          .filter((p) => p.group === "Foundations")
          .concat({ ...pages.find((p) => p.id === "c0")!, title: "Components", lede: v.rules.components })
          .map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => go(p.id)}
                className="group h-full w-full rounded-[12px] border border-ink/15 bg-[#fbf7f1] px-5 py-4 text-left transition-colors duration-200 hover:border-ink/40"
              >
                <span className="block font-semibold group-hover:underline">{p.title}</span>
                <span className="mt-1 block text-[15px] leading-[1.45]" style={{ color: MUTED }}>
                  {p.lede}
                </span>
              </button>
            </li>
          ))}
      </ul>
    ),
    tokens: (
      <div className="grid items-start gap-8 @xl:grid-cols-2">
        <div>
          <Table
            head={["Colour", "Value"]}
            rows={v.colours.map((c) => [
              <span key={c.name} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-4 rounded-full shadow-[inset_0_0_0_1px_rgb(14_14_14/0.15)]"
                  style={{ background: c.hex }}
                />
                {c.name}
              </span>,
              <span key="v" className="uppercase">
                {c.hex}
              </span>,
            ])}
          />
        </div>
        <div className="grid content-start gap-8">
          <Table
            head={["Corner", "Value"]}
            rows={[
              ["Cards, sheets", "0"],
              ["Fields, tiles", "12"],
              ["Buttons, chips", "999"],
            ]}
          />
          <Table head={["Space", "Value"]} rows={[["4 px grid", "4 · 8 · 12 · 16 · 20 · 24 · 32"]]} />
          <Table head={["Face", "Use"]} rows={v.faces.map((f) => [f.name, f.use])} />
        </div>
      </div>
    ),
    a11y: (
      <div className="grid gap-8">
        <div>
          <h4 className="text-[17px] font-semibold">Tap targets</h4>
          <p className="mt-1 mb-3 text-[15px]" style={{ color: MUTED }}>
            In the staff app nothing you tap is under 48 px.
          </p>
          <Table
            head={["Component", "Height"]}
            rows={COMPONENTS.filter((c) => c.rows[0]![0] === "Height").map((c) => [
              c.name,
              `${c.rows[0]![1]} px · passes`,
            ])}
          />
        </div>
        <div>
          <h4 className="text-[17px] font-semibold">Contrast</h4>
          <p className="mt-1 mb-3 text-[15px]" style={{ color: MUTED }}>
            Text needs 4.5:1. A control&rsquo;s edge needs 3:1 against what it sits on.
          </p>
          <Table
            head={["Pair", "Ratio"]}
            rows={[
              ["Ink text on Cream", pass(ratio(INK, hex("Cream")), 4.5)],
              ["Ink text on Card", pass(ratio(INK, hex("Card")), 4.5)],
              ["Cream text on Burgundy", pass(ratio(CREAM, hex("Burgundy")), 4.5)],
              ["Line edge on Card", pass(ratio(hex("Line"), hex("Card")), 3)],
            ]}
          />
        </div>
        <div>
          <h4 className="text-[17px] font-semibold">Vietnamese letters</h4>
          <p className="mt-1 text-[15px]" style={{ color: MUTED }}>
            {v.proof.after} See Type.
          </p>
        </div>
      </div>
    ),
    colour: (
      <ul className="grid">
        {v.colours.map((c) => {
          const base = v.colours.find((o) => o.name === c.against);
          const text = ratio(INK, c.hex) >= ratio(CREAM, c.hex) ? INK : CREAM;
          const r = ratio(base ? base.hex : text, c.hex);
          return (
            <li
              key={c.hex}
              className="grid grid-cols-[56px_1fr] items-center gap-x-4 gap-y-1 border-t border-ink/10 py-3 first:border-t-0 @xl:grid-cols-[56px_1fr_auto]"
            >
              <span
                aria-hidden
                className="row-span-2 grid size-14 place-items-center rounded-[10px] text-[18px] font-semibold @xl:row-span-1"
                style={
                  base
                    ? { background: base.hex, boxShadow: `inset 0 0 0 1.5px ${c.hex}` }
                    : { background: c.hex, color: text, boxShadow: "inset 0 0 0 1px rgb(14 14 14 / 0.12)" }
                }
              >
                {base ? "" : "Aa"}
              </span>
              <span>
                <span className="block font-semibold">{c.name}</span>
                <span className="text-[14px]" style={{ color: MUTED }}>
                  {c.role}
                </span>
              </span>
              <span className="text-[14px] tabular-nums @xl:text-right">
                <span className="uppercase">{c.hex}</span>
                <span className="block" style={{ color: MUTED }}>
                  {r.toFixed(1)}:1 {base ? `on ${base.name}` : text === INK ? "Ink text" : "Cream text"} ·{" "}
                  {grade(r, !!base)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    ),
    type: (
      <>
        <div className="grid gap-3 @xl:grid-cols-2">
          {v.faces.map((f) => (
            <div key={f.name} className="rounded-[12px] border border-ink/15 bg-[#fbf7f1] px-5 py-5">
              <p
                lang="vi"
                className={`leading-[1.15] ${f.family === "display" ? "text-[clamp(20px,3cqi,30px)] uppercase" : "text-[clamp(20px,2.6cqi,26px)] font-semibold"}`}
                style={{ fontFamily: FACE[f.family] }}
              >
                {f.sample}
              </p>
              <p className="mt-3 text-[14px]" style={{ color: MUTED }}>
                {f.name} · {f.use}
              </p>
            </div>
          ))}
        </div>
        <h4 className="mt-8 text-[17px] font-semibold">Why the Vietnamese cut</h4>
        <div className="mt-3 grid gap-3 @xl:grid-cols-2">
          {[
            { note: v.proof.before, latin: true },
            { note: v.proof.after, latin: false },
          ].map((p) => (
            <div key={p.note} className="rounded-[12px] border border-ink/15 bg-white px-5 py-4">
              <p
                lang="vi"
                className="text-[clamp(20px,2.6cqi,26px)] leading-[1.2]"
                style={{ fontFamily: p.latin ? "'PN Display Latin', Arial" : FACE.display }}
              >
                {p.latin
                  ? /* The Latin cut lacks these letters, so the browser borrows them from the next font. */
                    v.proof.text.split(new RegExp(`(${VI.source})`)).map((part, i) =>
                      i % 2 ? (
                        <span key={i} style={{ fontFamily: "Arial", color: ACCENT }}>
                          {part}
                        </span>
                      ) : (
                        part
                      ),
                    )
                  : v.proof.text}
              </p>
              <p className="mt-2 text-[14px] leading-[1.4]" style={{ color: MUTED }}>
                {p.note}
              </p>
            </div>
          ))}
        </div>
      </>
    ),
    shape: (
      <ul className="grid gap-3 @xl:grid-cols-3">
        {v.shapes.map((s) => (
          <li key={s.shape} className="flex flex-col rounded-[12px] border border-ink/15 bg-[#fbf7f1] p-4">
            <div className="flex h-[92px] items-center">
              {s.shape === "square" ? (
                <span className="flex w-full flex-col gap-0.5 border border-ink bg-white px-3.5 py-3 text-[14px] leading-[1.3]">
                  <b>11:00am Maria Santos</b>
                  <span style={{ color: MUTED }}>Pedicure & Manicure Shellac</span>
                </span>
              ) : s.shape === "pill" ? (
                <span className="inline-flex gap-2">
                  <span className="whitespace-nowrap rounded-full bg-ink px-5 py-3 text-[15px] font-semibold text-[#f4ebdf]">
                    Gọi
                  </span>
                  <span className="whitespace-nowrap rounded-full border border-ink px-5 py-3 text-[15px] font-semibold">
                    +5 phút
                  </span>
                </span>
              ) : (
                <span
                  className="w-full rounded-[12px] border-[1.5px] border-[#8c7b68] bg-white px-3.5 py-3 text-[15px]"
                  style={{ color: MUTED }}
                >
                  Khách walk-in
                </span>
              )}
            </div>
            <p className="mt-3 font-semibold">{s.label}</p>
            <p className="mt-0.5 text-[14px] leading-[1.4]" style={{ color: MUTED }}>
              {s.note}
            </p>
          </li>
        ))}
      </ul>
    ),
    spacing: (
      <div className="rounded-[12px] border border-ink/15 bg-[#fbf7f1] px-5 py-6">
        <SpacingScale on />
      </div>
    ),
  };
  COMPONENTS.forEach((_, i) => (body[`c${i}`] = <ComponentPage i={i} />));

  const navItem = (p: Page) => {
    const on = p.id === current.id;
    return (
      <li key={p.id}>
        <button
          type="button"
          aria-current={on ? "page" : undefined}
          onClick={() => go(p.id)}
          className={`flex min-h-9 w-full items-center rounded-[8px] px-3 text-left text-[15px] transition-colors duration-200 ${
            on ? "bg-[#ebe0d2] font-semibold" : "hover:bg-[#ebe0d2]/60"
          }`}
        >
          {p.title}
        </button>
      </li>
    );
  };
  const prev = pages[at - 1];
  const next = pages[at + 1];

  return (
    <div
      className="@container overflow-hidden rounded-[16px] border border-ink/15 bg-[#f4ebdf] text-[16px] leading-[1.5] text-ink shadow-[0_32px_64px_-32px_rgb(14_14_14/0.35)]"
      style={{ fontFamily: FACE.text }}
    >
      <div className="flex h-12 items-center gap-4 border-b border-ink/15 bg-[#fbf7f1] px-4">
        <span aria-hidden className="flex gap-1.5">
          {[0, 1, 2].map((k) => (
            <span key={k} className="size-3 rounded-full bg-ink/15" />
          ))}
        </span>
        <p className="flex min-w-0 items-baseline gap-2.5 whitespace-nowrap">
          <span className="text-[14px] uppercase" style={{ fontFamily: FACE.display }}>
            Passion Nails
          </span>
          <span className="truncate text-[14px]" style={{ color: MUTED }}>
            Design system
          </span>
        </p>
      </div>

      <div className="grid @3xl:h-[min(720px,82svh)] @3xl:grid-cols-[212px_minmax(0,1fr)]">
        <nav
          aria-label="Design system pages"
          className="hidden overflow-y-auto overscroll-contain border-r border-ink/15 p-3 @3xl:block"
        >
          <label className="relative mb-4 block">
            <span className="sr-only">Search pages</span>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
              fill="none"
              stroke={MUTED}
              strokeWidth="1.6"
            >
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search pages"
              className="h-9 w-full rounded-full border-[1.5px] border-[#8c7b68] bg-[#fbf7f1] pr-3 pl-8 text-[14px] placeholder:text-[#5c5148]"
            />
          </label>
          {groups.map((g) => {
            const list = found.filter((p) => p.group === g);
            return (
              list.length > 0 && (
                <div key={g} className="mb-4 last:mb-0">
                  <p className="px-3 pt-1 pb-1.5 text-[13px]" style={{ color: MUTED }}>
                    {g}
                  </p>
                  <ul>{list.map(navItem)}</ul>
                </div>
              )
            );
          })}
          {found.length === 0 && (
            <p className="px-3 text-[14px]" style={{ color: MUTED }}>
              No page called &ldquo;{q}&rdquo;.
            </p>
          )}
        </nav>

        <div
          ref={main}
          className="min-w-0 px-[clamp(20px,4.5cqi,48px)] pt-6 pb-8 @3xl:overflow-y-auto @3xl:overscroll-contain @3xl:pt-10"
        >
          <label className="mb-6 block @3xl:hidden">
            <span className="sr-only">Page</span>
            <select
              value={current.id}
              onChange={(e) => go(e.target.value)}
              className="h-11 w-full rounded-full border-[1.5px] border-[#8c7b68] bg-[#fbf7f1] px-4 text-[16px]"
            >
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {pages
                    .filter((p) => p.group === g)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>

          {[current].map((p) => (
            <section
              key={p.id}
              aria-label={p.title}
              className="min-w-0 transition-opacity duration-300 ease-[var(--ease-out)] motion-reduce:transition-none starting:opacity-0"
            >
              <p className="flex flex-wrap gap-1.5 text-[13px]">
                <span className="rounded-full bg-[#87133e]/10 px-2.5 py-0.5" style={{ color: ACCENT }}>
                  {p.group}
                </span>
                <span className="rounded-full bg-ink/5 px-2.5 py-0.5" style={{ color: MUTED }}>
                  {p.group === "Components" ? "Staff app" : "Both apps"}
                </span>
              </p>
              <h3
                className="mt-3 text-[clamp(24px,3.4cqi,36px)] leading-[1.15] uppercase"
                style={{ fontFamily: FACE.display }}
              >
                {p.title}
              </h3>
              <p className="mt-2 max-w-[36em] text-[16px]" style={{ color: MUTED }}>
                {p.lede}
              </p>
              <div className="mt-8">{body[p.id]}</div>
            </section>
          ))}
          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-ink/15 pt-5 text-[15px]">
            {[prev, next].map((p, k) =>
              p ? (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(p.id)}
                  className={`group min-h-11 ${k ? "col-start-2 text-right" : "text-left"}`}
                >
                  <span className="block text-[13px]" style={{ color: MUTED }}>
                    {k ? "Next" : "Previous"}
                  </span>
                  <span className="font-semibold group-hover:underline">{p.title}</span>
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
