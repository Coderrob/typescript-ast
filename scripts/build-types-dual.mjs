import { copyFileSync } from "node:fs";

const entryNames = ["index", "core", "typescript"];

for (const name of entryNames) {
  const sourcePath = `dist/${name}.d.mts`;
  copyFileSync(sourcePath, `dist/${name}.d.cts`);
  copyFileSync(sourcePath, `dist/${name}.d.ts`);
}
