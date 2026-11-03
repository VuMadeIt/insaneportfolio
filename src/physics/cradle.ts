import type { Body } from "./body";
import { type CradleConfig, type Derived, defaultConfig, derive } from "./config";
import { solveContacts } from "./contacts";
import { type Hand, clampTarget, createHand, solveHand } from "./drag";
import type { CollisionEvent } from "./events";
import { type Vec3, addScaled, clone, copy, distance, lerp, set, sub, vec } from "./vec";

const MAX_FRAME = 0.1;
const STEP_EPSILON = 1e-9;

/**
 * The Newton's cradle world in SI units. Each ball is a point mass hung from two unilateral
 * distance constraints (a string can pull, never push) to a front and a back anchor, integrated with
 * XPBD in many small substeps. Ball orientation is not simulated: the screw eye is rigidly fixed to
 * the ball and the strings meet at it, so the ball's up axis always points at the anchor midpoint.
 *
 * Coordinates: x along the row (swing direction), y up, z toward the viewer. Ball centres rest on
 * y = 0, anchors sit `pendulumLength` above them.
 */
export class Cradle {
  readonly config: CradleConfig;
  readonly derived: Derived;
  readonly balls: Body[];
  /** Impacts since the last `drainEvents()`. */
  readonly events: CollisionEvent[] = [];
  time = 0;
  asleep = true;
  hand: Hand | null = null;
  private accumulator = 0;
  private quietTime = 0;
  private readonly scratch = vec();

  constructor(config: CradleConfig = defaultConfig) {
    this.config = config;
    this.derived = derive(config);
    const { pitch, pendulumLength, mass } = this.derived;
    const s = config.anchorHalfSpread;
    this.balls = Array.from({ length: config.count }, (_, i) => {
      const x = (i - (config.count - 1) / 2) * pitch;
      const restAnchors: [Vec3, Vec3] = [vec(x, pendulumLength, s), vec(x, pendulumLength, -s)];
      return {
        pos: vec(x, 0, 0),
        prev: vec(x, 0, 0),
        stepStart: vec(x, 0, 0),
        vel: vec(),
        invMass: 1 / mass,
        restAnchors,
        anchors: [clone(restAnchors[0]), clone(restAnchors[1])],
        offsetFrom: vec(),
        offsetTo: vec(),
        anchorVel: vec(),
      };
    });
  }

  /** Advance by one render frame using a fixed-step accumulator. Returns the interpolation alpha. */
  advance(frameDt: number): number {
    const { dt } = this.config;
    this.accumulator += Math.min(frameDt, MAX_FRAME);
    while (this.accumulator >= dt - STEP_EPSILON) {
      this.step();
      this.accumulator -= dt;
    }
    return Math.max(0, this.accumulator / dt);
  }

  /** One fixed step of `dt`, made of `substeps` XPBD substeps. */
  step(): void {
    const { dt, substeps } = this.config;
    for (const b of this.balls) copy(b.stepStart, b.pos);
    if (this.asleep) {
      this.time += dt;
      return;
    }
    const h = dt / substeps;
    for (const b of this.balls) {
      sub(b.anchorVel, b.offsetTo, b.offsetFrom);
      b.anchorVel.x /= dt;
      b.anchorVel.y /= dt;
      b.anchorVel.z /= dt;
    }
    for (let s = 1; s <= substeps; s++) {
      const t = s / substeps;
      for (const b of this.balls) {
        lerp(this.scratch, b.offsetFrom, b.offsetTo, t);
        for (let k = 0; k < 2; k++) {
          const a = b.anchors[k]!;
          const r = b.restAnchors[k]!;
          set(a, r.x + this.scratch.x, r.y + this.scratch.y, r.z + this.scratch.z);
        }
      }
      if (this.hand) {
        copy(this.hand.last, this.hand.current);
        lerp(this.hand.current, this.hand.from, this.hand.target, t);
      }
      this.substep(h, this.time + s * h);
    }
    for (const b of this.balls) copy(b.offsetFrom, b.offsetTo);
    if (this.hand) copy(this.hand.from, this.hand.target);
    this.time += dt;
    this.updateSleep();
  }

  private substep(h: number, time: number): void {
    const { gravity, hysteresis, ball } = this.config;
    const { dragFactor, suspensionLength } = this.derived;
    for (const b of this.balls) {
      const v = b.vel;
      v.y -= gravity * h;
      const speed = Math.hypot(v.x, v.y, v.z);
      addScaled(v, v, -dragFactor * speed * h);
      v.x -= hysteresis * (v.x - b.anchorVel.x) * h;
      v.y -= hysteresis * (v.y - b.anchorVel.y) * h;
      v.z -= hysteresis * (v.z - b.anchorVel.z) * h;
      copy(b.prev, b.pos);
      addScaled(b.pos, v, h);
    }
    if (this.hand) {
      const { frequency, dampingRatio } = this.config.hand;
      const omega = 2 * Math.PI * frequency;
      const m = this.derived.mass;
      solveHand(this.balls[this.hand.ball]!, this.hand, h, m * omega * omega, 2 * dampingRatio * m * omega);
    }
    for (const b of this.balls) {
      for (const a of b.anchors) {
        const dx = b.pos.x - a.x;
        const dy = b.pos.y - a.y;
        const dz = b.pos.z - a.z;
        const len = Math.hypot(dx, dy, dz);
        if (len <= suspensionLength) continue;
        const k = (len - suspensionLength) / len;
        b.pos.x -= dx * k;
        b.pos.y -= dy * k;
        b.pos.z -= dz * k;
      }
    }
    for (const b of this.balls) {
      sub(b.vel, b.pos, b.prev);
      b.vel.x /= h;
      b.vel.y /= h;
      b.vel.z /= h;
    }
    solveContacts(this.balls, ball.radius, ball.restitution, ball.restingSpeed, time, this.events);
  }

  private updateSleep(): void {
    const moving =
      this.hand !== null || this.balls.some((b) => b.anchorVel.x || b.anchorVel.y || b.anchorVel.z);
    if (moving || this.kineticEnergy() > this.config.sleepEnergy) {
      this.quietTime = 0;
      return;
    }
    this.quietTime += this.config.dt;
    if (this.quietTime >= this.config.sleepTime) this.asleep = true;
  }

  wake(): void {
    this.asleep = false;
    this.quietTime = 0;
  }

  // Commands (the only way the interface layer changes the world) ---------------------------------

  /** Place ball `i` on its arc at `angle` (rad, positive toward +x), at rest. */
  lift(i: number, angle: number): void {
    const b = this.balls[i]!;
    const mid = this.anchorMid(i);
    const L = this.derived.pendulumLength;
    set(b.pos, mid.x + L * Math.sin(angle), mid.y - L * Math.cos(angle), mid.z);
    copy(b.prev, b.pos);
    copy(b.stepStart, b.pos);
    set(b.vel, 0, 0, 0);
    this.wake();
  }

  /** Put ball `i` anywhere (e.g. above its arc, strings slack). */
  place(i: number, pos: Vec3, vel: Vec3 = vec()): void {
    const b = this.balls[i]!;
    copy(b.pos, pos);
    copy(b.prev, pos);
    copy(b.stepStart, pos);
    copy(b.vel, vel);
    this.wake();
  }

  /** Add a horizontal velocity to ball `i` (keyboard push). */
  push(i: number, dvx: number): void {
    this.balls[i]!.vel.x += dvx;
    this.wake();
  }

  grab(i: number, target: Vec3): void {
    this.hand = createHand(i, this.clampedTarget(i, target));
    this.wake();
  }

  moveHand(target: Vec3): void {
    if (!this.hand) return;
    copy(this.hand.target, this.clampedTarget(this.hand.ball, target));
    this.wake();
  }

  release(): void {
    this.hand = null;
  }

  /** Kinematic anchor offset for ball `i`, reached at the end of the next fixed step. */
  setAnchorOffset(i: number, offset: Vec3): void {
    const to = this.balls[i]!.offsetTo;
    if (to.x === offset.x && to.y === offset.y && to.z === offset.z) return;
    copy(to, offset);
    this.wake();
  }

  /** Pop all impacts since the last call. */
  drainEvents(): CollisionEvent[] {
    return this.events.splice(0, this.events.length);
  }

  // Queries ---------------------------------------------------------------------------------------

  anchorMid(i: number, out: Vec3 = vec()): Vec3 {
    const [a, b] = this.balls[i]!.anchors;
    return set(out, (a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  }

  /** Interpolated render position of ball `i`. */
  renderPosition(i: number, alpha: number, out: Vec3 = vec()): Vec3 {
    const b = this.balls[i]!;
    return lerp(out, b.stepStart, b.pos, alpha);
  }

  /** Where the strings tie on: the screw eye, on the line from the centre to the anchor midpoint. */
  eyelet(i: number, centre: Vec3 = this.balls[i]!.pos, out: Vec3 = vec()): Vec3 {
    const mid = this.anchorMid(i, out);
    const d = distance(mid, centre);
    const k = d > 0 ? (this.config.ball.radius + this.config.eyeletHeight) / d : 0;
    return set(
      out,
      centre.x + (mid.x - centre.x) * k,
      centre.y + (mid.y - centre.y) * k,
      centre.z + (mid.z - centre.z) * k,
    );
  }

  /** Swing angle of ball `i` from straight down (rad, positive toward +x). */
  angle(i: number): number {
    const mid = this.anchorMid(i, this.scratch);
    const p = this.balls[i]!.pos;
    return Math.atan2(p.x - mid.x, mid.y - p.y);
  }

  kineticEnergy(): number {
    const m = this.derived.mass;
    return this.balls.reduce((e, b) => e + 0.5 * m * (b.vel.x ** 2 + b.vel.y ** 2 + b.vel.z ** 2), 0);
  }

  potentialEnergy(): number {
    const m = this.derived.mass;
    return this.balls.reduce((e, b) => e + m * this.config.gravity * b.pos.y, 0);
  }

  energy(): number {
    return this.kineticEnergy() + this.potentialEnergy();
  }

  momentumX(): number {
    return this.balls.reduce((p, b) => p + this.derived.mass * b.vel.x, 0);
  }

  /** Largest amount any string is stretched past its length (m). */
  maxStringError(): number {
    const L = this.derived.suspensionLength;
    let worst = 0;
    for (const b of this.balls) for (const a of b.anchors) worst = Math.max(worst, distance(b.pos, a) - L);
    return worst;
  }

  /** Exact fingerprint of the dynamic state (bit-for-bit), for determinism tests. */
  hash(): string {
    return this.balls.map((b) => [b.pos.x, b.pos.y, b.pos.z, b.vel.x, b.vel.y, b.vel.z].join(",")).join("|");
  }

  private clampedTarget(i: number, target: Vec3): Vec3 {
    return clampTarget(vec(), target, this.anchorMid(i), this.config.hand.maxAngle);
  }
}
