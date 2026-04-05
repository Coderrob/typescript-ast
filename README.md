# typescript-ast

[![Coverage](https://img.shields.io/badge/coverage-95.89%25-brightgreen)](coverage/)

Reusable, policy-agnostic AST interpretation helpers for TypeScript analysis.

## What This Package Is

`@coderrob/typescript-ast` is a lightweight utility toolkit for reading and interpreting TypeScript ESTree nodes in rule engines, static-analysis tools, and custom codemod workflows.

It focuses on predictable helpers for:

- call-expression analysis
- parameter and type-node inspection
- AST navigation and descendant search
- statement/value extraction
- small, composable node guards

## Why Use It

- Reduces repeated AST boilerplate in analysis code.
- Keeps guard and traversal behavior consistent across projects.
- Stays policy-agnostic so it can be used in linters, transforms, and audits.

## Installation

```bash
npm install @coderrob/typescript-ast
```

## Quick Start

```ts
import { getCalleeNamePath, hasMatchingDescendant, isNamedCall } from "@coderrob/typescript-ast";
```

## API Surface

Exports are grouped by module domain:

- `ast/calls`: call-shape and callee-name helpers
- `ast/navigation`: ancestor and boundary navigation
- `ast/parameters`: parameter and annotation extraction
- `ast/search`: visitor-key descendant search helpers
- `ast/statements`: return and boolean literal extraction
- `ast/types`: type-reference and wrapper helpers
- `guards/nodes`: ESTree node type guards
- `import-paths`: import-path utility checks

## Quality And Release

- TypeScript declarations are published from `dist`.
- Tests run on Vitest with Istanbul coverage.
- Project formatting is Prettier-based.
- Dependency graph checks are available via madge scripts.

Project docs:

- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

Useful scripts:

- `npm run test`
- `npm run test -- --coverage`
- `npm run deps:graph`
- `npm run deps:circular`
- `npm run lint`
- `npm run build`

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
