import type { Body } from "./body";
import type { CollisionEvent } from "./events";

const MAX_SWEEPS = 6;

/**
 * Sphere-sphere contacts, solved after the velocity update of each substep (Müller, Ten Minute
 * Physics 05). Overlap is removed by moving positions only, so the correction never injects
 * velocity; the impact itself is a normal impulse that sets the relative normal velocity to
 * `-e * v_n`. Because substeps are tiny and balls rest with a gap, a chain resolves as fast
 * sequential pairwise impacts, which is how a real cradle passes momentum through.
 */
export function solveContacts(
  bodies: Body[],
  radius: number,
  restitution: number,
  restingSpeed: number,
  time: number,
  events: CollisionEvent[],
): void {
  const minDist = 2 * radius;
  for (let sweep = 0; sweep < MAX_SWEEPS; sweep++) {
    let active = false;
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i]!;
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j]!;
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dy, dz);
        if (d >= minDist || d === 0) continue;
        const w = a.invMass + b.invMass;
        if (w === 0) continue;
        const nx = dx / d;
        const ny = dy / d;
        const nz = dz / d;

        const corr = (minDist - d) / w;
        a.pos.x -= nx * corr * a.invMass;
        a.pos.y -= ny * corr * a.invMass;
        a.pos.z -= nz * corr * a.invMass;
        b.pos.x += nx * corr * b.invMass;
        b.pos.y += ny * corr * b.invMass;
        b.pos.z += nz * corr * b.invMass;

        const vn = (a.vel.x - b.vel.x) * nx + (a.vel.y - b.vel.y) * ny + (a.vel.z - b.vel.z) * nz;
        if (vn <= 0) continue;
        active = true;
        const impulse = ((vn > restingSpeed ? -restitution * vn : 0) - vn) / w;
        a.vel.x += nx * impulse * a.invMass;
        a.vel.y += ny * impulse * a.invMass;
        a.vel.z += nz * impulse * a.invMass;
        b.vel.x -= nx * impulse * b.invMass;
        b.vel.y -= ny * impulse * b.invMass;
        b.vel.z -= nz * impulse * b.invMass;
        if (vn > restingSpeed) {
          events.push({
            time,
            a: i,
            b: j,
            speed: vn,
            point: { x: a.pos.x + nx * radius, y: a.pos.y + ny * radius, z: a.pos.z + nz * radius },
          });
        }
      }
    }
    if (!active) break;
  }
}

/** Deepest current overlap between any two balls (m); 0 when none touch. */
export function maxPenetration(bodies: Body[], radius: number): number {
  let worst = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i]!.pos;
      const b = bodies[j]!.pos;
      worst = Math.max(worst, 2 * radius - Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z));
    }
  }
  return worst;
}
