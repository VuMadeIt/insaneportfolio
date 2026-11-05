"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { DiagramData, DiagramNode } from "@/content/caseStudies/types";
import { useInView } from "./useInView";

const TONES = {
  plain: "rounded-sm bg-wall px-4 py-3",
  white: "rounded-sm bg-white px-4 py-3",
  accent: "rounded-sm bg-[var(--accent)] px-4 py-3 text-white",
  ink: "rounded-sm bg-ink px-4 py-3 text-wall",
  chip: "rounded-full bg-wall px-3.5 py-1.5 text-[15px] whitespace-nowrap",
  ghost: "rounded-sm bg-rule px-4 py-3 text-muted",
} as const;

interface Wire {
  d: string;
  label?: { x: number; y: number; text: string };
  tone: "accent" | "ink" | "muted";
  dashed?: boolean;
  order: number;
}

interface Box {
  l: number;
  r: number;
  t: number;
  b: number;
}

const R = 10;
/** Gap left before an arrowhead. */
const HEAD = 6;
/** Two boxes facing each other over at least this much share a straight wire. */
const SHARED = 14;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** A rounded elbow from (x1, y1) to (x2, y2): across, down or up at `mx`, across again. */
function elbowH(x1: number, y1: number, x2: number, y2: number, mx = (x1 + x2) / 2): string {
  if (Math.abs(y1 - y2) < 1) return `M${x1},${y1} H${x2}`;
  const r = Math.min(R, Math.abs(y2 - y1) / 2, Math.abs(mx - x1), Math.abs(x2 - mx));
  const s = y2 > y1 ? 1 : -1;
  return `M${x1},${y1} H${mx - r} Q${mx},${y1} ${mx},${y1 + s * r} V${y2 - s * r} Q${mx},${y2} ${mx + r},${y2} H${x2}`;
}

/** Indent per level when a diagram is stacked as a tree; its wires run down at half of it. */
const INDENT = 24;

/**
 * The diagram as a tree, for stacking on narrow screens. Every diagram here branches one way:
 * forward (each box has at most one way in: a root fans out, listed parent first) or backward (each
 * box has at most one way out: sources fan in, listed children first, flowing down into their
 * parent). Depth sets the indent.
 */
function treeOf(data: DiagramData) {
  const ins = new Map<string, number>();
  const outs = new Map<string, number>();
  for (const e of data.edges) {
    ins.set(e.to, (ins.get(e.to) ?? 0) + 1);
    outs.set(e.from, (outs.get(e.from) ?? 0) + 1);
  }
  const forward = [...ins.values()].every((n) => n <= 1) || ![...outs.values()].every((n) => n <= 1);
  const ordered = [...data.nodes].sort((a, b) => a.col - b.col || a.row - b.row).map((n) => n.id);
  const kids = new Map<string, string[]>(ordered.map((id) => [id, []]));
  const hasParent = new Set<string>();
  for (const e of data.edges) {
    const [parent, child] = forward ? [e.from, e.to] : [e.to, e.from];
    if (hasParent.has(child)) continue;
    hasParent.add(child);
    kids.get(parent)!.push(child);
  }
  for (const list of kids.values()) list.sort((a, b) => ordered.indexOf(a) - ordered.indexOf(b));
  const order: { id: string; depth: number }[] = [];
  const visit = (id: string, depth: number) => {
    if (forward) order.push({ id, depth });
    for (const k of kids.get(id)!) visit(k, depth + 1);
    if (!forward) order.push({ id, depth });
  };
  for (const id of ordered) if (!hasParent.has(id)) visit(id, 0);
  return { forward, order };
}

/** Where a straight wire can run between two facing spans, if they overlap enough. */
function shared(a0: number, a1: number, b0: number, b1: number): number | null {
  const lo = Math.max(a0, b0);
  const hi = Math.min(a1, b1);
  return hi - lo >= SHARED ? clamp((a0 + a1) / 2, lo + SHARED / 2, hi - SHARED / 2) : null;
}

/**
 * A node-and-arrow diagram (PLAN 13.6, 15.16, Caleb's trees). Every connector is computed from the
 * rendered boxes, so it always starts on one box and ends on the next, at any width; and whenever
 * two boxes face each other, the wire between them is straight: it only bends when it has to.
 * Wide screens lay the columns out left to right. Where they would not fit, the same diagram
 * stacks as an indented tree, top to bottom, with tree lines between parent and children. It never
 * needs scrolling inside itself. Connectors draw in, column by column.
 */
export function Diagram({ data }: { data: DiagramData }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const outer = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());
  const [wires, setWires] = useState<Wire[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [stacked, setStacked] = useState(false);
  // Below this the columns do not fit; diagrams sized by their content still stack on phones.
  const minWidth = data.minWidth || 600;
  const tree = useMemo(() => treeOf(data), [data]);

  // Stack when the column layout would not fit the space it has.
  useLayoutEffect(() => {
    const el = outer.current!;
    const fit = () => setStacked(el.clientWidth < minWidth);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [minWidth]);

  useLayoutEffect(() => {
    const root = ref.current!;
    const measure = () => {
      const o = root.getBoundingClientRect();
      const box = (id: string): Box => {
        const r = nodes.current.get(id)!.getBoundingClientRect();
        return { l: r.left - o.left, r: r.right - o.left, t: r.top - o.top, b: r.bottom - o.top };
      };
      const col = new Map(data.nodes.map((n) => [n.id, n.col]));
      const across = (id: string, dir: "in" | "out") =>
        data.edges.filter((e) => (dir === "in" ? e.to : e.from) === id && col.get(e.from) !== col.get(e.to));
      setSize({ w: o.width, h: o.height });
      setWires(
        data.edges.map((e) => {
          const a = box(e.from);
          const b = box(e.to);
          const tone = e.tone ?? "ink";
          const order = col.get(e.from)!;
          const wire = (d: string, label?: { x: number; y: number }) => ({
            d,
            tone,
            dashed: e.dashed,
            order,
            label: e.label && label ? { ...label, text: e.label } : undefined,
          });
          if (stacked) {
            // Tree lines: the parent's line runs down just inside its left edge, and each child
            // joins it from the right. Forward, out of the parent into the child; backward, out of
            // the child into the parent below.
            const [p, c] = tree.forward ? [a, b] : [b, a];
            const x = p.l + INDENT / 2;
            const cy = (c.t + c.b) / 2;
            const r = Math.min(R, Math.abs(cy - (tree.forward ? p.b : p.t)) / 2);
            return tree.forward
              ? wire(`M${x},${p.b} V${cy - r} Q${x},${cy} ${x + r},${cy} H${c.l - HEAD}`, {
                  x: c.l,
                  y: c.t - 2,
                })
              : wire(`M${c.l},${cy} H${x + r} Q${x},${cy} ${x},${cy + r} V${p.t - HEAD}`, {
                  x: c.l,
                  y: c.t - 2,
                });
          }
          // Within one column: a straight run between them.
          if (col.get(e.from) === col.get(e.to)) {
            const x = shared(a.l, a.r, b.l, b.r) ?? (a.l + a.r) / 2;
            const down = b.t > a.b;
            const y1 = down ? a.b : a.t;
            const y2 = down ? b.t - HEAD : b.b + HEAD;
            return wire(`M${x},${y1} V${y2}`, { x: x + 10, y: (y1 + y2) / 2 });
          }
          // Columns left to right: leave the right side, enter the left.
          const x1 = a.r;
          const x2 = b.l - HEAD;
          const y = shared(a.t, a.b, b.t, b.b);
          if (y !== null) return wire(`M${x1},${y} H${x2}`, { x: x1 + (x2 - x1) / 2 - 10, y });
          const into = across(e.to, "in");
          const fanIn = into.length > 1;
          const fanOut = across(e.from, "out").length > 1;
          const reach = fanIn ? Math.max(...into.map((f) => box(f.from).r)) : x1;
          const mx = fanIn ? reach + (x2 - reach) / 2 : fanOut ? x1 + 24 : (x1 + x2) / 2;
          const y2 = (b.t + b.b) / 2;
          return wire(elbowH(x1, (a.t + a.b) / 2, x2, y2, mx), { x: mx + 10, y: y2 - 2 });
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    for (const el of nodes.current.values()) ro.observe(el);
    return () => ro.disconnect();
  }, [ref, data, stacked, tree]);

  const stroke = { accent: "var(--accent)", ink: "#3a3936", muted: "#a8a49b" };
  const node = (n: DiagramNode, style?: React.CSSProperties) => (
    <div
      key={n.id}
      ref={(el) => {
        if (el) nodes.current.set(n.id, el);
        else nodes.current.delete(n.id);
      }}
      className={`dg-node relative text-[16px] leading-[1.3] ${TONES[n.tone ?? "plain"]} ${n.tone === "chip" ? "justify-self-start" : ""}`}
      style={{ "--c": n.col, ...style } as React.CSSProperties}
    >
      {n.text}
      {n.sub && <span className="mt-1 block text-[13px] leading-[1.35] opacity-70">{n.sub}</span>}
    </div>
  );

  return (
    <div ref={outer}>
      <div
        ref={ref}
        data-in={inView}
        className={stacked ? "dg relative flex flex-col gap-2.5" : "dg relative grid items-center"}
        style={
          stacked
            ? undefined
            : {
                gridTemplateColumns: data.widths ?? `repeat(${data.cols}, minmax(0, 1fr))`,
                columnGap: data.gap ?? "clamp(56px, 7vw, 112px)",
                rowGap: data.rowGap ?? 14,
              }
        }
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
        {stacked
          ? tree.order.map(({ id, depth }) =>
              node(
                data.nodes.find((n) => n.id === id)!,
                {
                  marginLeft: depth * INDENT,
                  whiteSpace: "normal",
                  alignSelf: "stretch",
                },
              ),
            )
          : data.nodes.map((n) =>
              node(n, {
                gridColumn: n.col + 1,
                gridRow: n.rowSpan ? `${n.row + 1} / span ${n.rowSpan}` : n.row + 1,
              }),
            )}
      </div>
    </div>
  );
}
