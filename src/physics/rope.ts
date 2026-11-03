import { type Vec3, clone, copy, distance, lerp, vec } from "./vec";

const MAX_SUBSTEP = 1 / 600;
const ITERATIONS = 12;
/** Air damping of a thin line (1/s). */
const AIR_DAMPING = 3;
/** How fast tension pulls a taut line back to straight (s). Real tension is far faster; this keeps a hit visible for a few frames. */
const TENSION_TIME = 0.035;
/** Endpoints closer than this to the full length count as taut (m). */
const TAUT_TOLERANCE = 2e-4;

/**
 * Visual-only string: a chain of particles pinned at the anchor and at the ball's eyelet. It goes
 * straight when the endpoints are a full length apart, sags and sways when they come closer, and
 * shivers when the ball takes a hit. It never feeds back into the ball.
 */
export class Rope {
  readonly points: Vec3[];
  private readonly prev: Vec3[];
  private readonly segment: number;
  private readonly from = vec();
  private readonly to = vec();
  private readonly tmp = vec();

  constructor(
    readonly length: number,
    readonly segments: number,
    anchor: Vec3,
    end: Vec3,
    private readonly gravity = 9.81,
  ) {
    this.segment = length / segments;
    this.points = Array.from({ length: segments + 1 }, (_, i) => lerp(vec(), anchor, end, i / segments));
    this.prev = this.points.map(clone);
    copy(this.from, anchor);
    copy(this.to, end);
  }

  /** Advance by `dt`, moving the pinned ends linearly from their last positions to `anchor` and `end`. */
  step(dt: number, anchor: Vec3, end: Vec3): void {
    const n = Math.max(1, Math.ceil(dt / MAX_SUBSTEP));
    const h = dt / n;
    const damping = 1 - AIR_DAMPING * h;
    const relax = 1 - Math.exp(-h / TENSION_TIME);
    const startA = clone(this.points[0]!);
    const startB = clone(this.points[this.segments]!);
    for (let s = 1; s <= n; s++) {
      lerp(this.from, startA, anchor, s / n);
      lerp(this.to, startB, end, s / n);
      const taut = distance(this.from, this.to) >= this.length - TAUT_TOLERANCE;
      // Taut, the line's own weight is negligible against the ball's (sag ~ mu g L^2 / 8T, microns).
      const fall = taut ? 0 : this.gravity * h * h;
      for (let i = 1; i < this.segments; i++) {
        const p = this.points[i]!;
        const q = this.prev[i]!;
        const vx = (p.x - q.x) * damping;
        const vy = (p.y - q.y) * damping;
        const vz = (p.z - q.z) * damping;
        copy(q, p);
        p.x += vx;
        p.y += vy - fall;
        p.z += vz;
      }
      copy(this.points[0]!, this.from);
      copy(this.points[this.segments]!, this.to);
      this.solveSegments();
      if (taut) this.pullStraight(relax);
    }
  }

  /** A transverse kick (m/s) to the middle of the line, strongest at the centre, zero at the pins. */
  kick(velocity: Vec3, dt = MAX_SUBSTEP): void {
    for (let i = 1; i < this.segments; i++) {
      const w = Math.sin((Math.PI * i) / this.segments);
      const q = this.prev[i]!;
      q.x -= velocity.x * w * dt;
      q.y -= velocity.y * w * dt;
      q.z -= velocity.z * w * dt;
    }
  }

  /** Largest distance of any particle from the straight chord (m). */
  deviation(): number {
    const a = this.points[0]!;
    const b = this.points[this.segments]!;
    let worst = 0;
    for (let i = 1; i < this.segments; i++) {
      lerp(this.tmp, a, b, i / this.segments);
      worst = Math.max(worst, distance(this.tmp, this.points[i]!));
    }
    return worst;
  }

  private solveSegments(): void {
    const last = this.segments;
    for (let it = 0; it < ITERATIONS; it++) {
      for (let i = 0; i < last; i++) {
        const a = this.points[i]!;
        const b = this.points[i + 1]!;
        const wa = i === 0 ? 0 : 1;
        const wb = i + 1 === last ? 0 : 1;
        const w = wa + wb;
        if (w === 0) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const d = Math.hypot(dx, dy, dz);
        if (d === 0) continue;
        const k = (d - this.segment) / (d * w);
        a.x += dx * k * wa;
        a.y += dy * k * wa;
        a.z += dz * k * wa;
        b.x -= dx * k * wb;
        b.y -= dy * k * wb;
        b.z -= dz * k * wb;
      }
    }
  }

  /** Under tension the line wants to be straight: relax interior particles toward the chord. */
  private pullStraight(relax: number): void {
    const a = this.points[0]!;
    const b = this.points[this.segments]!;
    for (let i = 1; i < this.segments; i++) {
      const p = this.points[i]!;
      lerp(this.tmp, a, b, i / this.segments);
      lerp(p, p, this.tmp, relax);
    }
  }
}
