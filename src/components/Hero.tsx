import { GiantName } from "./GiantName";
import { SoundToggle } from "./SoundToggle";

export function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <section aria-label="Lucas Vu" className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-wall">
      <h1 className="sr-only">Lucas Vu, product designer</h1>
      <GiantName className="absolute inset-x-0 bottom-[0.02em]" />
      <div className="hero-frame absolute inset-0">{children}</div>
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[var(--corner-top)] flex flex-col gap-3 text-[15px] leading-[1.45] sm:flex-row sm:justify-between sm:text-[16px]">
        <p className="pointer-events-auto max-w-[15em]">I like getting things moving.</p>
        <p className="pointer-events-auto text-muted sm:text-right sm:text-ink">
          Product Designer @ Digital Extremes
          <br />
          Systems Design Engineering @ Waterloo
        </p>
      </div>
      <SoundToggle className="absolute bottom-[calc(30.5vw*0.86)] right-[var(--gutter)]" />
    </section>
  );
}
