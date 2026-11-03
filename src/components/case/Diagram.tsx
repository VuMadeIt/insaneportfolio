"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { DiagramData } from "@/content/caseStudies/types";
import { useInView } from "./useInView";

const TONES = {
  plain: "rounded-sm bg-wall px-4 py-3",
  white: "rounded-sm bg-white px-4 py-3",
  accent: "rounded-sm bg-[var(--accent)] px-4 py-3 text-white",
  ink: "rounded-sm bg-ink px-4 py-3 text-wall",
  chip: "rounded-full bg-wall px-3.5 py-1.5 text-[15px] whitespace-nowrap",
  ghost: "rounded-sm border border-dashed border-[#bdb9b0] px-4 py-3 text-muted",
} as const;

interface Wire {
  d: string;
  label?: { x: number; y: number; text: string };
  tone: "accent" | "ink" | "muted";
  dashed?: boolean;
  order: number;
}

const R = 10;

/** A rounded elbow from (x1, y1) to (x2, y2): across, down or up at the midpoint, across again. */
function elbow(x1: number, y1: number, x2: number, y2: number, mx = (x1 + x2) / 2): string {
  if (Math.abs(y1 - y2) < 1) return `M${x1},${y1} H${x2}`;
  const r = Math.min(R, Math.abs(y2 - y1) / 2, Math.abs(mx - x1), Math.abs(x2 - mx));
  const s = y2 > y1 ? 1 : -1;
  return `M${x1},${y1} H${mx - r} Q${mx},${y1} ${mx},${y1 + s * r} V${y2 - s * r} Q${mx},${y2} ${mx + r},${y2} H${x2}`;
}

/**
 * A node-and-arrow diagram (PLAN 13.6, Caleb's trees). Nodes sit in a grid; every connector is
 * computed from the rendered boxes, so it always starts on one box and ends on the next, at any
 * width. Left-to-right edges leave the right side and enter the left side; an edge to a node below
 * in the same column runs down between them. Connectors draw in, column by column.
 */
export function Diagram({ data }: { data: DiagramData }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const nodes = useRef(new Map<string, HTMLElement>());
  const [wires, setWires] = useState<Wire[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const root = ref.current!;
    const measure = () => {
      const o = root.getBoundingClientRect();
      const box = (id: string) => {
        const r = nodes.current.get(id)!.getBoundingClientRect();
        return { l: r.left - o.left, r: r.right - o.left, t: r.top - o.top, b: r.bottom - o.top };
      };
      const col = new Map(data.nodes.map((n) => [n.id, n.col]));
      // Where a wire turns: edges into one node turn together just left of it (a fan-in), edges out
      // of one node turn together just right of it (a fan-out), a lone edge turns halfway.
      const into = (id: string) => data.edges.filter((e) => e.to === id && col.get(e.from) !== col.get(id));
      const outOf = (id: string) => data.edges.filter((e) => e.from === id && col.get(e.to) !== col.get(id));
      setSize({ w: o.width, h: o.height });
      setWires(
        data.edges.map((e) => {
          const a = box(e.from);
          const b = box(e.to);
          const tone = e.tone ?? "ink";
          const order = col.get(e.from)!;
          if (col.get(e.from) === col.get(e.to)) {
            const x = (a.l + a.r) / 2;
            const down = b.t > a.b;
            const y1 = down ? a.b : a.t;
            const y2 = down ? b.t - 6 : b.b + 6;
            return {
              d: `M${x},${y1} V${y2}`,
              tone,
              dashed: e.dashed,
              order,
              label: e.label ? { x: x + 10, y: (y1 + y2) / 2, text: e.label } : undefined,
            };
          }
          const y1 = (a.t + a.b) / 2;
          const y2 = (b.t + b.b) / 2;
          const x1 = a.r;
          const x2 = b.l - 6;
          const fanIn = into(e.to).length > 1;
          const fanOut = outOf(e.from).length > 1;
          const mx = fanIn
            ? Math.max(...into(e.to).map((f) => box(f.from).r)) +
              (x2 - Math.max(...into(e.to).map((f) => box(f.from).r))) / 2
            : fanOut
              ? x1 + 24
              : (x1 + x2) / 2;
          return {
            d: elbow(x1, y1, x2, y2, mx),
            tone,
            dashed: e.dashed,
            order,
            // Labels sit above the last straight run, after the turn, where nothing else is drawn.
            label: e.label ? { x: mx + 10, y: y2 - 2, text: e.label } : undefined,
          };
        }),
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    for (const el of nodes.current.values()) ro.observe(el);
    return () => ro.disconnect();
  }, [ref, data]);

  const stroke = { accent: "var(--accent)", ink: "#3a3936", muted: "#a8a49b" };

  return (
    <div className="-mx-2 overflow-x-auto px-2 pb-1">
      <div
        ref={ref}
        data-in={inView}
        className="dg relative grid items-center"
        style={{
          minWidth: data.minWidth ?? 720,
          gridTemplateColumns: data.widths ?? `repeat(${data.cols}, minmax(0, 1fr))`,
          columnGap: data.gap ?? "clamp(56px, 7vw, 112px)",
          rowGap: data.rowGap ?? 14,
        }}
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={size.w}
          height={size.h}
        >
          <defs>
            {(["accent", "ink", "muted"] as const).map((t) => (
              <marker
                key={t}
                id={`dg-arrow-${t}`}
                viewBox="0 0 10 10"
                refX="1"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill={stroke[t]} />
              </marker>
            ))}
          </defs>
          {wires.map((w, i) => (
            <path
              key={i}
              className="dg-wire"
              d={w.d}
              pathLength={1}
              fill="none"
              stroke={stroke[w.tone]}
              strokeWidth={1.6}
              strokeDasharray={w.dashed ? "0.012 0.012" : undefined}
              markerEnd={`url(#dg-arrow-${w.tone})`}
              style={{ "--c": w.order } as React.CSSProperties}
            />
          ))}
        </svg>
        {wires.map(
          (w, i) =>
            w.label && (
              <span
                key={`l${i}`}
                className="dg-node pointer-events-none absolute -translate-y-full whitespace-nowrap pb-1 text-[13px] text-muted"
                style={{ left: w.label.x, top: w.label.y, "--c": w.order + 0.5 } as React.CSSProperties}
              >
                {w.label.text}
              </span>
            ),
        )}
        {data.nodes.map((n) => (
          <div
            key={n.id}
            ref={(el) => {
              if (el) nodes.current.set(n.id, el);
              else nodes.current.delete(n.id);
            }}
            className={`dg-node relative text-[16px] leading-[1.3] ${TONES[n.tone ?? "plain"]} ${n.tone === "chip" ? "justify-self-start" : ""}`}
            style={
              {
                gridColumn: n.col + 1,
                gridRow: n.rowSpan ? `${n.row + 1} / span ${n.rowSpan}` : n.row + 1,
                "--c": n.col,
              } as React.CSSProperties
            }
          >
            {n.text}
            {n.sub && <span className="mt-1 block text-[13px] leading-[1.35] opacity-70">{n.sub}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
