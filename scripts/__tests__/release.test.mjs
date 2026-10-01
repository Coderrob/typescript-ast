import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const updateScript = join(projectRoot, "scripts", "update-release-changelog.mjs");
const tagScript = join(projectRoot, "scripts", "check-release-tag.mjs");

function withChangelog(content, run) {
  const filePath = join(tmpdir(), `typescript-ast-changelog-${randomUUID()}.md`);
  writeFileSync(filePath, content);
  try {
    run(filePath);
  } finally {
    unlinkSync(filePath);
  }
}

test("release preparation preserves pending notes and opens a new Unreleased section", () => {
  withChangelog(
    "# Changelog\n\n## [Unreleased]\n\n### Added\n\n- Pending work.\n\n## [1.0.0] - 2026-04-06\n",
    (filePath) => {
      execFileSync(process.execPath, [updateScript, "1.0.1", filePath], {
        env: { ...process.env, RELEASE_DATE: "2026-10-01" },
      });
      assert.match(
        readFileSync(filePath, "utf8"),
        /## \[Unreleased\]\n\n## \[1\.0\.1\] - 2026-10-01\n\n### Added\n\n- Pending work\./,
      );
    },
  );
});

test("release preparation refuses an empty Unreleased section", () => {
  withChangelog("# Changelog\n\n## [Unreleased]\n\n## [1.0.0] - 2026-04-06\n", (filePath) => {
    assert.throws(() => execFileSync(process.execPath, [updateScript, "1.0.1", filePath], { stdio: "pipe" }));
  });
});

test("tag check accepts the current version and rejects another tag", () => {
  const version = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8")).version;
  assert.doesNotThrow(() => execFileSync(process.execPath, [tagScript, `v${version}`]));
  assert.throws(() => execFileSync(process.execPath, [tagScript, "v999.999.999"], { stdio: "pipe" }));
});
