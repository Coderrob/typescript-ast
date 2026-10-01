import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("Run this check through npm: npm run pack:smoke");
}

const temporaryRoot = mkdtempSync(join(tmpdir(), "typescript-ast-consumer-"));
const consumerRoot = join(temporaryRoot, "consumer");

function runNpm(args, cwd, captureOutput = false) {
  return execFileSync(process.execPath, [npmCli, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: join(temporaryRoot, "npm-cache") },
    stdio: captureOutput ? ["ignore", "pipe", "inherit"] : "inherit",
  });
}

function runNode(args) {
  execFileSync(process.execPath, args, { cwd: consumerRoot, stdio: "inherit" });
}

try {
  const packOutput = runNpm(
    ["pack", "--json", "--ignore-scripts", "--pack-destination", temporaryRoot],
    projectRoot,
    true,
  );
  const [{ filename }] = JSON.parse(packOutput);
  const archivePath = join(temporaryRoot, filename);

  mkdirSync(consumerRoot);
  writeFileSync(join(consumerRoot, "package.json"), '{"private":true,"type":"module"}\n');
  runNpm(
    ["install", "--offline", "--ignore-scripts", "--legacy-peer-deps", "--no-audit", "--no-fund", archivePath],
    consumerRoot,
  );

  const peerSource = join(projectRoot, "node_modules", "@typescript-eslint", "types");
  const peerTarget = join(consumerRoot, "node_modules", "@typescript-eslint", "types");
  mkdirSync(dirname(peerTarget), { recursive: true });
  cpSync(peerSource, peerTarget, { recursive: true });

  writeFileSync(
    join(consumerRoot, "consumer.cjs"),
    `const assert = require("node:assert/strict");
const root = require("@coderrob/typescript-ast");
const core = require("@coderrob/typescript-ast/core");
const typescript = require("@coderrob/typescript-ast/typescript");
assert.equal(root.getCalleeNamePath({ type: "Identifier", name: "logger" }), "logger");
assert.equal(core.isIdentifier({ type: "Identifier", name: "logger" }), true);
assert.equal(typescript.unwrapTsExpression({ type: "Identifier", name: "logger" }).name, "logger");
`,
  );

  writeFileSync(
    join(consumerRoot, "consumer.mjs"),
    `import assert from "node:assert/strict";
import { getCalleeNamePath } from "@coderrob/typescript-ast";
import { isIdentifier } from "@coderrob/typescript-ast/core";
import { unwrapTsExpression } from "@coderrob/typescript-ast/typescript";
assert.equal(getCalleeNamePath({ type: "Identifier", name: "logger" }), "logger");
assert.equal(isIdentifier({ type: "Identifier", name: "logger" }), true);
assert.equal(unwrapTsExpression({ type: "Identifier", name: "logger" }).name, "logger");
`,
  );

  const typeFixture = `import { getCalleeNamePath } from "@coderrob/typescript-ast";
import { isIdentifier } from "@coderrob/typescript-ast/core";
import { unwrapTsExpression } from "@coderrob/typescript-ast/typescript";
import type { TSESTree } from "@typescript-eslint/types";
declare const node: TSESTree.Identifier;
const path: string | null = getCalleeNamePath(node);
const matches: boolean = isIdentifier(node);
const expression: TSESTree.Expression = unwrapTsExpression(node);
// @ts-expect-error Published declarations must reject non-AST input.
getCalleeNamePath(42);
export { path, matches, expression };
`;
  writeFileSync(join(consumerRoot, "consumer.mts"), typeFixture);
  writeFileSync(join(consumerRoot, "consumer.cts"), typeFixture);

  runNode(["consumer.cjs"]);
  runNode(["consumer.mjs"]);
  runNode([
    join(projectRoot, "node_modules", "typescript", "bin", "tsc"),
    "--noEmit",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2020",
    "--strict",
    "--skipLibCheck",
    "consumer.mts",
    "consumer.cts",
  ]);

  process.stdout.write("Packed package works in CommonJS, ESM, and NodeNext declarations.\n");
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 3 });
}
