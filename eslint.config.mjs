import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "out/**", "reference/**", ".artifacts/**", "graphify-out/**", "next-env.d.ts"],
  },
  {
    // three.js objects (materials, uniforms, the scene) are mutated imperatively every frame by
    // design; React Compiler's immutability rule cannot model that.
    files: ["src/scene/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
  {
    files: ["src/physics/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "three",
            "three/*",
            "react",
            "react-dom",
            "@react-three/*",
            "zustand",
            "@/scene/*",
            "@/state/*",
            "@/components/*",
          ],
        },
      ],
    },
  },
];

export default config;
