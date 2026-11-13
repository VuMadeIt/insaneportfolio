import type { CSSProperties, ReactNode } from "react";

/**
 * Figma's measurement look, drawn in CSS around a specimen: a 1 px red line with end ticks, its
 * value in a red pill, and padding tinted red. Every value is the salon's real one at the staff
 * app's 17 px root (measured on its /design page), placed with CSS so it can't drift from the box.
 */
const RED = "#f24822";

function Pill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      className="absolute z-10 whitespace-nowrap rounded-[3px] px-1 py-px font-sans text-[11px] font-medium leading-[14px] text-white tabular-nums"
      style={{ background: RED, ...style }}
    >
      {children}
    </span>
  );
}

/** A horizontal measurement over `style`'s box (give left/right/width and top). */
export function HLine({
  style,
  label,
  below = false,
}: {
  style: CSSProperties;
  label: string;
  below?: boolean;
}) {
  return (
    <span aria-hidden className="pointer-events-none absolute h-0" style={style}>
      <span className="absolute inset-x-0 top-0 h-px" style={{ background: RED }} />
      <span className="absolute left-0 top-[-3px] h-[7px] w-px" style={{ background: RED }} />
      <span className="absolute right-0 top-[-3px] h-[7px] w-px" style={{ background: RED }} />
      <Pill style={{ left: "50%", transform: "translateX(-50%)", [below ? "top" : "bottom"]: 5 }}>
        {label}
      </Pill>
    </span>
  );
}

/** A vertical measurement over `style`'s box (give top/bottom/height and left). */
export function VLine({
  style,
  label,
  left = false,
}: {
  style: CSSProperties;
  label: string;
  left?: boolean;
}) {
  return (
    <span aria-hidden className="pointer-events-none absolute w-0" style={style}>
      <span className="absolute inset-y-0 left-0 w-px" style={{ background: RED }} />
      <span className="absolute left-[-3px] top-0 h-px w-[7px]" style={{ background: RED }} />
      <span className="absolute bottom-0 left-[-3px] h-px w-[7px]" style={{ background: RED }} />
      <Pill style={{ top: "50%", transform: "translateY(-50%)", [left ? "right" : "left"]: 5 }}>{label}</Pill>
    </span>
  );
}

/** Padding, tinted the way Figma's Dev Mode shows it. */
export function Pad({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute"
      style={{ background: "rgb(242 72 34 / 0.16)", ...style }}
    />
  );
}

/** A property that isn't a distance (a radius, a stroke, a font), in a pill at `style`. */
export function Tag({ style, label }: { style: CSSProperties; label: string }) {
  return (
    <span aria-hidden className="pointer-events-none">
      <Pill style={style}>{label}</Pill>
    </span>
  );
}
