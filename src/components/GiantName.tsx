/**
 * The name, edge to edge, in General Sans capitals. On the hero it is the page's h1 and its letters
 * rise in one by one on load; in the close it is decoration. The 404 swaps the text for "404".
 */
export function GiantName({
  className = "",
  as: Tag = "p",
  rise = false,
  text = "LUCAS VU",
  label = "Lucas Vu",
}: {
  className?: string;
  as?: "h1" | "p";
  rise?: boolean;
  text?: string;
  label?: string;
}) {
  return (
    <Tag
      aria-hidden={Tag === "p" ? true : undefined}
      className={`giant-name pointer-events-none select-none whitespace-nowrap text-center font-display leading-none ${className}`}
    >
      {rise ? (
        <>
          <span className="sr-only">{label}</span>
          {[...text].map((c, i) => (
            <span key={i} aria-hidden className="giant-letter" style={{ "--i": i } as React.CSSProperties}>
              {c === " " ? "\u00a0" : c}
            </span>
          ))}
        </>
      ) : (
        text
      )}
    </Tag>
  );
}
