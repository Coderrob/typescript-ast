import { copyFileSync } from "node:fs";

const entryNames = ["index", "core", "typescript"];

for (const name of entryNames) {
  copyFileSync(`dist/${name}.d.ts`, `dist/${name}.d.mts`);
  copyFileSync(`dist/${name}.d.ts`, `dist/${name}.d.cts`);
}
