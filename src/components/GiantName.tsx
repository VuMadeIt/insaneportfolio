export function GiantName({ className = "" }: { className?: string }) {
  return (
    <p
      aria-hidden
      className={`pointer-events-none select-none whitespace-nowrap text-center font-normal leading-[0.82] tracking-[-0.04em] ${className}`}
      style={{
        fontSize: "var(--giant-size, 30.5vw)",
        fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0',
      }}
    >
      Lucas Vu
    </p>
  );
}
