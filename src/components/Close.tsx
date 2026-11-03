import { GiantName } from "./GiantName";

export const CONTACT = {
  email: "lucasvu.work@gmail.com",
  linkedin: "https://www.linkedin.com/in/beinglucasvu",
  github: "https://github.com/VuMadeIt",
  instagram: "https://www.instagram.com/bigmanvu",
  x: "https://x.com/bigmanvu",
  devpost: "https://devpost.com/LucasMadeIt",
};

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="underline decoration-1 underline-offset-[5px] transition-colors hover:text-muted">
    {children}
  </a>
);

/** The designed close: one line in Lucas's voice, contact in running text, the name at full width. */
export function Close() {
  return (
    <footer aria-labelledby="close-title" className="relative z-10 overflow-hidden bg-wall">
      <div className="px-[var(--gutter)] pt-[clamp(120px,18vh,220px)]">
        <h2
          id="close-title"
          className="reveal max-w-[12em] text-[clamp(36px,7vw,112px)] font-normal leading-[0.95] tracking-[-0.02em]"
        >
          Let&apos;s get something moving.
        </h2>
        <p className="reveal mt-8 max-w-[34em] text-[clamp(18px,1.5vw,22px)] leading-[1.5]">
          I&apos;m looking for Summer 2027 co-op roles. Write to{" "}
          <A href={`mailto:${CONTACT.email}`}>{CONTACT.email}</A>, or find me on{" "}
          <A href={CONTACT.linkedin}>LinkedIn</A>, <A href={CONTACT.github}>GitHub</A>,{" "}
          <A href={CONTACT.devpost}>Devpost</A>, <A href={CONTACT.instagram}>Instagram</A> and{" "}
          <A href={CONTACT.x}>X</A>.
        </p>
      </div>
      <GiantName className="mt-[clamp(80px,12vh,160px)] translate-y-[0.1em]" />
    </footer>
  );
}
