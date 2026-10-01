import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2];
const changelogPath = resolve(
  process.argv[3] ?? join(dirname(dirname(fileURLToPath(import.meta.url))), "CHANGELOG.md"),
);
const releaseDate = process.env.RELEASE_DATE ?? new Date().toISOString().slice(0, 10);

if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version ?? "")) {
  throw new Error("Expected a stable major.minor.patch version.");
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
  throw new Error("Expected RELEASE_DATE in YYYY-MM-DD format.");
}

const changelog = readFileSync(changelogPath, "utf8").replace(/\r\n/g, "\n");
const unreleasedHeading = "## [Unreleased]";
const unreleasedIndex = changelog.indexOf(unreleasedHeading);
const nextHeadingIndex = changelog.indexOf("\n## [", unreleasedIndex + unreleasedHeading.length);

if (
  unreleasedIndex < 0 ||
  changelog.indexOf(unreleasedHeading, unreleasedIndex + 1) !== -1 ||
  nextHeadingIndex < 0 ||
  !/^- /m.test(changelog.slice(unreleasedIndex + unreleasedHeading.length, nextHeadingIndex))
) {
  throw new Error("Expected one nonempty Unreleased section before the existing releases.");
}

if (changelog.includes(`## [${version}]`)) {
  throw new Error(`Changelog already contains version ${version}.`);
}

const updated = `${changelog.slice(0, unreleasedIndex)}${unreleasedHeading}\n\n## [${version}] - ${releaseDate}${changelog.slice(unreleasedIndex + unreleasedHeading.length)}`;
writeFileSync(changelogPath, updated);
process.stdout.write(`Prepared changelog for ${version}.\n`);
