<p align="center">
	<img src="public/img/typescript-ast-logo.png" alt="@coderrob/typescript-ast logo" />
</p>

<h1 align="center">@coderrob/typescript-ast</h1>

<p align="center">Reusable, policy-agnostic AST interpretation helpers for TypeScript analysis.</p>

<p align="center">
	<a href="coverage/"><img src="https://img.shields.io/badge/coverage-95.89%25-brightgreen" alt="Coverage" /></a>
</p>

## Overview

`@coderrob/typescript-ast` is a focused utility toolkit for reading and interpreting TypeScript ESTree nodes in:

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

## Module Surface

- `ast/calls`: call-shape and callee-name helpers
- `ast/navigation`: ancestor and boundary navigation helpers
- `ast/parameters`: parameter and annotation extraction helpers
- `ast/search`: visitor-key descendant search helpers
- `ast/statements`: return and boolean literal extraction helpers
- `ast/types`: type-reference and wrapper-expression helpers
- `guards/nodes`: ESTree node type guards
- `import-paths`: import-path utility checks

## Quality Gates

This package ships with production-grade validation gates:

- TypeScript declarations published from `dist`
- linting with strict rule configuration
- full typecheck pass
- unit tests with Vitest
- Istanbul coverage thresholds
- circular dependency checks via madge
- package-quality linting via publint

Useful scripts:

- `npm run check`
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run typecheck`
- `npm run deps:circular`
- `npm run benchmark`

Project docs:

- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## Benchmarks

Benchmarks run with [tinybench](https://github.com/tinylibs/tinybench) on Node.js (100 000 iterations each).

| Task                                      | ops/sec    | avg (ns) | margin   |
| ----------------------------------------- | ---------- | -------- | -------- |
| `getCalleeNamePath` - identifier          | 10,487,025 | 104      | +/-0.06% |
| `getCalleeNamePath` - member chain        | 2,974,297  | 347      | +/-0.06% |
| `isNamedCall` - match                     | 9,227,404  | 116      | +/-0.06% |
| `hasMatchingDescendant` - CallExpression  | 1,255,912  | 1,001    | +/-0.68% |
| `hasMatchingDescendantUntil` - Identifier | 588,633    | 1,813    | +/-4.41% |
| `findDescendant` - CallExpression         | 1,550,813  | 734      | +/-2.28% |

Run benchmarks locally:

```bash
npm run benchmark
```
