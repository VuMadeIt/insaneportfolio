import * as THREE from "three";
import type { Vec3 } from "@/physics/vec";

const RADIAL = 6;
/** The ring's directions, worked out once. */
const RING = Array.from(
  { length: RADIAL },
  (_, r) => [Math.cos((r / RADIAL) * Math.PI * 2), Math.sin((r / RADIAL) * Math.PI * 2)] as const,
);

/**
 * A tube rebuilt in place every frame through a rope's particles (Catmull-Rom). Besides the ring
 * positions it carries the centreline point and the tangent per vertex, so the shader can widen
 * the line to one device pixel and shade it as a clear fibre.
 */
export class StringTube {
  readonly geometry = new THREE.BufferGeometry();
  private readonly position: THREE.BufferAttribute;
  private readonly centre: THREE.BufferAttribute;
  private readonly tangent: THREE.BufferAttribute;
  private readonly normal: THREE.BufferAttribute;
  private readonly curve = new THREE.CatmullRomCurve3([], false, "centripetal");
  private readonly t = new THREE.Vector3();
  private readonly n = new THREE.Vector3();
  private readonly b = new THREE.Vector3();
  private readonly p = new THREE.Vector3();
  private readonly ref = new THREE.Vector3(0, 0, 1);

  constructor(
    readonly samples: number,
    readonly radius: number,
  ) {
    const count = samples * RADIAL;
    this.position = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.centre = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.tangent = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    this.normal = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    for (const a of [this.position, this.centre, this.tangent, this.normal])
      a.setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute("position", this.position);
    this.geometry.setAttribute("aCentre", this.centre);
    this.geometry.setAttribute("aTangent", this.tangent);
    this.geometry.setAttribute("normal", this.normal);
    const index: number[] = [];
    for (let s = 0; s < samples - 1; s++) {
      for (let r = 0; r < RADIAL; r++) {
        const a = s * RADIAL + r;
        const b = s * RADIAL + ((r + 1) % RADIAL);
        index.push(a, a + RADIAL, b, b, a + RADIAL, b + RADIAL);
      }
    }
    this.geometry.setIndex(index);
    this.curve.points = [];
    // Arc length is only used to space the samples along an almost straight line: 64 steps place
    // them within a fraction of a micrometre of the default 200, at a third of the cost per frame.
    this.curve.arcLengthDivisions = 64;
    // The tubes are never frustum-culled or raycast, so no bounding sphere is kept up to date.
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
  }

  update(points: Vec3[]): void {
    const pts = this.curve.points;
    while (pts.length < points.length) pts.push(new THREE.Vector3());
    pts.length = points.length;
    points.forEach((q, i) => pts[i]!.set(q.x, q.y, q.z));
    this.curve.updateArcLengths();
    for (let s = 0; s < this.samples; s++) {
      const u = s / (this.samples - 1);
      this.curve.getPointAt(u, this.p);
      this.curve.getTangentAt(u, this.t);
      this.n.crossVectors(this.ref, this.t).normalize();
      this.b.crossVectors(this.t, this.n);
      for (let r = 0; r < RADIAL; r++) {
        const [c, sn] = RING[r]!;
        const nx = this.n.x * c + this.b.x * sn;
        const ny = this.n.y * c + this.b.y * sn;
        const nz = this.n.z * c + this.b.z * sn;
        const i = s * RADIAL + r;
        this.position.setXYZ(
          i,
          this.p.x + nx * this.radius,
          this.p.y + ny * this.radius,
          this.p.z + nz * this.radius,
        );
        this.normal.setXYZ(i, nx, ny, nz);
        this.centre.setXYZ(i, this.p.x, this.p.y, this.p.z);
        this.tangent.setXYZ(i, this.t.x, this.t.y, this.t.z);
      }
    }
    this.position.needsUpdate =
      this.normal.needsUpdate =
      this.centre.needsUpdate =
      this.tangent.needsUpdate =
        true;
  }
}
