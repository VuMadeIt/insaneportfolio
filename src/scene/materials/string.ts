import * as THREE from "three";
import type { StringLook } from "../look";

/** Body colour (sRGB), body opacity, specular strength and shininess per string type. */
const LOOKS: Record<StringLook, { body: string; alpha: number; spec: number; shine: number }> = {
  nylon: { body: "#a9a59c", alpha: 0.5, spec: 0.9, shine: 60 },
  thread: { body: "#2a2826", alpha: 0.92, spec: 0.08, shine: 8 },
  wire: { body: "#8d8f92", alpha: 1, spec: 1, shine: 90 },
};

const vertexShader = /* glsl */ `
  attribute vec3 aCentre;
  attribute vec3 aTangent;
  uniform float uViewportHeight;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying float vCoverage;
  void main() {
    vec3 offset = position - aCentre;
    float r = length(offset);
    vec4 centreView = modelViewMatrix * vec4(aCentre, 1.0);
    // World size of one device pixel at this depth.
    float px = -centreView.z * 2.0 / (projectionMatrix[1][1] * uViewportHeight);
    float minR = 0.5 * px;
    float k = r < minR ? minR / r : 1.0;
    // Thinner than a pixel: draw one pixel wide and fade by the true coverage instead of shimmering.
    vCoverage = 1.0 / k;
    vec3 p = aCentre + offset * k;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vTangent = normalize(mat3(modelMatrix) * aTangent);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBody;
  uniform float uAlpha;
  uniform float uSpec;
  uniform float uShine;
  uniform vec3 uLight;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying float vCoverage;
  void main() {
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = normalize(uLight - vWorld);
    vec3 T = normalize(vTangent);
    // Kajiya-Kay: a fibre's highlight is a streak along its length.
    float tl = dot(T, L);
    float tv = dot(T, V);
    float spec = pow(max(0.0, sqrt(1.0 - tl * tl) * sqrt(1.0 - tv * tv) - tl * tv), uShine) * uSpec;
    // A clear fibre refracts the wall behind it: darker at the silhouette, clearer face-on.
    float edge = 1.0 - abs(dot(normalize(vNormal), V));
    float alpha = uAlpha * mix(0.55, 1.0, edge) + spec * 0.6;
    gl_FragColor = vec4(mix(uBody, vec3(1.0), clamp(spec, 0.0, 1.0)), clamp(alpha, 0.0, 1.0) * vCoverage);
    #include <colorspace_fragment>
  }
`;

export function stringMaterial(look: StringLook, light: THREE.Vector3): THREE.ShaderMaterial {
  const l = LOOKS[look];
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uBody: { value: new THREE.Color(l.body) },
      uAlpha: { value: l.alpha },
      uSpec: { value: l.spec },
      uShine: { value: l.shine },
      uLight: { value: light },
      uViewportHeight: { value: 900 },
    },
  });
}
