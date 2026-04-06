// @ts-check
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const indexPath = path.join(projectRoot, "src", "index.ts");
const planPath = path.join(__dirname, "coverage-plan.json");
const benchmarkRunnerPath = path.join(__dirname, "index.js");

/**
 * Read a file as UTF-8 text.
 * @param {string} filePath - Absolute path to read.
 * @returns {string} File contents.
 */
function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

/**
 * Collect module specifiers exported from src/index.ts.
 * @returns {string[]} Exported module specifiers.
 */
function getExportedModules() {
  const source = readText(indexPath);
  return [...source.matchAll(/export \* from \"\.\/(.+)\";/g)].map((match) => match[1]);
}

/**
 * Collect exported function names from one module file.
 * @param {string} modulePath - Module path from src/index.ts (without extension).
 * @returns {string[]} Exported function names (deduplicated).
 */
function getExportedFunctionsForModule(modulePath) {
  const sourcePath = path.join(projectRoot, "src", `${modulePath}.ts`);
  const source = readText(sourcePath);
  const names = [...source.matchAll(/export function\s+([A-Za-z0-9_]+)/g)].map((match) => match[1]);
  return [...new Set(names)];
}

/**
 * Build module -> exported function inventory from public index exports.
 * @returns {Record<string, string[]>} Inventory keyed by module.
 */
function getExportInventory() {
  const inventory = {};
  for (const modulePath of getExportedModules()) {
    inventory[modulePath] = getExportedFunctionsForModule(modulePath);
  }
  return inventory;
}

/**
 * Parse benchmark task labels from benchmarks/index.js.
 * @returns {string[]} Benchmark task labels.
 */
function getBenchmarkTaskLabels() {
  const source = readText(benchmarkRunnerPath);
  return [...source.matchAll(/\.add\("([^"]+)"/g)].map((match) => match[1]);
}

/**
 * Check whether benchmark task labels include a function name token.
 * @param {string[]} labels - Benchmark labels to inspect.
 * @param {string} functionName - Function name to locate.
 * @returns {boolean} True when at least one label includes the function name.
 */
function hasBenchmarkTaskForFunction(labels, functionName) {
  return labels.some((label) => label.includes(functionName));
}

/**
 * Validate coverage plan against current public export inventory.
 * @returns {{errors: string[], summary: Array<{module: string, total: number, benchmarked: number, skipped: number}>}} Validation result.
 */
function validatePlan() {
  /** @type {Record<string, {benchmarked: string[], skipped: Record<string, string>}>} */
  const plan = JSON.parse(readText(planPath));
  const inventory = getExportInventory();
  const benchmarkLabels = getBenchmarkTaskLabels();

  const errors = [];
  const summary = [];

  for (const [modulePath, exportedFunctions] of Object.entries(inventory)) {
    const modulePlan = plan[modulePath];
    if (!modulePlan) {
      errors.push(`Missing module plan for '${modulePath}'.`);
      continue;
    }

    const benchmarked = new Set(modulePlan.benchmarked);
    const skipped = new Set(Object.keys(modulePlan.skipped));

    for (const functionName of exportedFunctions) {
      const isBenchmarked = benchmarked.has(functionName);
      const isSkipped = skipped.has(functionName);

      if (!isBenchmarked && !isSkipped) {
        errors.push(`Missing coverage decision for ${modulePath}:${functionName}.`);
      }

      if (isBenchmarked && isSkipped) {
        errors.push(`Duplicate coverage decision (benchmarked + skipped) for ${modulePath}:${functionName}.`);
      }
    }

    for (const functionName of benchmarked) {
      if (!exportedFunctions.includes(functionName)) {
        errors.push(`Unknown benchmarked function in plan: ${modulePath}:${functionName}.`);
      }

      if (!hasBenchmarkTaskForFunction(benchmarkLabels, functionName)) {
        errors.push(`Missing benchmark task for function: ${modulePath}:${functionName}.`);
      }
    }

    for (const functionName of skipped) {
      if (!exportedFunctions.includes(functionName)) {
        errors.push(`Unknown skipped function in plan: ${modulePath}:${functionName}.`);
      }
    }

    summary.push({
      module: modulePath,
      total: exportedFunctions.length,
      benchmarked: [...benchmarked].filter((name) => exportedFunctions.includes(name)).length,
      skipped: [...skipped].filter((name) => exportedFunctions.includes(name)).length,
    });
  }

  for (const modulePath of Object.keys(plan)) {
    if (!(modulePath in inventory)) {
      errors.push(`Plan contains non-exported module '${modulePath}'.`);
    }
  }

  return { errors, summary };
}

const result = validatePlan();
console.table(result.summary);

if (result.errors.length > 0) {
  console.error("\nBenchmark coverage plan errors:\n");
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("\nBenchmark coverage plan is valid: every exported function is benchmarked or explicitly skipped.");
