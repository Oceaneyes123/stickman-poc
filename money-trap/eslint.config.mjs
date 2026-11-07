import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { fetch: "readonly", Buffer: "readonly", console: "readonly" },
    },
  },
];
