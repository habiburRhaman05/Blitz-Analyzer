// First lint setup this repo has ever had. Next 16 removed the built-in
// `next lint` command, so this replaces it directly.
import nextPlugin from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  ...nextPlugin,
  ...nextTypescript,
  {
    ignores: [".next", "node_modules", "dist"],
  },
];
