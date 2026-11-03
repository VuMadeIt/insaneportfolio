/** The name, edge to edge. On the hero it is the page's h1; in the close it is decoration. */
export function GiantName({ className = "", as: Tag = "p" }: { className?: string; as?: "h1" | "p" }) {
  return (
    <Tag
      aria-hidden={Tag === "p" ? true : undefined}
      className={`pointer-events-none select-none whitespace-nowrap text-center font-normal leading-[0.82] tracking-[-0.04em] ${className}`}
      style={{
        fontSize: "var(--giant-size, 30.5vw)",
        fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0',
      }}
    >
      Lucas Vu
    </Tag>
  );
}
