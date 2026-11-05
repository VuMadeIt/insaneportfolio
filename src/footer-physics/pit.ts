/**
 * The home footer's ball pit (PLAN 13.4): balls dropped by the visitor fall, bounce and roll over
 * the footer's words. Pure TypeScript in CSS pixels (y down), separate from the cradle physics.
 * Circles against static boxes and against each other, small fixed substeps so a fast ball never
 * passes through a line of 16px text, Coulomb-ish friction plus rolling resistance so a ball rolls
 * to a stop on a flat word and rolls off a corner.
 */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Seconds spent nearly still while touching something. */
  still: number;
  asleep: boolean;
}

/** A hit worth a sound: speed into the surface (px/s) and where it happened. */
export interface Impact {
  speed: number;
  x: number;
}

const SUBSTEP = 1 / 240;
const ITERATIONS = 3;
/** Below this approach speed (px/s) a contact does not bounce, so resting balls do not buzz. */
const BOUNCE_BELOW = 45;
const SLEEP_SPEED = 6;
const SLEEP_AFTER = 0.5;

export class Pit {
  balls: Ball[] = [];
  boxes: Box[] = [];
  width = 0;
  height = 0;
  gravity = 2400;
  /** Restitution against words and walls, and between two balls (steel on steel rings more). */
  restitution = 0.4;
  ballRestitution = 0.6;
  /** Tangential impulse as a share of the normal one, and rolling slowdown per second in contact. */
  friction = 0.25;
  rolling = 0.9;
  maxBalls = 36;
  private nextId = 0;
  private touching = new Set<number>();

  setBounds(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.wake();
  }

  setBoxes(boxes: Box[]): void {
    this.boxes = boxes;
    this.wake();
  }

  wake(): void {
    for (const b of this.balls) {
      b.asleep = false;
      b.still = 0;
    }
  }

  /** Drop a ball at rest; the oldest goes once there are too many. */
  drop(x: number, y: number, r: number, vx = 0): Ball {
    const ball: Ball = { id: this.nextId++, x, y, vx, vy: 0, r, still: 0, asleep: false };
    this.balls.push(ball);
    if (this.balls.length > this.maxBalls) this.balls.shift();
    return ball;
  }

  get awake(): boolean {
    return this.balls.some((b) => !b.asleep);
  }

  /** Advance by `dt` real seconds (clamped, so a hidden tab does not explode the pit). */
  step(dt: number): Impact[] {
    const impacts: Impact[] = [];
    const total = Math.min(dt, 1 / 20);
    const n = Math.max(1, Math.ceil(total / SUBSTEP - 1e-9));
    const h = total / n;
    for (let s = 0; s < n; s++) {
      for (const b of this.balls) {
        if (b.asleep) continue;
        b.vy += this.gravity * h;
        b.x += b.vx * h;
        b.y += b.vy * h;
      }
      this.touching.clear();
      for (let k = 0; k < ITERATIONS; k++) this.solve(h, k === 0 ? impacts : null);
      for (const b of this.balls) {
        if (b.asleep) continue;
        if (this.touching.has(b.id)) {
          const slow = Math.max(0, 1 - this.rolling * h);
          b.vx *= slow;
          b.still = Math.hypot(b.vx, b.vy) < SLEEP_SPEED ? b.still + h : 0;
          if (b.still > SLEEP_AFTER) {
            b.asleep = true;
            b.vx = b.vy = 0;
          }
        } else b.still = 0;
      }
    }
    return impacts;
  }

  private solve(h: number, impacts: Impact[] | null): void {
    const { balls } = this;
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i]!;
      for (let j = i + 1; j < balls.length; j++) this.pair(a, balls[j]!, impacts);
    }
    for (const b of balls) {
      if (b.asleep) continue;
      for (const box of this.boxes) this.boxContact(b, box, h, impacts);
      this.walls(b, h, impacts);
    }
  }

  /** Resolve a contact on `b` with outward unit normal (nx, ny) and depth `pen`. */
  private contact(b: Ball, nx: number, ny: number, pen: number, h: number, impacts: Impact[] | null): void {
    b.x += nx * pen;
    b.y += ny * pen;
    this.touching.add(b.id);
    const vn = b.vx * nx + b.vy * ny;
    if (vn >= 0) return;
    const e = -vn < BOUNCE_BELOW ? 0 : this.restitution;
    const jn = -(1 + e) * vn;
    b.vx += jn * nx;
    b.vy += jn * ny;
    // Friction along the surface, never more than stops the sliding.
    const tx = -ny;
    const ty = nx;
    const vt = b.vx * tx + b.vy * ty;
    const jt = Math.min(Math.abs(vt), this.friction * jn + this.gravity * h * 0.02) * Math.sign(vt);
    b.vx -= jt * tx;
    b.vy -= jt * ty;
    if (impacts && -vn > BOUNCE_BELOW) impacts.push({ speed: -vn, x: b.x });
  }

  private boxContact(b: Ball, box: Box, h: number, impacts: Impact[] | null): void {
    const cx = Math.min(Math.max(b.x, box.x), box.x + box.w);
    const cy = Math.min(Math.max(b.y, box.y), box.y + box.h);
    const dx = b.x - cx;
    const dy = b.y - cy;
    const d2 = dx * dx + dy * dy;
    if (d2 > b.r * b.r) return;
    if (d2 > 1e-9) {
      const d = Math.sqrt(d2);
      this.contact(b, dx / d, dy / d, b.r - d, h, impacts);
      return;
    }
    // Centre inside the box: leave by the nearest side.
    const sides = [
      [b.x - box.x, -1, 0],
      [box.x + box.w - b.x, 1, 0],
      [b.y - box.y, 0, -1],
      [box.y + box.h - b.y, 0, 1],
    ] as const;
    const [depth, nx, ny] = sides.reduce((m, s) => (s[0] < m[0] ? s : m));
    this.contact(b, nx, ny, depth + b.r, h, impacts);
  }

  private walls(b: Ball, h: number, impacts: Impact[] | null): void {
    if (b.x < b.r) this.contact(b, 1, 0, b.r - b.x, h, impacts);
    if (b.x > this.width - b.r) this.contact(b, -1, 0, b.x - (this.width - b.r), h, impacts);
    if (b.y > this.height - b.r) this.contact(b, 0, -1, b.y - (this.height - b.r), h, impacts);
  }

  private pair(a: Ball, b: Ball, impacts: Impact[] | null): void {
    if (a.asleep && b.asleep) return;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const min = a.r + b.r;
    const d2 = dx * dx + dy * dy;
    if (d2 >= min * min || d2 < 1e-9) return;
    const d = Math.sqrt(d2);
    const nx = dx / d;
    const ny = dy / d;
    const pen = min - d;
    // A sleeping ball holds its place; the awake one does the moving (and wakes nothing it rests on).
    const shareA = a.asleep ? 0 : b.asleep ? 1 : 0.5;
    a.x -= nx * pen * shareA;
    a.y -= ny * pen * shareA;
    b.x += nx * pen * (1 - shareA);
    b.y += ny * pen * (1 - shareA);
    this.touching.add(a.id);
    this.touching.add(b.id);
    const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (vn >= 0) return;
    const e = -vn < BOUNCE_BELOW ? 0 : this.ballRestitution;
    if (-vn > BOUNCE_BELOW * 4 && (a.asleep || b.asleep)) {
      for (const s of [a, b]) {
        s.asleep = false;
        s.still = 0;
      }
    }
    const massA = a.asleep ? 0 : 1;
    const massB = b.asleep ? 0 : 1;
    const j = (-(1 + e) * vn) / (massA + massB || 1);
    a.vx -= j * nx * massA;
    a.vy -= j * ny * massA;
    b.vx += j * nx * massB;
    b.vy += j * ny * massB;
    if (impacts && -vn > BOUNCE_BELOW) impacts.push({ speed: -vn, x: (a.x + b.x) / 2 });
  }
}
