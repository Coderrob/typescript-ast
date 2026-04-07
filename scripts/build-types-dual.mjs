import { copyFileSync, existsSync } from "node:fs";

const entryNames = ["index", "core", "typescript"];

function resolveSourcePath(name) {
  const candidates = [`dist/${name}.d.mts`, `dist/${name}.d.ts`, `dist/${name}.d.cts`];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Missing declaration output for "${name}". Expected one of: ${candidates.join(", ")}`);
}

for (const name of entryNames) {
  const sourcePath = resolveSourcePath(name);
  const targets = new Set([`dist/${name}.d.mts`, `dist/${name}.d.cts`, `dist/${name}.d.ts`]);

  targets.delete(sourcePath);

  for (const targetPath of targets) {
    copyFileSync(sourcePath, targetPath);
  }
}
