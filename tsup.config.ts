import { defineConfig } from "tsup";

export default defineConfig({
  bundle: true,
  clean: false,
  dts: false,
  entry: {
    core: "src/core.ts",
    index: "src/index.ts",
    typescript: "src/typescript.ts",
  },
  format: ["cjs", "esm"],
  minify: true,
  outDir: "dist",
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  platform: "node",
  splitting: false,
  sourcemap: false,
  target: "es2020",
  treeshake: true,
});
