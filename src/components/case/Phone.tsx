import type { ReactNode } from "react";
import type { Media } from "@/content/projects";
import { ExhibitMedia } from "../ExhibitMedia";

/**
 * An iPhone 15 (393 x 852 pt) around a screen shot at 390 x 756: the status bar and the home
 * indicator are drawn here, in the app's own top and bottom colours, so nothing on the screen sits
 * under the Dynamic Island. Proportions are Apple's; it scales with its width (container units).
 */
export function Phone({
  children,
  top = "#ffffff",
  bottom = "#ffffff",
  dark = false,
  className = "",
}: {
  children: ReactNode;
  /** Colours of the app behind the status bar and the home indicator. */
  top?: string;
  bottom?: string;
  /** Light status-bar text, over a dark or dimmed top. */
  dark?: boolean;
  className?: string;
}) {
  const ink = dark ? "#fff" : "#0b0b0c";
  return (
    <div
      className={`phone relative rounded-[15.5%/7.2%] bg-[#0b0b0c] p-[3.4%] shadow-[0_0_0_1.5px_#4a4a4e,0_0_0_3px_#1b1b1d,0_24px_48px_-16px_rgb(0_0_0/0.45)] [container-type:inline-size] ${className}`}
    >
      <div className="flex flex-col">
        <div
          className="relative flex items-center justify-between rounded-t-[13.5cqi] px-[8cqi] pt-[1.6cqi] text-[4.3cqi] font-semibold"
          style={{ background: top, color: ink, aspectRatio: "393 / 54" }}
        >
          <span className="w-[16cqi] text-center tracking-[-0.02em]">9:41</span>
          <span
            aria-hidden
            className="absolute left-1/2 top-[3cqi] h-[9.4cqi] w-[31cqi] -translate-x-1/2 rounded-full bg-black"
          />
          <StatusIcons color={ink} />
        </div>
        {children}
        <div
          className="flex items-end justify-center rounded-b-[13.5cqi] pb-[2.2cqi]"
          style={{ background: bottom, aspectRatio: "393 / 34" }}
        >
          <span
            aria-hidden
            className="h-[1.3cqi] w-[34cqi] rounded-full"
            style={{ background: dark ? "#fff" : "#0b0b0c" }}
          />
        </div>
      </div>
    </div>
  );
}

function StatusIcons({ color }: { color: string }) {
  return (
    <svg aria-hidden viewBox="0 0 68 12" className="w-[17.5cqi]" fill={color}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 4.5} y={9 - i * 2.4} width="3" height={3 + i * 2.4} rx="0.8" />
      ))}
      <path d="M30.5 2.6a9.6 9.6 0 0 1 13 0l-1.3 1.4a7.7 7.7 0 0 0-10.4 0zm2.6 2.8a5.8 5.8 0 0 1 7.8 0l-1.3 1.4a3.9 3.9 0 0 0-5.2 0zM37 8.1l1.9 2-1.9 1.9-1.9-1.9z" />
      <rect x="48" y="1" width="17" height="10" rx="3" fill="none" stroke={color} strokeOpacity="0.45" />
      <rect x="49.8" y="2.8" width="13.4" height="6.4" rx="1.6" />
      <rect x="66" y="4.2" width="1.5" height="3.6" rx="0.7" fillOpacity="0.45" />
    </svg>
  );
}

/** Outer width over height of the framed phone (screen 390 x 844 with its bars, plus the bezel). */
export const PHONE_RATIO = 0.478;

/** Every phone on the page is this wide, unless a row of n or the window's height needs it smaller. */
export const phoneWidth = (n: number, ratio = PHONE_RATIO, gap = "clamp(16px, 4cqi, 56px)") =>
  `min(280px, calc((100cqi - ${n - 1} * ${gap}) / ${n}), calc(max(260px, 100svh - 300px) * ${ratio}))`;

/** One title for a group of screens from the same build; mixed groups title each screen. */
export const groupTitle = (shots: { label?: string }[]) => {
  const labels = new Set(shots.map((s) => s.label));
  return labels.size === 1 ? [...labels][0] : undefined;
};

/** A row of framed phones, sized like every other phone on the page. */
export function PhoneRow({ phones }: { phones: Media[] }) {
  const n = phones.length;
  const gap = "clamp(16px, 4cqi, 56px)";
  const shared = groupTitle(phones);
  return (
    <div className="flex flex-col items-center gap-5">
      {shared && <PhoneTitle label={shared} />}
      <div className="flex items-end justify-center" style={{ gap }}>
        {phones.map((m) => (
          <figure
            key={m.alt}
            className="flex min-w-0 flex-col items-center gap-4"
            style={{ width: phoneWidth(n) }}
          >
            {!shared && m.label && <PhoneTitle label={m.label} />}
            <Phone {...m.frame} className="w-full">
              <ExhibitMedia media={m} sizes="280px" bare />
            </Phone>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Which build a screen is from: a quiet title above it. */
export function PhoneTitle({ label }: { label: string }) {
  return <p className="text-center text-[15px] leading-none text-muted">{label}</p>;
}
