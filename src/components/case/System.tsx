"use client";

import { type ReactNode, useState } from "react";
import type { Visual } from "@/content/caseStudies/types";
import { Measured, SpacingScale } from "./Specimens";

type Of = Extract<Visual, { kind: "system" }>;

/** Letters only the Vietnamese cut has (Google Fonts' vietnamese subset, as precomposed letters). */
const VI = /[\u0102\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01A0\u01A1\u01AF\u01B0\u1EA0-\u1EF9]/;
const FACE = { display: "'PN Display', Arial, sans-serif", text: "'PN Text', Arial, sans-serif" };

/** One row of the docs: its title and rule on the left, the specimen on the right. */
function Row({ title, rule, children }: { title: string; rule: string; children: ReactNode }) {
  return (
    <div className="grid gap-5 border-t border-ink/15 pt-[clamp(20px,3cqi,32px)] first:border-t-0 first:pt-0 @3xl:grid-cols-[minmax(0,15em)_minmax(0,1fr)] @3xl:gap-10">
      <div>
        <h3 className="text-[20px] leading-[1.2]">{title}</h3>
        <p className="mt-1.5 text-[15px] leading-[1.45] text-muted">{rule}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** The salon's design system on one panel: colour, type and shape, in the salon's own fonts. */
export function System({ v }: { v: Of }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-col gap-[clamp(20px,3cqi,32px)]">
      <Row title="Colour" rule={v.rules.colour}>
        <ul className="grid grid-cols-2 gap-3 @lg:grid-cols-3 @4xl:grid-cols-5">
          {v.colours.map((c) => (
            <li key={c.hex}>
              <span
                aria-hidden
                className="block aspect-[5/3] shadow-[inset_0_0_0_1px_rgb(14_14_14/0.12)]"
                style={{ background: c.hex }}
              />
              <p className="mt-2 text-[16px] leading-[1.25]">{c.name}</p>
              <p className="text-[13px] leading-[1.4] text-muted">
                <span className="uppercase tabular-nums">{c.hex}</span> · {c.role}
              </p>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Type" rule={v.rules.type}>
        <div className="grid gap-6 @xl:grid-cols-2">
          {v.faces.map((f) => (
            <div key={f.name}>
              <p
                lang="vi"
                className={`leading-[1.15] ${f.family === "display" ? "text-[clamp(22px,3.4cqi,34px)] uppercase" : "text-[clamp(20px,2.6cqi,26px)] font-semibold"}`}
                style={{ fontFamily: FACE[f.family] }}
              >
                {f.sample}
              </p>
              <p className="mt-2 text-[15px] text-muted">
                {f.name} · {f.use}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 @xl:grid-cols-2">
          {[
            { note: v.proof.before, latin: true },
            { note: v.proof.after, latin: false },
          ].map((p) => (
            <div key={p.note} className="bg-white px-5 py-4">
              {p.latin ? (
                <p
                  lang="vi"
                  className="text-[clamp(20px,2.6cqi,26px)] leading-[1.2]"
                  style={{ fontFamily: "'PN Display Latin', Arial" }}
                >
                  {/* The Latin cut lacks these letters, so the browser borrows them from the next font. */}
                  {v.proof.text.split(new RegExp(`(${VI.source})`)).map((part, i) =>
                    i % 2 ? (
                      <span key={i} className="text-[var(--accent)]" style={{ fontFamily: "Arial" }}>
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
                </p>
              ) : (
                <p
                  lang="vi"
                  className="text-[clamp(20px,2.6cqi,26px)] leading-[1.2]"
                  style={{ fontFamily: FACE.display }}
                >
                  {v.proof.text}
                </p>
              )}
              <p className="mt-2 text-[14px] leading-[1.4] text-muted">{p.note}</p>
            </div>
          ))}
        </div>
      </Row>

      <Row title="Shape" rule={v.rules.shape}>
        <ul className="grid gap-4 @xl:grid-cols-3">
          {v.shapes.map((s) => (
            <li key={s.shape} className="flex flex-col">
              <div className="flex h-[92px] items-center">
                {s.shape === "square" ? (
                  <span
                    className="flex w-full max-w-[220px] flex-col gap-0.5 border border-ink bg-[#fbf7f1] px-3.5 py-3 text-[14px] leading-[1.3]"
                    style={{ fontFamily: FACE.text }}
                  >
                    <b>11:00am Maria Santos</b>
                    <span className="text-[#5c5148]">Pedicure & Manicure Shellac</span>
                  </span>
                ) : s.shape === "pill" ? (
                  <span className="inline-flex gap-2">
                    <span
                      className="whitespace-nowrap rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-[#f4ebdf]"
                      style={{ fontFamily: FACE.text }}
                    >
                      Gọi
                    </span>
                    <span
                      className="whitespace-nowrap rounded-full border border-ink px-6 py-3 text-[15px] font-semibold"
                      style={{ fontFamily: FACE.text }}
                    >
                      +5 phút
                    </span>
                  </span>
                ) : (
                  <span
                    className="w-full max-w-[220px] rounded-[12px] border-[1.5px] border-[#8c7b68] bg-[#fbf7f1] px-3.5 py-3 text-[15px] text-[#5c5148]"
                    style={{ fontFamily: FACE.text }}
                  >
                    Khách walk-in
                  </span>
                )}
              </div>
              <p className="mt-3 text-[16px] leading-[1.25]">{s.label}</p>
              <p className="mt-0.5 text-[14px] leading-[1.4] text-muted">{s.note}</p>
            </li>
          ))}
        </ul>
      </Row>
      <Row title="Components" rule={v.rules.components}>
        <Measured on={on} />
      </Row>

      <Row title="Spacing" rule={v.rules.spacing}>
        <SpacingScale on={on} />
      </Row>

      <button
        type="button"
        aria-pressed={!on}
        onClick={() => setOn((o) => !o)}
        className="mx-auto flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] text-wall transition-transform duration-200 active:scale-95"
      >
        <span
          aria-hidden
          className="size-2 rounded-full"
          style={{ background: on ? "#f24822" : "#a8a49b" }}
        />
        {on ? "Hide measurements" : "Show measurements"}
      </button>
    </div>
  );
}
