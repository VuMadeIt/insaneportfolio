/** One physical description shared by every ball. Materials and hover never touch it. */
export interface BallSpec {
  /** m */
  radius: number;
  /** kg/m^3 (hardened chrome steel) */
  density: number;
  /** Coefficient of restitution for ball-ball impacts. */
  restitution: number;
  /** Impacts slower than this (m/s) are treated as perfectly inelastic resting contact. */
  restingSpeed: number;
  /** Sphere drag coefficient. */
  dragCoefficient: number;
}

export interface CradleConfig {
  ball: BallSpec;
  count: number;
  /** Free length of each monofilament string from its anchor to the eyelet (m). */
  stringLength: number;
  /** Half the front/back spacing of the two anchors of one ball (m). */
  anchorHalfSpread: number;
  /** Height of the screw eye's tie point above the ball surface (m). */
  eyeletHeight: number;
  /** Rest gap between neighbouring balls (m). A real cradle never quite touches. */
  gap: number;
  /** m/s^2, pointing down -y. */
  gravity: number;
  /** kg/m^3 */
  airDensity: number;
  /** Suspension hysteresis: linear damping of the swing relative to the anchors (1/s). */
  hysteresis: number;
  /** Fixed simulation step (s). */
  dt: number;
  substeps: number;
  /** The sim sleeps when kinetic energy stays below this (J) for `sleepTime` seconds. */
  sleepEnergy: number;
  sleepTime: number;
  hand: {
    /** Natural frequency of the soft hand constraint (Hz). */
    frequency: number;
    dampingRatio: number;
    /** The hand's target is limited to this angle from the vertical through the anchors (rad). */
    maxAngle: number;
  };
}

export const defaultConfig: CradleConfig = {
  ball: {
    radius: 0.0325,
    density: 7850,
    restitution: 0.975,
    restingSpeed: 0.002,
    dragCoefficient: 0.47,
  },
  count: 4,
  stringLength: 0.47,
  anchorHalfSpread: 0.11,
  eyeletHeight: 0.008,
  gap: 0.0001,
  gravity: 9.81,
  airDensity: 1.2,
  hysteresis: 0.03,
  dt: 1 / 240,
  substeps: 20,
  sleepEnergy: 2e-6,
  sleepTime: 2,
  hand: { frequency: 7, dampingRatio: 1, maxAngle: (70 * Math.PI) / 180 },
};

export interface Derived {
  mass: number;
  /** Quadratic drag factor k so that dv/dt = -k |v| v. */
  dragFactor: number;
  /** Distance from an anchor to the ball centre when the string is taut. */
  suspensionLength: number;
  /** Distance from the anchor midpoint to the ball centre when hanging (the pendulum length). */
  pendulumLength: number;
  /** Centre-to-centre spacing of neighbouring balls (and anchors) at rest. */
  pitch: number;
}

export function derive(config: CradleConfig): Derived {
  const { radius, density, dragCoefficient } = config.ball;
  const mass = density * (4 / 3) * Math.PI * radius ** 3;
  const area = Math.PI * radius ** 2;
  const s = config.anchorHalfSpread;
  // The eyelet sits on the line from the ball centre to the anchor midpoint, so the string, the
  // half spread and the eyelet-to-midpoint distance form a right triangle.
  const pendulumLength = Math.sqrt(config.stringLength ** 2 - s ** 2) + radius + config.eyeletHeight;
  return {
    mass,
    dragFactor: (0.5 * config.airDensity * dragCoefficient * area) / mass,
    suspensionLength: Math.hypot(pendulumLength, s),
    pendulumLength,
    pitch: 2 * radius + config.gap,
  };
}

export type ConfigOverrides = Partial<Omit<CradleConfig, "ball" | "hand">> & {
  ball?: Partial<BallSpec>;
  hand?: Partial<CradleConfig["hand"]>;
};

export function withConfig(overrides: ConfigOverrides = {}): CradleConfig {
  return {
    ...defaultConfig,
    ...overrides,
    ball: { ...defaultConfig.ball, ...overrides.ball },
    hand: { ...defaultConfig.hand, ...overrides.hand },
  };
}
