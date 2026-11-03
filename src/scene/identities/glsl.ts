/**
 * The four identities, rendered inside the sphere in object space (unit sphere, +z faces the
 * viewer at rest, +y up), so they swing and rotate with the ball. Each takes the ray entering the
 * sphere at `ro` with direction `rd` and returns linear colour. Black is depth, never a square.
 */
export const identityCommon = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uFlow;
uniform int uVariant;
uniform vec3 uHit;
uniform vec2 uGaze;
uniform float uBlink;
uniform float uWeave;
uniform float uPhase;
/** 1 for the main view, lower inside reflection passes (fewer steps where nobody looks closely). */
uniform float uDetail;
varying vec3 vIdPos;
varying vec3 vIdView;

float idHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float idNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(idHash(i), idHash(i + vec3(1, 0, 0)), f.x), mix(idHash(i + vec3(0, 1, 0)), idHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(idHash(i + vec3(0, 0, 1)), idHash(i + vec3(1, 0, 1)), f.x), mix(idHash(i + vec3(0, 1, 1)), idHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float idFbm3(vec3 p) {
  return 0.5 * idNoise(p) + 0.25 * idNoise(p * 2.03 + 17.1) + 0.125 * idNoise(p * 4.12 + 34.3);
}
float idFbm(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * idNoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }
`;

/** People: an iris filling the sphere's face, with blinks, breathing pupil and gaze. */
export const people = /* glsl */ `
vec3 identity(vec3 ro, vec3 rd) {
  // The iris is a disc just behind the cornea; the cornea is the sphere's front.
  float zi = 0.22;
  float t = (zi - ro.z) / min(rd.z, -1e-3);
  vec3 q = ro + rd * max(t, 0.0);
  vec2 uv = q.xy / 0.975 - uGaze;
  float r = length(uv);
  float a0 = atan(uv.y, uv.x);
  // Fibres wander as they run outward, like hair rather than spokes.
  float a = a0 + 0.22 * (idFbm(vec3(cos(a0) * 2.0, sin(a0) * 2.0, r * 3.0)) - 0.5);
  vec2 ring = vec2(cos(a), sin(a));

  float pupil = 0.27 + 0.02 * sin(uTime * 0.6 + uPhase);
  float tuft = idFbm(vec3(ring * 9.0, 1.7));
  float edge = 0.8 + 0.2 * tuft + 0.08 * (idNoise(vec3(ring * 55.0, 0.5)) - 0.5);
  float k = clamp((r - pupil) / (edge - pupil), 0.0, 1.0);

  float coarse = idFbm(vec3(ring * 6.0, r * 1.4 + 2.0));
  float fibre = idNoise(vec3(ring * 48.0, r * 4.0)) * 0.55 + idNoise(vec3(ring * 130.0, r * 7.0)) * 0.45;
  float strands = coarse * 0.5 + fibre * 0.5;

  // Palette from people-eye.jpg (vivid k-means): each strand takes a hue from a slow noise field,
  // crimson and pink favoured near the pupil, blues and cyans outward, orange and cream flecks.
  vec3 crimson = srgb(vec3(0.72, 0.16, 0.34));
  vec3 pink = srgb(vec3(0.92, 0.45, 0.62));
  vec3 salmon = srgb(vec3(0.92, 0.55, 0.38));
  vec3 cream = srgb(vec3(0.95, 0.88, 0.78));
  vec3 deep = srgb(vec3(0.17, 0.30, 0.66));
  vec3 cyan = srgb(vec3(0.16, 0.66, 0.86));
  vec3 ice = srgb(vec3(0.62, 0.84, 0.95));
  float hue = idFbm(vec3(ring * 3.5, r * 2.0 + 11.0)) + 0.35 * (fibre - 0.5) + 0.25 * (k - 0.4);
  vec3 col = mix(deep, cyan, smoothstep(0.25, 0.45, hue) * 0.8);
  col = mix(col, pink, smoothstep(0.42, 0.5, hue) * (1.0 - smoothstep(0.5, 0.58, hue)) * 0.8);
  col = mix(col, ice, smoothstep(0.5, 0.62, hue) * 0.7);
  col = mix(col, salmon, smoothstep(0.6, 0.72, hue));
  col = mix(col, cream, smoothstep(0.72, 0.85, hue) * 0.8);
  col = mix(mix(crimson, pink, coarse), col, smoothstep(0.1, 0.45, k + 0.25 * (coarse - 0.5)));

  col *= 0.3 + 1.3 * strands;
  col *= 1.0 + 0.5 * exp(-pow((k - 0.22 - 0.06 * coarse) / 0.05, 2.0));
  col *= 1.0 - 0.5 * smoothstep(0.64, 0.72, idNoise(vec3(ring * 16.0, r * 5.0))) * smoothstep(0.15, 0.5, k);
  col += cream * pow(fibre, 9.0) * 3.0;

  float mask = smoothstep(edge, edge - 0.14, r) * smoothstep(pupil - 0.01, pupil + 0.04, r);
  col *= 1.0 - 0.45 * smoothstep(0.8, 1.0, k);
  col *= mask;

  float lidTop = 1.15 - 1.2 * uBlink + 0.35 * uv.x * uv.x;
  float lidBottom = -1.15 + 1.2 * uBlink - 0.35 * uv.x * uv.x;
  float lid = smoothstep(lidTop - 0.04, lidTop + 0.04, uv.y) + smoothstep(lidBottom + 0.04, lidBottom - 0.04, uv.y);
  return col * (1.0 - clamp(lid, 0.0, 1.0)) * 1.5;
}
`;

/** Ideas: a white-hot core with radial filaments flowing like an AI voice orb. */
export const ideas = /* glsl */ `
vec3 identity(vec3 ro, vec3 rd) {
  float tExit = -2.0 * dot(ro, rd);
  int steps = int(mix(4.0, 10.0, uDetail));
  float dt = tExit / float(steps);
  vec3 acc = vec3(0.0);
  float flow = uTime * 0.07 * uFlow;
  float breathe = 1.0 + 0.08 * sin(uTime * 0.9 + uPhase);
  // Per-pixel jitter of the sample positions trades banding for fine grain.
  float jitter = 0.5 + 0.5 * (idHash(ro * 913.7) - 0.5);
  for (int i = 0; i < 10; i++) {
    if (i >= steps) break;
    vec3 p = ro + rd * (float(i) + jitter) * dt;
    float r = length(p);
    vec3 d = p / max(r, 1e-4);
    // Domain-warped noise over direction only, so it integrates into radial filaments.
    vec2 w = vec2(idFbm3(d * 1.6 + flow), idFbm3(d * 1.6 + 7.3 - flow));
    vec3 fp = d * 5.5 + vec3(w, w.x - w.y) * 2.0;
    float fil = idFbm3(fp) + 0.0625 * idNoise(fp * 8.4 + 51.0) + 0.06;
    float streak = pow(smoothstep(0.34, 0.8, fil), 1.7);
    float reach = 0.78 + 0.2 * w.x;
    float body = smoothstep(reach, reach - 0.3, r) * (1.0 - r * 0.35);
    float core = exp(-r * r / (0.008 * breathe)) * 7.0 + exp(-r * r / (0.07 * breathe)) * 1.0;
    // Warm and cool whites with faint prismatic fringes toward the edge, like the reference.
    vec3 tint = mix(vec3(1.0, 0.93, 0.82), vec3(0.8, 0.94, 1.0), smoothstep(0.35, 0.65, w.y));
    tint *= 1.0 + 0.2 * r * cos(6.2831 * (fil * 1.5 + r + vec3(0.0, 0.33, 0.67)));
    acc += (vec3(core) + streak * body * 4.2 * tint) * dt;
  }
  return acc * vec3(0.98, 1.0, 1.03);
}
`;

/** Experiments: comet electrons on tilted great circles weaving a wireframe sphere around a nucleus. */
export const experiments = /* glsl */ `
const int ORBITS = 30;
const int BRIGHT = 9;
vec3 identity(vec3 ro, vec3 rd) {
  vec3 acc = vec3(0.0);
  // The lattice breathes between sparse arcs and a full weave; uWeave restarts it on reveal.
  float trailLen = mix(0.6, 10.0, uWeave);
  int orbits = uDetail < 1.0 ? BRIGHT : ORBITS;
  for (int k = 0; k < ORBITS; k++) {
    if (k >= orbits) break;
    float f = float(k);
    float tilt = 0.2 + 1.3 * idHash(vec3(f, 1.3, 7.1));
    float spin = 6.2831 * idHash(vec3(f, 9.2, 2.4));
    vec3 n = normalize(vec3(sin(tilt) * cos(spin), cos(tilt), sin(tilt) * sin(spin)));
    vec3 u = normalize(cross(n, vec3(0.31, 0.83, 0.47)));
    vec3 v = cross(n, u);
    float R = 0.86 + 0.08 * idHash(vec3(f, 3.3, 1.1));
    // A thin line glows where the ray crosses its orbit's plane: crisp at any size, no marching.
    float dn = dot(rd, n);
    float tc = -dot(ro, n) / (abs(dn) < 1e-4 ? 1e-4 : dn);
    if (tc < 0.0 || tc > -2.0 * dot(ro, rd)) continue;
    vec3 p = ro + rd * tc;
    float off = length(p) - R;
    float phi = atan(dot(p, v), dot(p, u));
    float dir = mod(f, 2.0) * 2.0 - 1.0;
    float speed = 0.7 + 0.9 * idHash(vec3(f, 5.5, 8.8));
    float head = uTime * speed * dir + 6.2831 * idHash(vec3(f, 2.2, 4.4));
    float behind = mod((head - phi) * dir, 6.2831);
    bool bright = k < BRIGHT;
    float trail = exp(-behind / (bright ? trailLen : trailLen * 0.5)) + (bright ? 0.06 : 0.0) * uWeave;
    float width = (bright ? 0.004 : 0.0018) * (1.0 + 2.0 * min(behind, 2.0) / 2.0);
    float line = exp(-off * off / (width * width)) / max(abs(dn), 0.15);
    acc += vec3(0.82, 0.9, 1.0) * line * trail * (bright ? 0.28 : 0.07);
    // The electron itself: a small, very bright comet head.
    float h2 = behind * behind;
    acc += bright ? vec3(0.75, 0.88, 1.0) * exp(-off * off / 0.0004) * (exp(-h2 * 2500.0) * 6.0 + exp(-h2 * 150.0) * 1.2) / max(abs(dn), 0.2) : vec3(0.0);
  }
  vec3 c = ro + rd * max(0.0, -dot(ro, rd));
  float flare = 0.35 + 0.65 * smoothstep(0.75, 1.0, uReveal);
  float rc = length(c);
  vec3 nucleus = vec3(0.8, 0.9, 1.0) * (exp(-rc * rc / 0.003) * 2.5 + exp(-rc * rc / 0.05) * 0.3);
  vec2 g = abs(c.xy);
  nucleus += vec3(0.7, 0.85, 1.0) * (exp(-g.x * 120.0) * exp(-g.y * 10.0) + exp(-g.y * 120.0) * exp(-g.x * 10.0)) * 0.6;
  vec3 depth = mix(srgb(vec3(0.04, 0.08, 0.17)), vec3(0.0), smoothstep(0.1, 1.0, length(ro.xy)));
  return depth + acc + nucleus * flare;
}
`;

/** Products: a gladiolus swaying inside a soap bubble full of drifting clouds. */
export const products = /* glsl */ `
float bend(float y) { return 0.06 * sin(uTime * 0.7 + uPhase) * (y + 0.95) * (y + 0.95) * 0.4; }
float sdEllipsoid(vec3 p, vec3 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / k1; }
// x: distance, y: material (0 stem, 1 floret, 2 bud)
vec2 flower(vec3 p) {
  float y = clamp(p.y, -0.95, 0.82);
  vec3 sp = p - vec3(bend(p.y), 0.0, 0.0);
  vec2 res = vec2(max(length(sp.xz) - 0.016, abs(p.y + 0.06) - 0.88), 0.0);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float fy = -0.32 + fi * 0.19;
    float side = mod(fi, 2.0) * 2.0 - 1.0;
    vec3 c = vec3(bend(fy) + side * 0.06, fy, 0.03);
    vec3 lp = p - c;
    float ruffle = 0.018 * sin(atan(lp.y, lp.x) * 7.0 + fi) * sin(atan(lp.z, lp.x) * 5.0);
    float s = 1.25 - fi * 0.13;
    float d = sdEllipsoid(lp, vec3(0.14, 0.11, 0.09) * s) + ruffle * s;
    if (d < res.x) res = vec2(d, 1.0);
  }
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float by = 0.6 + fi * 0.1;
    vec3 c = vec3(bend(by) + (mod(fi, 2.0) - 0.5) * 0.04, by, 0.0);
    float d = sdEllipsoid(p - c, vec3(0.03, 0.06, 0.03) * (1.0 - fi * 0.2));
    if (d < res.x) res = vec2(d, 2.0);
  }
  res.x = max(res.x, -(0.82 - y));
  return res;
}
vec3 sky(vec3 d) {
  vec3 top = srgb(vec3(0.18, 0.34, 0.56));
  vec3 low = srgb(vec3(0.5, 0.6, 0.73));
  vec3 col = mix(low, top, smoothstep(-0.4, 0.8, d.y));
  vec3 drift = vec3(uTime * 0.015, 0.0, uTime * 0.01);
  float cloud = idFbm(d * 2.4 + drift);
  float puff = smoothstep(0.5, 0.68, cloud);
  float shade = idFbm(d * 2.4 + drift + vec3(0.06, 0.08, 0.0));
  return mix(col, mix(vec3(0.95), vec3(0.62, 0.66, 0.74), smoothstep(0.45, 0.75, shade)), puff * 0.9);
}
vec3 identity(vec3 ro, vec3 rd) {
  float tExit = -2.0 * dot(ro, rd);
  float t = 0.0;
  vec2 hit = vec2(-1.0);
  int steps = uDetail < 1.0 ? 20 : 48;
  for (int i = 0; i < 48; i++) {
    if (i >= steps) break;
    vec2 h = flower(ro + rd * t);
    if (h.x < 0.002) { hit = vec2(t, h.y); break; }
    t += h.x * 0.8;
    if (t > tExit) break;
  }
  vec3 col = sky(normalize(ro + rd * tExit));
  if (hit.x > 0.0) {
    vec3 p = ro + rd * hit.x;
    vec2 e = vec2(0.003, 0.0);
    vec3 n = normalize(vec3(flower(p + e.xyy).x - flower(p - e.xyy).x, flower(p + e.yxy).x - flower(p - e.yxy).x, flower(p + e.yyx).x - flower(p - e.yyx).x));
    vec3 L = normalize(vec3(-0.4, 0.7, 0.6));
    float diff = max(dot(n, L), 0.0);
    float back = pow(max(dot(-rd, -L) * 0.5 + 0.5, 0.0), 3.0);
    vec3 base = hit.y < 0.5 ? srgb(vec3(0.42, 0.55, 0.22)) : hit.y < 1.5 ? srgb(vec3(0.89, 0.47, 0.58)) : srgb(vec3(0.52, 0.6, 0.2));
    vec3 deepPink = srgb(vec3(0.74, 0.25, 0.38));
    if (hit.y > 0.5 && hit.y < 1.5) base = mix(deepPink, base, smoothstep(0.0, 0.6, diff));
    col = base * (0.35 + 0.9 * diff) + base * back * 0.5;
  }
  return col;
}
`;

/** Thin-film interference colour for a soap film `nm` thick, seen at cos(theta) = c. */
export const thinFilm = /* glsl */ `
vec3 thinFilm(float c, float nm) {
  float n = 1.33;
  float cosT = sqrt(1.0 - (1.0 - c * c) / (n * n));
  vec3 lambda = vec3(650.0, 530.0, 440.0);
  return 0.5 + 0.5 * cos(12.566 * n * nm * cosT / lambda);
}
`;
