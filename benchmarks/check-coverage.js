// @ts-check
"use strict";

/**
 * Validate the benchmark coverage plan against the current public API surface.
 *
 * The script ensures every exported function or exported function alias is
 * either benchmarked by `benchmarks/index.js` or explicitly listed as skipped
 * with a reason in `coverage-plan.json`. Compatibility aliases may inherit the
 * decision of the public function they reference.
 */
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const indexPath = path.join(projectRoot, "src", "index.ts");
const planPath = path.join(__dirname, "coverage-plan.json");
const benchmarkRunnerPath = path.join(__dirname, "index.js");
const EXPORT_FROM_PATTERN = /export \* from "\.\/(.+)";/g;
const EXPORTED_FUNCTION_PATTERN = /export function\s+(\w+)/g;
const EXPORTED_CONST_ALIAS_PATTERN = /export const\s+(\w+)\s*=\s*(\w+)\s*;/g;

/**
 * @typedef {{benchmarked: string[], skipped: Record<string, string>}} ModulePlan
 * @typedef {Record<string, ModulePlan>} CoveragePlan
 * @typedef {{exportedNames: string[], aliasTargets: Record<string, string>}} ModuleInventory
 * @typedef {{module: string, total: number, benchmarked: number, skipped: number}} ModuleSummary
 */

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
  return [...source.matchAll(EXPORT_FROM_PATTERN)].map((match) => match[1]);
}

/**
 * Collect exported function names and exported function-alias bindings from one
 * module file.
 * @param {string} modulePath - Module path from src/index.ts (without extension).
 * @returns {ModuleInventory} Exported names and alias relationships.
 */
function getExportedFunctionsForModule(modulePath) {
  const sourcePath = path.join(projectRoot, "src", `${modulePath}.ts`);
  const source = readText(sourcePath);
  const functionNames = [...source.matchAll(EXPORTED_FUNCTION_PATTERN)].map((match) => match[1]);
  /** @type {Record<string, string>} */
  const aliasTargets = {};

  for (const [, exportName, targetName] of source.matchAll(EXPORTED_CONST_ALIAS_PATTERN)) {
    aliasTargets[exportName] = targetName;
  }

  return {
    exportedNames: [...new Set([...functionNames, ...Object.keys(aliasTargets)])],
    aliasTargets,
  };
}

/**
 * Build module -> exported function inventory from public index exports.
 * @returns {Record<string, ModuleInventory>} Inventory keyed by module.
 */
function getExportInventory() {
  /** @type {Record<string, ModuleInventory>} */
  const inventory = {};
  for (const modulePath of getExportedModules()) {
    inventory[modulePath] = getExportedFunctionsForModule(modulePath);
  }
  return inventory;
}

/**
 * Resolve the canonical coverage-decision name for an exported function alias.
 * @param {string} exportName - Exported function or alias name.
 * @param {Record<string, string>} aliasTargets - Alias -> target lookup for the module.
 * @returns {string | null} Canonical function name, or null when the alias graph is cyclic.
 */
function getCoverageDecisionName(exportName, aliasTargets) {
  const seen = new Set();
  let currentName = exportName;

  while (currentName in aliasTargets) {
    if (seen.has(currentName)) {
      return null;
    }

    seen.add(currentName);
    currentName = aliasTargets[currentName];
  }

  return currentName;
}

/**
 * Check whether a function or alias is marked as benchmarked or skipped,
 * allowing aliases to inherit the decision of the function they reference.
 * @param {string} exportName - Exported function or alias name.
 * @param {Set<string>} names - Decision names from the benchmark plan.
 * @param {Record<string, string>} aliasTargets - Alias -> target lookup for the module.
 * @returns {boolean} True when the export has a matching decision.
 */
function hasCoverageDecision(exportName, names, aliasTargets) {
  const decisionName = getCoverageDecisionName(exportName, aliasTargets);
  return names.has(exportName) || (decisionName !== null && names.has(decisionName));
}

/**
 * Record errors for aliases whose targets do not resolve to an exported
 * function within the same module.
 * @param {ModuleInventory} moduleInventory - Exported names and alias relationships for the module.
 * @param {string} modulePath - Module currently being validated.
 * @param {string[]} errors - Error collector to append validation failures to.
 */
function addInvalidAliasErrors(moduleInventory, modulePath, errors) {
  for (const [aliasName, targetName] of Object.entries(moduleInventory.aliasTargets)) {
    const resolvedTargetName = getCoverageDecisionName(aliasName, moduleInventory.aliasTargets);
    if (resolvedTargetName === null) {
      errors.push(`Cyclic exported alias in module '${modulePath}': ${aliasName}.`);
      continue;
    }

    if (!moduleInventory.exportedNames.includes(resolvedTargetName) || resolvedTargetName === aliasName) {
      errors.push(`Invalid exported alias in module '${modulePath}': ${aliasName} -> ${targetName}.`);
    }
  }
}

/**
 * Record errors for exported functions that are missing a benchmark decision
 * or appear in both the benchmarked and skipped sets.
 * @param {ModuleInventory} moduleInventory - Exported names and alias relationships for the module.
 * @param {Set<string>} benchmarked - Functions marked for benchmarking.
 * @param {Set<string>} skipped - Functions explicitly skipped in the plan.
 * @param {string} modulePath - Module currently being validated.
 * @param {string[]} errors - Error collector to append validation failures to.
 */
function addCoverageDecisionErrors(moduleInventory, benchmarked, skipped, modulePath, errors) {
  for (const functionName of moduleInventory.exportedNames) {
    const isBenchmarked = hasCoverageDecision(functionName, benchmarked, moduleInventory.aliasTargets);
    const isSkipped = hasCoverageDecision(functionName, skipped, moduleInventory.aliasTargets);

    if (!isBenchmarked && !isSkipped) {
      errors.push(`Missing coverage decision for ${modulePath}:${functionName}.`);
    }

    if (isBenchmarked && isSkipped) {
      errors.push(`Duplicate coverage decision (benchmarked + skipped) for ${modulePath}:${functionName}.`);
    }
  }
}

/**
 * Record errors for benchmark-plan entries that reference unknown functions.
 * @param {Set<string>} names
 * @param {ModuleInventory} moduleInventory - Exported names and alias relationships for the module.
 * @param {string} modulePath - Module currently being validated.
 * @param {string[]} errors - Error collector to append validation failures to.
 * @param {"benchmarked" | "skipped"} label - Plan section being validated.
 */
function addUnknownFunctionErrors(names, moduleInventory, modulePath, errors, label) {
  for (const functionName of names) {
    if (!moduleInventory.exportedNames.includes(functionName)) {
      errors.push(`Unknown ${label} function in plan: ${modulePath}:${functionName}.`);
    }
  }
}

/**
 * Record errors when a function is marked as benchmarked in the plan but no
 * matching benchmark task label exists in `benchmarks/index.js`.
 * @param {Set<string>} benchmarked
 * @param {string} modulePath - Module currently being validated.
 * @param {string[]} benchmarkLabels - Benchmark task labels parsed from the runner.
 * @param {string[]} errors - Error collector to append validation failures to.
 */
function addMissingBenchmarkTaskErrors(benchmarked, modulePath, benchmarkLabels, errors) {
  for (const functionName of benchmarked) {
    if (!hasBenchmarkTaskForFunction(benchmarkLabels, functionName)) {
      errors.push(`Missing benchmark task for function: ${modulePath}:${functionName}.`);
    }
  }
}

/**
 * Create one summary row for console-table reporting.
 * @param {string} modulePath
 * @param {ModuleInventory} moduleInventory - Exported names and alias relationships for the module.
 * @param {Set<string>} benchmarked - Functions marked for benchmarking.
 * @param {Set<string>} skipped - Functions explicitly skipped in the plan.
 * @returns {ModuleSummary} Summary counts for the module.
 */
function createModuleSummary(modulePath, moduleInventory, benchmarked, skipped) {
  const benchmarkedCount = moduleInventory.exportedNames.filter((name) =>
    hasCoverageDecision(name, benchmarked, moduleInventory.aliasTargets),
  ).length;
  const skippedCount = moduleInventory.exportedNames.filter((name) =>
    hasCoverageDecision(name, skipped, moduleInventory.aliasTargets),
  ).length;

  return {
    module: modulePath,
    total: moduleInventory.exportedNames.length,
    benchmarked: benchmarkedCount,
    skipped: skippedCount,
  };
}

/**
 * Validate one module entry from the benchmark coverage plan.
 * @param {string} modulePath
 * @param {ModuleInventory} moduleInventory - Exported names and alias relationships for the module.
 * @param {ModulePlan} modulePlan - Plan entry for the module.
 * @param {string[]} benchmarkLabels - Benchmark task labels parsed from the runner.
 * @param {string[]} errors - Error collector to append validation failures to.
 * @param {ModuleSummary[]} summary - Summary collector for console reporting.
 */
function validateModulePlan(modulePath, moduleInventory, modulePlan, benchmarkLabels, errors, summary) {
  const benchmarked = new Set(modulePlan.benchmarked);
  const skipped = new Set(Object.keys(modulePlan.skipped));

  addInvalidAliasErrors(moduleInventory, modulePath, errors);
  addCoverageDecisionErrors(moduleInventory, benchmarked, skipped, modulePath, errors);
  addUnknownFunctionErrors(benchmarked, moduleInventory, modulePath, errors, "benchmarked");
  addMissingBenchmarkTaskErrors(benchmarked, modulePath, benchmarkLabels, errors);
  addUnknownFunctionErrors(skipped, moduleInventory, modulePath, errors, "skipped");
  summary.push(createModuleSummary(modulePath, moduleInventory, benchmarked, skipped));
}

/**
 * Record errors for modules that appear in the coverage plan but are not
 * re-exported from the public index.
 * @param {CoveragePlan} plan
 * @param {Record<string, ModuleInventory>} inventory - Public export inventory keyed by module path.
 * @param {string[]} errors - Error collector to append validation failures to.
 */
function addUnknownModuleErrors(plan, inventory, errors) {
  for (const modulePath of Object.keys(plan)) {
    if (!(modulePath in inventory)) {
      errors.push(`Plan contains non-exported module '${modulePath}'.`);
    }
  }
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
 * @returns {{errors: string[], summary: ModuleSummary[]}} Validation result.
 */
function validatePlan() {
  /** @type {CoveragePlan} */
  const plan = JSON.parse(readText(planPath));
  const inventory = getExportInventory();
  const benchmarkLabels = getBenchmarkTaskLabels();

  /** @type {string[]} */
  const errors = [];
  /** @type {ModuleSummary[]} */
  const summary = [];

  for (const [modulePath, moduleInventory] of Object.entries(inventory)) {
    const modulePlan = plan[modulePath];
    if (!modulePlan) {
      errors.push(`Missing module plan for '${modulePath}'.`);
      continue;
    }

    validateModulePlan(modulePath, moduleInventory, modulePlan, benchmarkLabels, errors, summary);
  }

  addUnknownModuleErrors(plan, inventory, errors);

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

console.log(
  "\nBenchmark coverage plan is valid: every exported function or function alias is benchmarked or explicitly skipped.",
);
