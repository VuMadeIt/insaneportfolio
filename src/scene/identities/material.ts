import * as THREE from "three";
import type { IdentitySlug } from "@/content/identities";
import type { Reveal } from "@/state/ui";
import { experiments, ideas, identityCommon, people, products, thinFilm } from "./glsl";

const BODIES: Record<IdentitySlug, string> = { people, ideas, experiments, products };
export const VARIANT: Record<Reveal, number> = { a: 0, b: 1, c: 2 };

export interface IdentityUniforms {
  uTime: { value: number };
  uReveal: { value: number };
  uFlow: { value: number };
  uVariant: { value: number };
  uHit: { value: THREE.Vector3 };
  uGaze: { value: THREE.Vector2 };
  uBlink: { value: number };
  uWeave: { value: number };
  uPhase: { value: number };
  uDetail: { value: number };
}

/**
 * Put an identity inside a ball material. `uReveal` (0..1) blends the finish into it with one of
 * three variants: A surface fade, B glass with the identity glowing inside, C a liquid-metal
 * ripple from the hover point. Only shader uniforms change; physics never sees any of it.
 */
export function withIdentity<T extends THREE.MeshStandardMaterial>(
  material: T,
  slug: IdentitySlug,
  radius: number,
  phase: number,
): T & { userData: { identity: IdentityUniforms } } {
  const uniforms: IdentityUniforms = {
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uFlow: { value: 1 },
    uVariant: { value: 1 },
    uHit: { value: new THREE.Vector3(0, 0, 1) },
    uGaze: { value: new THREE.Vector2() },
    uBlink: { value: 0 },
    uWeave: { value: 1 },
    uPhase: { value: phase },
    uDetail: { value: 1 },
  };
  const previous = material.onBeforeCompile;
  const previousKey = material.customProgramCacheKey.bind(material);
  material.onBeforeCompile = (shader, renderer) => {
    previous.call(material, shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vIdPos;\nvarying vec3 vIdView;")
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vIdPos = position / ${radius.toFixed(6)};
        vIdView = vIdPos - (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz / ${radius.toFixed(6)};`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        ${identityCommon}
        ${thinFilm}
        ${BODIES[slug]}`,
      )
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        float idAlpha = 1.0;
        if (uReveal > 0.001) {
          vec3 ro = normalize(vIdPos);
          vec3 rd = normalize(vIdView);
          vec3 inside = identity(ro, rd);
          vec3 metal = gl_FragColor.rgb;
          float cosV = clamp(dot(ro, -rd), 0.0, 1.0);
          float F = 0.04 + 0.96 * pow(1.0 - cosV, 5.0);
          // A dielectric shell reflects like glass (F), not like chrome (F0 = 0.55).
          vec3 glass = inside * (1.0 - F) + metal * F / 0.55 * 0.85;
          ${slug === "products" ? "glass += thinFilm(cosV, 320.0 + 300.0 * idFbm(ro * 2.5 + uTime * 0.04)) * (0.08 + 0.6 * F);" : ""}
          float show = smoothstep(0.0, 1.0, uReveal);
          vec3 revealed = glass;
          if (uVariant == 0) {
            revealed = inside + metal * F * 0.3;
          } else if (uVariant == 2) {
            float d = acos(clamp(dot(ro, normalize(uHit)), -1.0, 1.0));
            float wob = (idNoise(ro * 7.0) - 0.5) * 0.16;
            float front = uReveal * 2.1;
            show = smoothstep(front + 0.02, front - 0.2, d + wob);
            float ring = exp(-pow((d + wob - front) / 0.1, 2.0)) * (1.0 - smoothstep(0.85, 1.0, uReveal));
            metal *= 1.0 + 0.6 * sin((d - front) * 70.0) * ring;
          }
          gl_FragColor.rgb = mix(metal, revealed, show);
          // Glass: the wall shows through the clear rim (grazing reflection still wins at the edge).
          if (uVariant != 0) idAlpha = 1.0 - show * 0.55 * (1.0 - F) * smoothstep(0.5, 0.05, cosV);
        }`,
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        gl_FragColor *= vec4(vec3(idAlpha), idAlpha);`,
      );
  };
  material.customProgramCacheKey = () => `${previousKey()}-identity-${slug}`;
  material.userData.identity = uniforms;
  return material as T & { userData: { identity: IdentityUniforms } };
}
