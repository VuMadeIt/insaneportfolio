import * as THREE from "three";

let texture: THREE.Texture | null = null;

/** R = fingerprints and smudges, G = fine wear and scratches (ambientCG, CC0). */
export function imperfectionMap(): THREE.Texture {
  if (!texture) {
    texture = new THREE.TextureLoader().load("/textures/imperfections.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.NoColorSpace;
    texture.anisotropy = 8;
  }
  return texture;
}

/**
 * Add surface imperfections to a standard/physical material: roughness rises by `finger` where
 * the map has fingerprints and by `wear` where it has fine scratches. Never touches physics.
 */
export function withImperfections<T extends THREE.MeshStandardMaterial>(
  material: T,
  finger: number,
  wear: number,
  repeat = 1.5,
): T {
  const map = imperfectionMap();
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uImperfections = { value: map };
    shader.uniforms.uImperfect = { value: new THREE.Vector3(finger, wear, repeat) };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vImpUv;")
      .replace("#include <uv_vertex>", "#include <uv_vertex>\nvImpUv = uv;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform sampler2D uImperfections;\nuniform vec3 uImperfect;\nvarying vec2 vImpUv;",
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        vec2 impSample = texture2D(uImperfections, vImpUv * vec2(2.0, 1.0) * uImperfect.z).rg;
        roughnessFactor = clamp(roughnessFactor + uImperfect.x * impSample.r + uImperfect.y * (impSample.g - 0.38), 0.0, 1.0);`,
      );
  };
  material.customProgramCacheKey = () => `imperfect-${finger}-${wear}-${repeat}`;
  return material;
}
