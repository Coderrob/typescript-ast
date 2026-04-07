import { defineConfig } from "tsup";

const entry = {
  core: "src/core.ts",
  index: "src/index.ts",
  typescript: "src/typescript.ts",
};

const shared = {
  clean: false,
  outDir: "dist",
  platform: "node" as const,
  sourcemap: false,
  target: "es2020",
  treeshake: true,
};

export default defineConfig([
  {
    ...shared,
    bundle: true,
    dts: false,
    entry,
    format: ["cjs", "esm"],
    minify: true,
    noExternal: [/.*/],
    outExtension({ format }) {
      return {
        js: format === "cjs" ? ".cjs" : ".mjs",
      };
    },
    splitting: false,
  },
  ...Object.entries(entry).map(([name, path]) => ({
    ...shared,
    dts: { only: true },
    entry: { [name]: path },
    format: ["esm" as const],
  })),
]);
