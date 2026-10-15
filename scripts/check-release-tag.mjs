import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
const lockfile = JSON.parse(readFileSync(join(projectRoot, "package-lock.json"), "utf8"));
const changelog = readFileSync(join(projectRoot, "CHANGELOG.md"), "utf8");
const tag = process.argv[2];

if (tag !== `v${manifest.version}`) {
  throw new Error(`Tag ${tag ?? "<missing>"} does not match package version v${manifest.version}.`);
}

if (lockfile.version !== manifest.version || lockfile.packages[""].version !== manifest.version) {
  throw new Error("package-lock.json does not match package.json version.");
}

if (!changelog.includes(`## [${manifest.version}] - `)) {
  throw new Error(`CHANGELOG.md has no dated section for ${manifest.version}.`);
}

process.stdout.write(`Release tag ${tag} matches package metadata and changelog.\n`);
