/**
 * The name, edge to edge, in General Sans capitals. On the hero it is the page's h1 and its letters
 * rise in one by one on load; in the close it is decoration. The 404 swaps the text for "404".
 * `caption` sits above one of the words (`captionWord`), aligned to its left, centre or right.
 */
export function GiantName({
  className = "",
  as: Tag = "p",
  rise = false,
  text = "LUCAS VU",
  label = "Lucas Vu",
  caption,
  captionWord = 0,
  captionAlign = "left",
}: {
  className?: string;
  as?: "h1" | "p";
  rise?: boolean;
  text?: string;
  label?: string;
  caption?: React.ReactNode;
  captionWord?: number;
  captionAlign?: "left" | "center" | "right";
}) {
  let i = 0;
  const letter = (c: string) => (
    <span key={i} aria-hidden className="giant-letter" style={{ "--i": i++ } as React.CSSProperties}>
      {c}
    </span>
  );
  return (
    <Tag
      aria-hidden={Tag === "p" ? true : undefined}
      className={`giant-name pointer-events-none select-none whitespace-nowrap text-center font-display leading-none ${className}`}
    >
      {rise ? (
        <>
          <span className="sr-only">{label}</span>
          {text.split(" ").map((word, w) => (
            <span key={w}>
              {w > 0 && letter("\u00a0")}
              <span className="relative inline-block">
                {[...word].map(letter)}
                {caption && w === captionWord && (
                  <span className="giant-caption" data-align={captionAlign} data-word={w}>
                    {caption}
                  </span>
                )}
              </span>
            </span>
          ))}
        </>
      ) : (
        text
      )}
    </Tag>
  );
}
