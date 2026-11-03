const BALLS = [-1.5, -0.5, 0.5, 1.5];

/** Placeholder still of the cradle until the pre-rendered scene still replaces it (Phase 02). */
export function CradleStill() {
  return (
    <svg
      aria-hidden
      viewBox="-200 0 400 1000"
      preserveAspectRatio="xMidYMin meet"
      className="absolute inset-x-0 top-0 mx-auto h-[62%] w-auto"
    >
      {BALLS.map((x) => (
        <g key={x}>
          <line x1={x * 64} y1={0} x2={x * 64} y2={850} stroke="#9a978f" strokeWidth={0.6} />
          <circle cx={x * 64} cy={882} r={32} fill="#c9c7c2" />
        </g>
      ))}
    </svg>
  );
}
