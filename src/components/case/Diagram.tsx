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

/** A group of boxes that belong together when stacked: one path, or the sources of one merge. */
const GROUP = "dg-node flex rounded-md bg-ink/[0.045] p-3";

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
/** Stacked: how far a fan's branches are indented; the trunk runs down the middle of it. */
const INDENT = 44;
/** Stacked: the space between boxes that follow each other, room for a straight arrow. */
const CHAIN = 32;
/** Stacked: up to three branches sit side by side when each gets at least this much width. */
const COLUMN = 240;
const GAP = 16;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const mid = (a: number, b: number) => (a + b) / 2;

/** A rounded elbow from (x1, y1) to (x2, y2): across, down or up at `mx`, across again. */
function elbowH(x1: number, y1: number, x2: number, y2: number, mx = mid(x1, x2)): string {
  if (Math.abs(y1 - y2) < 1) return `M${x1},${y1} H${x2}`;
  const r = Math.min(R, Math.abs(y2 - y1) / 2, Math.abs(mx - x1), Math.abs(x2 - mx));
  const s = y2 > y1 ? 1 : -1;
  return `M${x1},${y1} H${mx - r} Q${mx},${y1} ${mx},${y1 + s * r} V${y2 - s * r} Q${mx},${y2} ${mx + r},${y2} H${x2}`;
}

/** The same turned on its side: down, across at `my`, down again. */
function elbowV(x1: number, y1: number, x2: number, y2: number, my = mid(y1, y2)): string {
  if (Math.abs(x1 - x2) < 1) return `M${x1},${y1} V${y2}`;
  const r = Math.min(R, Math.abs(x2 - x1) / 2, Math.abs(my - y1), Math.abs(y2 - my));
  const s = x2 > x1 ? 1 : -1;
  return `M${x1},${y1} V${my - r} Q${x1},${my} ${x1 + s * r},${my} H${x2 - s * r} Q${x2},${my} ${x2},${my + r} V${y2}`;
}

/**
 * The diagram as a tree, for stacking on narrow screens. Every diagram here branches one way:
 * forward (each box has at most one way in: a root fans out, listed parent first) or backward (each
 * box has at most one way out: sources fan in, listed children first, flowing down into their
 * parent).
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
  const of = (id: string) => kids.get(id)!;
  const leaf = (id: string) => of(id).length === 0;
  return {
    forward,
    of,
    leaf,
    /** A split into paths of their own, not just a list of sources or results. */
    fan: (id: string) => of(id).length > 1 && !of(id).every(leaf),
    roots: ordered.filter((id) => !hasParent.has(id)),
  };
}

/** Where a straight wire can run between two facing spans, if they overlap enough. */
function shared(a0: number, a1: number, b0: number, b1: number): number | null {
  const lo = Math.max(a0, b0);
  const hi = Math.min(a1, b1);
  return hi - lo >= SHARED ? clamp(mid(a0, a1), lo + SHARED / 2, hi - SHARED / 2) : null;
}

/**
 * A node-and-arrow diagram (PLAN 13.6, 15.16, Caleb's trees). Every connector is computed from the
 * rendered boxes, so it always starts on one box and ends on the next, at any width. Wires bend
 * only where a path splits or merges; between two boxes that face each other they run straight.
 * Wide screens lay the columns out left to right. Where they would not fit, the same diagram
 * stacks top to bottom: boxes that follow each other get a straight arrow down, the sources of one
 * merge sit in one group with one arrow out, and when a box splits into paths of their own each
 * path is its own group (headed by its label), side by side if there is room, else stacked under a
 * trunk. It never needs scrolling inside itself. Connectors draw in, column by column.
 */
export function Diagram({ data }: { data: DiagramData }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const outer = useRef<HTMLDivElement>(null);
  // Boxes by node id; stacked groups as `g:<parent>` (a merge's sources) and `s:<id>` (a path).
  const els = useRef(new Map<string, HTMLElement>());
  const [wires, setWires] = useState<Wire[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(Infinity);
  // Below this the columns do not fit; diagrams sized by their content still stack on phones.
  const stacked = width < (data.minWidth || 600);
  const tree = useMemo(() => treeOf(data), [data]);
  const byId = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data]);

  const edgeTo = (parent: string, child: string) =>
    data.edges.find((e) => (tree.forward ? [e.from, e.to] : [e.to, e.from]).join() === `${parent},${child}`);

  useLayoutEffect(() => {
    const el = outer.current!;
    const fit = () => setWidth(el.clientWidth);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = ref.current!;
    const measure = () => {
      // Layout offsets, not client rects: boxes are mid-transform while they rise in.
      const box = (key: string): Box => {
        const el = els.current.get(key)!;
        let l = 0;
        let t = 0;
        for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) {
          l += e.offsetLeft;
          t += e.offsetTop;
        }
        return { l, t, r: l + el.offsetWidth, b: t + el.offsetHeight };
      };
      const col = (id: string) => byId.get(id)!.col;
      const across1 = (id: string, dir: "in" | "out") =>
        data.edges.filter((e) => (dir === "in" ? e.to : e.from) === id && col(e.from) !== col(e.to));
      setSize({ w: root.offsetWidth, h: root.offsetHeight });
      const all = data.edges.map((e): Wire | null => {
        const tone = e.tone ?? "ink";
        const wire = (d: string, label?: { x: number; y: number }): Wire => ({
          d,
          tone,
          dashed: e.dashed,
          order: col(e.from),
          label: e.label && label ? { ...label, text: e.label } : undefined,
        });
        // One box above another: a straight arrow down where they overlap.
        const down = (a: Box, b: Box) => {
          const x = shared(a.l, a.r, b.l, b.r) ?? mid(a.l, a.r);
          return wire(`M${x},${a.b} V${b.t - HEAD}`);
        };
        if (stacked) {
          const [p, c] = tree.forward ? [e.from, e.to] : [e.to, e.from];
          const ks = tree.of(p);
          if (!ks.includes(c)) return null;
          const P = box(p);
          if (ks.length === 1) {
            const C = box(c);
            const [a, b] = tree.forward ? [P, C] : [C, P];
            // A short path laid out in a row: straight across.
            if (b.l >= a.r) return wire(`M${a.r},${mid(b.t, b.b)} H${b.l - HEAD}`);
            return down(a, b);
          }
          if (!tree.fan(p)) return tree.forward ? down(P, box(`g:${p}`)) : down(box(`g:${p}`), P);
          const anchor = (k: string) => box(els.current.has(`s:${k}`) ? `s:${k}` : k);
          const K = anchor(c);
          // Side by side unless the paths are indented under a trunk.
          if (anchor(ks[0]!).l < P.l + INDENT / 2) {
            const [px, kx] = [mid(P.l, P.r), mid(K.l, K.r)];
            return tree.forward
              ? wire(elbowV(px, P.b, kx, K.t - HEAD))
              : wire(elbowV(kx, K.b, px, P.t - HEAD));
          }
          // The trunk runs down the indent; each path joins it at its first box's middle.
          const C = box(c);
          const x = P.l + INDENT / 2;
          const y = mid(C.t, C.b);
          const r = 6;
          return tree.forward
            ? wire(`M${x},${P.b} V${y - r} Q${x},${y} ${x + r},${y} H${K.l - HEAD}`)
            : wire(`M${K.l},${y} H${x + r} Q${x},${y} ${x},${y + r} V${P.t - HEAD}`);
        }
        const a = box(e.from);
        const b = box(e.to);
        // Within one column: a straight run between them.
        if (col(e.from) === col(e.to)) return b.t > a.b ? down(a, b) : down(b, a);
        // Columns left to right: leave the right side, enter the left. A split or a merge meets
        // the boxes' middles; one box to one box runs straight wherever they face each other.
        const x1 = a.r;
        const x2 = b.l - HEAD;
        const [ya, yb] = [mid(a.t, a.b), mid(b.t, b.b)];
        const into = across1(e.to, "in");
        const fanIn = into.length > 1;
        const fanOut = across1(e.from, "out").length > 1;
        const y = fanIn || fanOut ? (Math.abs(ya - yb) < 2 ? ya : null) : shared(a.t, a.b, b.t, b.b);
        if (y !== null) return wire(`M${x1},${y} H${x2}`, { x: mid(x1, x2), y });
        const reach = fanIn ? Math.max(...into.map((f) => box(f.from).r)) : x1;
        const mx = fanIn ? mid(reach, x2) : fanOut ? x1 + 24 : mid(x1, x2);
        return wire(elbowH(x1, ya, x2, yb, mx), { x: mid(mx, x2), y: yb });
      });
      // A merge's sources share one arrow: draw it once.
      setWires(all.filter((w, i): w is Wire => !!w && all.findIndex((o) => o?.d === w.d) === i));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    for (const el of els.current.values()) ro.observe(el);
    return () => ro.disconnect();
    // `width` re-lays the stacked tree (rows, side by side): observe the new boxes.
  }, [ref, data, byId, stacked, tree, width]);

  const reg = (key: string) => (el: HTMLElement | null) => {
    if (el) els.current.set(key, el);
    else els.current.delete(key);
  };
  const stroke = { accent: "var(--accent)", ink: "#3a3936", muted: "#a8a49b" };
  const node = (n: DiagramNode, style?: React.CSSProperties) => (
    <div
      key={n.id}
      ref={reg(n.id)}
      className={`dg-node relative text-[16px] leading-[1.3] ${TONES[n.tone ?? "plain"]} ${n.tone === "chip" ? "justify-self-start" : ""}`}
      style={{ "--c": n.col, ...style } as React.CSSProperties}
    >
      {n.text}
      {n.sub && <span className="mt-1 block text-[13px] leading-[1.35] opacity-70">{n.sub}</span>}
    </div>
  );
  const stackedNode = (id: string) => {
    const n = byId.get(id)!;
    return node(n, n.tone === "chip" ? { whiteSpace: "normal", alignSelf: "flex-start" } : undefined);
  };
  /** Sources or results of one box flow like words: chips as they are, boxes 150 px and up. */
  const groupedNode = (id: string) => {
    const n = byId.get(id)!;
    return node(n, n.tone === "chip" ? { whiteSpace: "normal", flex: "0 1 auto" } : { flex: "1 1 150px" });
  };

  /**
   * A box with everything that flows out of it (forward) or into it (backward), top to bottom,
   * in `room` pixels of width. A box followed by one last box sits in a row when both fit.
   */
  const branch = (id: string, room: number): React.ReactNode => {
    const ks = tree.of(id);
    const across = ks.length <= 3 && (room - GAP * (ks.length - 1)) / ks.length >= COLUMN;
    if (ks.length === 1 && tree.leaf(ks[0]!) && room >= 2 * COLUMN) {
      const pair = tree.forward ? [id, ks[0]!] : [ks[0]!, id];
      return (
        <div
          key={id}
          className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center"
          style={{ columnGap: INDENT + 12 }}
        >
          {pair.map(stackedNode)}
        </div>
      );
    }
    let rest: React.ReactNode = null;
    if (ks.length === 1) rest = branch(ks[0]!, room);
    else if (ks.length > 1 && !tree.fan(id))
      rest = (
        <div
          ref={reg(`g:${id}`)}
          className={`${GROUP} flex-wrap gap-2`}
          style={{ "--c": byId.get(ks[0]!)!.col } as React.CSSProperties}
        >
          {ks.map(groupedNode)}
        </div>
      );
    else if (ks.length > 1)
      rest = (
        <div
          className={across ? "grid auto-cols-fr grid-flow-col" : "flex flex-col"}
          style={{ gap: GAP, paddingLeft: across ? 0 : INDENT }}
        >
          {ks.map((k) => {
            const label = edgeTo(id, k)?.label;
            const tone = edgeTo(id, k)?.tone;
            if (tree.leaf(k) && !label) return stackedNode(k);
            return (
              <div
                key={k}
                ref={reg(`s:${k}`)}
                className={`${GROUP} flex-col`}
                style={{ "--c": byId.get(k)!.col - 0.5 } as React.CSSProperties}
              >
                {label && (
                  <p
                    className={`-mt-0.5 mb-2.5 text-[13px] leading-[1.3] ${tone === "accent" ? "text-[var(--accent)]" : "text-muted"}`}
                  >
                    {label}
                  </p>
                )}
                {branch(k, (across ? (room - GAP * (ks.length - 1)) / ks.length : room - INDENT) - 24)}
              </div>
            );
          })}
        </div>
      );
    return (
      <div key={id} className="flex flex-col" style={{ gap: CHAIN }}>
        {tree.forward ? stackedNode(id) : rest}
        {tree.forward ? rest : stackedNode(id)}
      </div>
    );
  };

  return (
    <div ref={outer}>
      <div
        ref={ref}
        data-in={inView}
        className={stacked ? "dg relative flex flex-col" : "dg relative grid items-center"}
        style={
          stacked
            ? { gap: CHAIN }
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
                className="dg-node pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap pb-1 text-[13px] text-muted"
                style={{ left: w.label.x, top: w.label.y, "--c": w.order + 0.5 } as React.CSSProperties}
              >
                {w.label.text}
              </span>
            ),
        )}
        {stacked
          ? tree.roots.map((id) => branch(id, width))
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
