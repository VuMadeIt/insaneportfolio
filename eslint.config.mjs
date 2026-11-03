import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "out/**", "reference/**", ".artifacts/**", "graphify-out/**", "next-env.d.ts"],
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
