<!-- markdownlint-disable MD033 MD041 -->
<p align="center">
  <img src="https://raw.githubusercontent.com/Coderrob/typescript-ast/main/public/img/typescript-ast-logo.png" alt="@coderrob/typescript-ast logo" />
</p>

<h1 align="center">@coderrob/typescript-ast</h1>

<p align="center">Policy-agnostic AST navigation helpers with optional TypeScript ESTree extensions.</p>

<p align="center">
  <a href="coverage/"><img src="https://img.shields.io/badge/coverage-95.89%25-brightgreen" alt="Coverage" /></a>
</p>
<!-- markdownlint-enable MD033 MD041 -->

## Overview

`@coderrob/typescript-ast` is a focused utility toolkit for navigating AST structure in:

- ESLint rules and custom lint engines
- static-analysis and architecture checks
- codemods and source-to-source transforms
- internal quality tooling and code intelligence workflows

The package is intentionally policy-agnostic: it helps you interpret AST shape and semantics without enforcing a particular rule style.

## Why Teams Use It

- Reduces repetitive AST traversal and narrowing boilerplate.
- Improves consistency of node interpretation across rule implementations.
- Encourages small, composable helpers that are easy to test.
- Keeps utility boundaries clean between parsing logic and policy logic.

## Installation

```bash
npm install @coderrob/typescript-ast
```

## Quick Start

```ts
import { getCalleeNamePath, hasMatchingDescendant, isNamedCall } from "@coderrob/typescript-ast";

const path = getCalleeNamePath(callExpression.callee);
const isTargetCall = isNamedCall(callExpression, "console.log");
const hasNestedCalls = hasMatchingDescendant(programNode, visitorKeys, (node) => node.type === "CallExpression");
```

## Entry Points

Use the package root when you want the full current API surface and compatibility with existing consumers.

Use `@coderrob/typescript-ast/core` when you want the structural AST helpers without the TypeScript-specific parameter and type helpers:

```ts
import { findAncestor, findDescendant, getCalleeNamePath } from "@coderrob/typescript-ast/core";
```

Use `@coderrob/typescript-ast/typescript` when you specifically want TypeScript ESTree extensions:

```ts
import { getParameterTypeAnnotation, unwrapTsExpression } from "@coderrob/typescript-ast/typescript";
```

## API Surface

Exports are grouped by module domain:

- `ast/calls`: call-shape and callee-name helpers
- `ast/helpers`: shared AST helper utilities
- `ast/jsdoc`: JSDoc target and ownership helpers
- `ast/navigation`: ancestor and boundary navigation helpers
- `ast/parameters`: parameter and annotation extraction helpers
- `ast/search`: visitor-key descendant search helpers
- `ast/statements`: return and boolean literal extraction helpers
- `ast/types`: type-reference and wrapper-expression helpers
- `guards/nodes`: ESTree node type guards
- `import-paths`: import-path utility checks

The library is intentionally split conceptually into:

- core structural helpers: `calls`, `helpers`, `jsdoc`, `navigation`, `search`, `statements`, generic guards, and import-path utilities
- TypeScript-specific extensions: `parameters`, `types`, and TS-prefixed node guards

If you want the cleanest mental model, prefer `@coderrob/typescript-ast/core` for structural AST work and add `@coderrob/typescript-ast/typescript` only when you actually need TS-specific node semantics.

## Functionality

Common tasks this library supports:

- Resolve callee name paths from calls and member-call chains.
- Match named calls and named object-member calls.
- Traverse descendants with optional stop predicates.
- Locate ancestors and evaluate boundary-aware parent relationships.
- Extract named parameters and parameter type annotations.
- Unwrap TypeScript wrapper expressions (`as`, non-null, satisfies).
- Read boolean return intent from return/block statements.
- Normalize import-path checks (filename, barrel, parent-directory import).

Practical examples:

### Detect A Specific Call Pattern

```ts
import { hasCallCalleeNamePath, isNamedMemberCall } from "@coderrob/typescript-ast";

const isConsoleError = hasCallCalleeNamePath(callNode, ["console", "error"]);
const isFsReadFileSync = isNamedMemberCall(callNode, "fs", "readFileSync");
```

### Search Descendants While Controlling Traversal

```ts
import { findDescendant } from "@coderrob/typescript-ast";

const found = findDescendant(
  program,
  visitorKeys,
  (node) => node.type === "CallExpression",
  (node) => node.type === "FunctionDeclaration",
);
```

### Read Parameter Typing And Unwrap TS Expressions

```ts
import { getNamedParameterName, getParameterTypeNode, unwrapTsExpression } from "@coderrob/typescript-ast";

const firstParam = fn.params[0];
const name = getNamedParameterName(firstParam);
const typeNode = getParameterTypeNode(firstParam);
const runtimeExpression = unwrapTsExpression(expression);
```

## Quality Gates

This package ships with production-grade validation gates:

- TypeScript declarations published from `dist`
- linting with strict rule configuration, including cyclomatic complexity under `4`
- source duplication checks with `jscpd` under `1%`
- full typecheck pass
- unit tests with Vitest
- Istanbul coverage thresholds
- circular dependency checks via madge
- package-quality linting via publint

Useful scripts:

- `npm run quality`
- `npm run duplication`
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run lint:fix`
- `npm run typecheck`
- `npm run publint`
- `npm run deps:circular`
- `npm run ci`
- `npm run bench`

Project docs:

- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Architecture](docs/architecture.md)

## Benchmarks

This repository includes a repeatable benchmark suite powered by [tinybench](https://github.com/tinylibs/tinybench).

Important context:

- Throughput values are highly machine-dependent (CPU, Node.js version, thermal state, background load).
- Static `ops/sec` numbers in docs can become stale and misleading over time.
- Use local benchmark execution for meaningful comparisons.

Current benchmark suite (`benchmarks/index.js`):

| Benchmark Task                                   | What It Measures                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| `getCalleeNamePath: member`                      | Callee-path extraction for a chained member call (`foo.bar.baz()`). |
| `getStringLiteralCallArgument: first`            | Reading the first string-literal argument from a call.              |
| `hasCallCalleeNamePath: member`                  | Exact path matching for a member call.                              |
| `hasMemberCallee: member`                        | Member-callee detection on a call expression.                       |
| `isNamedCall: simple`                            | Named call matching on a simple identifier call.                    |
| `getCallMemberMethodName: member`                | Member method-name extraction from a call expression.               |
| `getMemberPropertyName: member`                  | Member-property name resolution for a member expression.            |
| `getVisitorChildNodes: nested`                   | Direct child-node collection using visitor keys.                    |
| `resolveFunctionName: declaration`               | Function-name resolution for a declaration-shaped function.         |
| `getJsdocComment: basic`                         | Retrieving the nearest preceding JSDoc block.                       |
| `isJsdocBlockComment: basic`                     | JSDoc block-comment detection.                                      |
| `findAncestor: function`                         | Upward ancestor search to the nearest function boundary.            |
| `getParentBlockStatement: return`                | Locating the containing block for a return statement.               |
| `isInsideBoundary: ancestors`                    | Boundary matching over an explicit ancestor chain.                  |
| `getNamedParameterIdentifier: identifier`        | Parameter-name extraction for an identifier parameter.              |
| `getObjectDestructuredParameterTypeNode: object` | Type-node extraction from an object-destructured parameter.         |
| `getParameterTypeAnnotation: identifier`         | Parameter type-annotation lookup for a typed parameter.             |
| `findDescendant: call`                           | Depth-first descendant search for call expressions.                 |
| `hasMatchingDescendant: call`                    | Descendant existence checks for call expressions.                   |
| `hasMatchingDescendantUntil: identifier`         | Descendant search with a stop predicate.                            |
| `getBooleanLiteralReturnValue: return`           | Boolean-return extraction from a return statement.                  |
| `getReturnStatement: return`                     | Return-statement resolution from a statement input.                 |
| `unwrapTsExpression: wrapped`                    | Unwrapping TypeScript wrapper expressions.                          |
| `isNamedTypeReference: promise`                  | Named type-reference matching.                                      |
| `hasTypeArguments: promise`                      | Type-argument presence checks on a type reference.                  |
| `isCallExpression: simple`                       | Call-expression guard cost on a simple call.                        |
| `isIdentifier: callee`                           | Identifier guard cost on a call callee.                             |
| `isTestFile: convention`                         | Test-file path convention matching.                                 |
| `isUncomputedMemberExpression: callee`           | Non-computed member-expression guard cost.                          |
| `getFilename: path`                              | Filename extraction from a path string.                             |
| `isBarrelFile: index`                            | Barrel-file detection for index-style paths.                        |
| `isParentDirectoryImportPath: relative`          | Parent-directory import-path detection.                             |

Run benchmarks locally:

```bash
npm run bench
```

The benchmark output includes:

- task name
- `ops/sec`
- average latency in nanoseconds (`avg (ns)`)
- relative margin of error (`Margin`)
