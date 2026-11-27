import type { ReactNode } from "react";
import { HLine, Pad, Tag, VLine } from "./Redlines";

/**
 * The staff app's components at true size (its 17 px root), each drawn plain or measured. Values
 * are the salon's tokens as measured on its /design page: buttons 54 high with 1.6em sides, chips
 * and fields 50, cards 12 inside on an ink hairline, the 4 px spacing step.
 */
const TEXT = "'PN Text', Arial, sans-serif";
const C = {
  cream: "#f4ebdf",
  card: "#fbf7f1",
  ink: "#0e0e0e",
  line: "#8c7b68",
  muted: "#5c5148",
  june: "#e8456b",
};
const below = (px = 10) => `calc(100% + ${px}px)`;

export function ButtonSpec({ on }: { on: boolean }) {
  return (
    <span className="relative inline-flex">
      <span
        className="inline-flex items-center whitespace-nowrap rounded-full"
        style={{
          height: 54,
          padding: "0 27.2px",
          background: C.ink,
          color: C.cream,
          font: `600 17px/1.15 ${TEXT}`,
        }}
      >
        Lưu lịch hẹn
      </span>
      {on && (
        <>
          <Pad style={{ left: 0, top: 0, bottom: 0, width: 27.2, borderRadius: "999px 0 0 999px" }} />
          <Pad style={{ right: 0, top: 0, bottom: 0, width: 27.2, borderRadius: "0 999px 999px 0" }} />
          <HLine style={{ left: 0, width: 27.2, top: below() }} label="27" below />
          <HLine style={{ right: 0, width: 27.2, top: below() }} label="27" below />
          <VLine style={{ left: below(), top: 0, height: "100%" }} label="54" />
          <Tag style={{ left: 0, bottom: below(6) }} label="Radius 999" />
          <Tag
            style={{ left: "50%", top: below(40), transform: "translateX(-50%)" }}
            label="Hanken 17 · 600"
          />
        </>
      )}
    </span>
  );
}

export function ChipSpec({ on }: { on: boolean }) {
  return (
    <span className="relative inline-flex">
      <span
        className="inline-flex items-center whitespace-nowrap rounded-full"
        style={{
          height: 50,
          padding: "0 18px",
          gap: 8,
          border: `1.5px solid ${C.line}`,
          background: C.card,
          color: C.ink,
          font: `600 17px/1 ${TEXT}`,
        }}
      >
        <span className="size-2.5 rounded-full" style={{ background: C.june }} />
        June
      </span>
      {on && (
        <>
          <Pad style={{ left: 0, top: 0, bottom: 0, width: 18, borderRadius: "999px 0 0 999px" }} />
          <Pad style={{ right: 0, top: 0, bottom: 0, width: 18, borderRadius: "0 999px 999px 0" }} />
          <HLine style={{ left: 0, width: 18, top: below() }} label="18" below />
          <HLine style={{ left: 28, width: 8, top: -10 }} label="8" />
          <HLine style={{ right: 0, width: 18, top: below() }} label="18" below />
          <VLine style={{ left: below(), top: 0, height: "100%" }} label="50" />
          <Tag
            style={{ left: below(40), top: "50%", transform: "translateY(-50%)" }}
            label="Stroke 1.5 · Line"
          />
        </>
      )}
    </span>
  );
}

export function FieldSpec({ on }: { on: boolean }) {
  return (
    <span className="relative inline-flex">
      <span
        className="inline-flex items-center whitespace-nowrap"
        style={{
          width: 220,
          height: 50,
          padding: "0 14px",
          borderRadius: 12,
          border: `1.5px solid ${C.line}`,
          background: C.card,
          color: C.muted,
          font: `400 17px/1.3 ${TEXT}`,
        }}
      >
        Khách walk-in
      </span>
      {on && (
        <>
          <Pad style={{ left: 0, top: 0, bottom: 0, width: 14, borderRadius: "12px 0 0 12px" }} />
          <HLine style={{ left: 0, width: 14, top: below() }} label="14" below />
          <VLine style={{ left: below(), top: 0, height: "100%" }} label="50" />
          <Tag style={{ left: 0, bottom: below(6) }} label="Radius 12" />
          <Tag style={{ right: 0, top: below(10) }} label="Stroke 1.5 · Line" />
        </>
      )}
    </span>
  );
}

export function CardSpec({ on }: { on: boolean }) {
  return (
    <span className="relative inline-block">
      <span
        className="grid"
        style={{
          width: 264,
          gridTemplateColumns: "64px 6px 1fr",
          gap: 12,
          padding: 12,
          border: `1px solid ${C.ink}`,
          background: C.card,
          color: C.ink,
          font: `400 17px/1.3 ${TEXT}`,
        }}
      >
        <span className="grid content-start text-[15px] tabular-nums">
          <b className="font-semibold">10:00am</b>
          <span style={{ color: C.muted }}>10:35am</span>
        </span>
        <span className="rounded-full" style={{ background: C.june }} />
        <span className="grid content-start gap-0.5">
          <b className="font-semibold">Linh Tran</b>
          <span className="text-[15px]" style={{ color: C.muted }}>
            Pedicure
          </span>
          <span className="text-[15px] font-semibold">June</span>
        </span>
      </span>
      {on && (
        <>
          <Pad style={{ left: 0, top: 0, right: 0, height: 12 }} />
          <Pad style={{ left: 0, top: 12, bottom: 12, width: 12 }} />
          <HLine style={{ left: 0, width: 12, top: below() }} label="12" below />
          <HLine style={{ left: 13, width: 64, top: -10 }} label="64" />
          <HLine style={{ left: 77, width: 12, top: below() }} label="12" below />
          <HLine style={{ left: 89, width: 6, top: -10 }} label="6" />
          <VLine style={{ left: below(), top: 0, height: 12 }} label="12" />
          <Tag style={{ right: 0, top: below(10) }} label="Stroke 1 · Ink" />
          <Tag style={{ right: 0, top: below(30) }} label="Radius 0" />
        </>
      )}
    </span>
  );
}

export type Spec = {
  name: string;
  lede: string;
  Spec: (p: { on: boolean }) => ReactNode;
  rows: [string, string][];
  /** The specimen's values written out as CSS. */
  code: string;
  /** Who can't use it if it's wrong, and what the size or line does about it. */
  a11y: string;
};

/** Each staff-app component with its measured values, one docs page each. */
export const COMPONENTS: Spec[] = [
  {
    name: "Button",
    lede: "Fully round, and 54 px tall in the staff app, so nothing you tap is under 48.",
    Spec: ButtonSpec,
    rows: [
      ["Height", "54"],
      ["Sides", "27 (1.6em)"],
      ["Radius", "999"],
      ["Type", "Hanken Grotesk 17 · 600"],
      ["Colour", "Ink fill, Cream text"],
    ],
    code: `height: 54px;\npadding: 0 1.6em;\nborder-radius: 999px;\nbackground: #0e0e0e;\ncolor: #f4ebdf;\nfont: 600 17px "Hanken Grotesk";`,
    a11y: "54 px tall, over the 48 px minimum for anything you tap.",
  },
  {
    name: "Chip",
    lede: "A staff member with her colour dot, round because you tap it.",
    Spec: ChipSpec,
    rows: [
      ["Height", "50"],
      ["Sides", "18"],
      ["Dot to name", "8"],
      ["Stroke", "1.5 · Line"],
      ["Type", "Hanken Grotesk 17 · 600"],
    ],
    code: `height: 50px;\npadding: 0 18px;\ngap: 8px;\nborder: 1.5px solid #8c7b68;\nborder-radius: 999px;\nfont: 600 17px "Hanken Grotesk";`,
    a11y: "The name sits beside the colour dot, so no one is told apart by colour alone.",
  },
  {
    name: "Field",
    lede: "12 px corners, for controls too tall to be pills.",
    Spec: FieldSpec,
    rows: [
      ["Height", "50"],
      ["Sides", "14"],
      ["Radius", "12"],
      ["Stroke", "1.5 · Line"],
      ["Type", "Hanken Grotesk 17 · 400"],
    ],
    code: `height: 50px;\npadding: 0 14px;\nborder: 1.5px solid #8c7b68;\nborder-radius: 12px;\nfont: 400 17px "Hanken Grotesk";`,
    a11y: "50 px tall, and its Line edge is checked against Card.",
  },
  {
    name: "Appointment card",
    lede: "Square with an ink hairline, like the site's reviews, because you read it.",
    Spec: CardSpec,
    rows: [
      ["Padding", "12"],
      ["Columns", "64 time · 6 staff colour"],
      ["Gap", "12"],
      ["Stroke", "1 · Ink"],
      ["Radius", "0"],
    ],
    code: `display: grid;\ngrid-template-columns: 64px 6px 1fr;\ngap: 12px;\npadding: 12px;\nborder: 1px solid #0e0e0e;\nborder-radius: 0;`,
    a11y: "Read, not tapped, so it can stay square. Time comes first for a glance.",
  },
];

/** The 4 px spacing step, each token drawn to size. */
export function SpacingScale({ on }: { on: boolean }) {
  const steps = [4, 8, 12, 16, 20, 24, 32];
  return (
    <ul className="flex flex-wrap items-end gap-x-6 gap-y-5">
      {steps.map((px, i) => (
        <li key={px} className="flex flex-col items-start gap-2">
          <span className="block" style={{ width: px, height: px, background: "rgb(242 72 34 / 0.85)" }} />
          <span className="text-[13px] leading-[1.3]">
            <span className="tabular-nums">{px}</span>
            {on && <span className="block text-muted">spacing-{i + 1 > 6 ? 8 : i + 1}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
