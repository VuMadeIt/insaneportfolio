const NAME = "LUCAS VU";

/**
 * The name, edge to edge, in General Sans capitals. On the hero it is the page's h1 and its letters
 * rise in one by one on load; in the close it is decoration.
 */
export function GiantName({
  className = "",
  as: Tag = "p",
  rise = false,
}: {
  className?: string;
  as?: "h1" | "p";
  rise?: boolean;
}) {
  return (
    <Tag
      aria-hidden={Tag === "p" ? true : undefined}
      className={`giant-name pointer-events-none select-none whitespace-nowrap text-center font-display leading-none ${className}`}
    >
      {rise ? (
        <>
          <span className="sr-only">Lucas Vu</span>
          {[...NAME].map((c, i) => (
            <span key={i} aria-hidden className="giant-letter" style={{ "--i": i } as React.CSSProperties}>
              {c === " " ? "\u00a0" : c}
            </span>
          ))}
        </>
      ) : (
        NAME
      )}
    </Tag>
  );
}
