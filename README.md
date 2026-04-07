<p align="center">
  <img src="public/img/typescript-ast-logo.png" alt="typescript-ast logo" />
</p>

# `@coderrob/typescript-ast`

Policy-agnostic AST navigation helpers for TSESTree-compatible tooling.

`@coderrob/typescript-ast` is a focused utility library for inspecting, traversing, and interpreting AST nodes in ESLint rules, codemods, static analysis, and TypeScript-aware developer tooling. It helps you handle common AST tasks with small, composable helpers while keeping rule logic and policy decisions in your own code.

## Highlights

- Focused on AST ergonomics rather than framework-specific policy.
- Split entry points for structural helpers and TypeScript-specific extensions.
- Designed around TSESTree-shaped nodes used by the `@typescript-eslint` ecosystem.
- Useful in lint rules, repository analysis, codemods, and internal code intelligence workflows.
- Published with ESM and CommonJS bundles plus matching declaration files.

## Installation

```bash
npm install @coderrob/typescript-ast
```

If you also need to parse source code or supply visitor keys in your own tooling, install the relevant `@typescript-eslint` packages used by your stack.

## Requirements

- Node.js `>=18`
- AST nodes compatible with `@typescript-eslint/types` / `TSESTree`
- A visitor key map for descendant-search helpers such as `visitorKeys` from `@typescript-eslint/visitor-keys`

## Choose An Entry Point

| Entry point                           | Use when                                    | Includes                                                                                                   |
| ------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `@coderrob/typescript-ast`            | You want the full public API surface.       | Structural helpers, TypeScript-specific helpers, guards, and import-path utilities.                        |
| `@coderrob/typescript-ast/core`       | You only need structural AST utilities.     | Calls, navigation, JSDoc helpers, descendant search, statements, import paths, and general-purpose guards. |
| `@coderrob/typescript-ast/typescript` | You only need TypeScript ESTree extensions. | Parameter annotation helpers, type-reference helpers, TS expression unwrapping, and TS-specific guards.    |

The root entry point is the compatibility surface. For the clearest dependency boundaries, prefer `core` for general AST work and add `typescript` only when you need TypeScript-specific node semantics.

## Quick Start

This package operates on AST nodes you already have. It does not parse source code for you.

```ts
import { parse } from "@typescript-eslint/typescript-estree";
import { visitorKeys } from "@typescript-eslint/visitor-keys";
import {
  findDescendant,
  getStringLiteralCallArgument,
  isCallExpression,
  isNamedMemberCall,
} from "@coderrob/typescript-ast";

const ast = parse('console.error("boom")', { jsx: false });
const call = findDescendant(ast, visitorKeys, isCallExpression);

if (call && isNamedMemberCall(call, "console", "error")) {
  console.log(getStringLiteralCallArgument(call, 0));
}
```

## Common Workflows

### Match Call Shapes Without Manual Callee Inspection

Use the call helpers when you need to recognize direct calls, dotted member calls, or simple argument patterns.

```ts
import {
  getCalleeNamePath,
  getStringLiteralCallArgument,
  hasCallCalleeNamePath,
  isNamedCall,
  isNamedMemberCall,
} from "@coderrob/typescript-ast/core";

const calleePath = getCalleeNamePath(callExpression.callee);
const isConsoleError = isNamedMemberCall(callExpression, "console", "error");
const isReadFileSync = hasCallCalleeNamePath(callExpression, ["fs", "readFileSync"]);
const isDescribeCall = isNamedCall(callExpression, "describe");
const message = getStringLiteralCallArgument(callExpression, 0);
```

### Traverse Descendants With Explicit Stop Conditions

The search helpers work well when you need predictable traversal and want to stop descending into boundaries such as nested functions or classes.

```ts
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { visitorKeys } from "@typescript-eslint/visitor-keys";
import { findDescendant, isCallExpression } from "@coderrob/typescript-ast/core";

const nestedCall = findDescendant(
  program,
  visitorKeys,
  isCallExpression,
  (node) => node.type === AST_NODE_TYPES.FunctionDeclaration,
);
```

### Inspect TypeScript Parameters And Wrapped Expressions

Use the TypeScript entry point when you need parameter annotations, `this` parameter handling, or wrapper-expression unwrapping.

```ts
import {
  getFirstNonThisParameter,
  getParameterTypeNode,
  unwrapTsExpression,
} from "@coderrob/typescript-ast/typescript";

const param = getFirstNonThisParameter(functionNode.params);
const typeNode = param ? getParameterTypeNode(param) : null;
const runtimeExpression = unwrapTsExpression(expression);
```

### Normalize Import-Path Checks

The import-path helpers cover a few recurring repository-analysis checks without bringing in a full path abstraction layer.

```ts
import { getFilename, isBarrelFile, isParentDirectoryImportPath } from "@coderrob/typescript-ast/core";

const filename = getFilename(importSource);
const isIndexFile = isBarrelFile(resolvedPath);
const walksUp = isParentDirectoryImportPath(importPath);
```

## API Areas

The public API is organized by concern rather than by large utility classes.

| Area                  | Representative helpers                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Call analysis         | `getCalleeNamePath`, `getCallArgument`, `hasCallCalleeNamePath`, `isNamedCall`, `isNamedMemberCall`       |
| Structural navigation | `findAncestor`, `findEnclosingFunction`, `getNodeParent`, `getParentBlockStatement`, `isInsideBoundary`   |
| Descendant search     | `findDescendant`, `hasMatchingDescendant`, `hasMatchingDescendantUntil`, `hasSomeDescendant`              |
| JSDoc ownership       | `getJsdocComment`, `getTargetNode`, `getParentOwnedTargetNode`, `isJsdocBlockComment`                     |
| Statement helpers     | `getBooleanLiteralReturnValue`, `getReturnStatement`, `getSingleReturnStatement`                          |
| TypeScript helpers    | `getParameterTypeAnnotation`, `getParameterTypeNode`, `getFirstTypeArgument`, `unwrapTsExpression`        |
| Guards                | `isCallExpression`, `isIdentifier`, `isFunctionLike`, `isUncomputedMemberExpression`, `isTSTypeReference` |
| Import paths          | `getFilename`, `isBarrelFile`, `isParentDirectoryImportPath`                                              |

For the complete surface, inspect the exported declarations in `dist` or use editor IntelliSense from one of the supported entry points.

## Design Principles

- Keep AST utilities small, explicit, and easy to test.
- Separate structural analysis from rule policy and reporting logic.
- Avoid coupling the package to a single lint engine or transform framework.
- Expose TypeScript-specific behavior through a distinct entry point instead of mixing it into every structural helper.

## Repository Quality Standards

The repository is maintained with release gates intended for publishable library code:

- ESLint and Prettier for source consistency
- TypeScript validation for library and test projects
- Vitest coverage enforcement
- source-duplication checks with `jscpd`
- circular-dependency checks with `madge`
- package-quality linting with `publint`
- repeatable micro-benchmarks with `tinybench`

Useful commands:

- `npm run build`
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run typecheck`
- `npm run quality`
- `npm run deps:circular`
- `npm run bench`
- `npm run ci`

## Benchmarks

Latest local benchmark snapshot:

- Date: April 7, 2026
- Command: `npm run bench`
- Runtime: Node.js `v22.19.0`
- OS: `Microsoft Windows NT 10.0.26200.0`
- Benchmark coverage plan: every exported function or function alias is benchmarked or explicitly skipped

These numbers are machine-dependent and should be treated as a point-in-time reference rather than a portability guarantee.

| Task                                             |    ops/sec | avg (ns) | Margin |
| ------------------------------------------------ | ---------: | -------: | ------ |
| `getCalleeNamePath: member`                      |  5,526,017 |      216 | ±0.71% |
| `getStringLiteralCallArgument: first`            | 13,449,858 |       57 | ±0.40% |
| `hasCallCalleeNamePath: member`                  |  7,125,853 |      206 | ±2.56% |
| `hasMemberCallee: member`                        | 14,309,821 |       53 | ±0.48% |
| `isNamedCall: simple`                            | 10,416,387 |       83 | ±1.08% |
| `getCallMemberMethodName: member`                | 14,316,050 |       53 | ±0.89% |
| `getMemberPropertyName: member`                  | 17,801,975 |       43 | ±0.94% |
| `getVisitorChildNodes: nested`                   |  2,224,307 |      549 | ±5.15% |
| `resolveFunctionName: declaration`               | 12,171,612 |       64 | ±0.36% |
| `getJsdocComment: basic`                         | 14,378,233 |       54 | ±4.28% |
| `isJsdocBlockComment: basic`                     | 17,822,074 |       43 | ±0.61% |
| `findAncestor: function`                         | 15,325,788 |       49 | ±0.45% |
| `getParentBlockStatement: return`                | 15,003,039 |       51 | ±4.15% |
| `isInsideBoundary: ancestors`                    |  7,381,892 |      157 | ±0.10% |
| `getNamedParameterIdentifier: identifier`        | 14,808,104 |       51 | ±0.36% |
| `getObjectDestructuredParameterTypeNode: object` |  9,918,208 |       94 | ±0.79% |
| `getParameterTypeAnnotation: identifier`         | 10,692,934 |       77 | ±0.24% |
| `findDescendant: call`                           |  1,149,220 |     1055 | ±3.88% |
| `hasMatchingDescendant: call`                    |  1,147,135 |     1047 | ±7.89% |
| `hasMatchingDescendantUntil: identifier`         |    705,477 |     1571 | ±3.02% |
| `getBooleanLiteralReturnValue: return`           | 12,703,016 |       60 | ±0.26% |
| `getReturnStatement: return`                     | 14,658,744 |       52 | ±0.29% |
| `unwrapTsExpression: wrapped`                    |  9,376,505 |      111 | ±0.47% |
| `isNamedTypeReference: promise`                  | 12,910,823 |       59 | ±0.79% |
| `hasTypeArguments: promise`                      | 18,079,021 |       42 | ±0.97% |
| `isCallExpression: simple`                       | 14,820,742 |       51 | ±0.50% |
| `isIdentifier: callee`                           | 14,730,622 |       52 | ±1.01% |
| `isTestFile: convention`                         |  9,831,030 |      103 | ±1.27% |
| `isUncomputedMemberExpression: callee`           | 14,698,690 |       51 | ±0.28% |
| `getFilename: path`                              |  9,924,890 |       94 | ±0.62% |
| `isBarrelFile: index`                            |  9,692,900 |      104 | ±0.64% |
| `isParentDirectoryImportPath: relative`          | 16,641,774 |       46 | ±0.71% |

Run the suite again locally when you need numbers for a different machine, Node.js version, or code revision:

```bash
npm run bench
```

## Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Architecture Notes](docs/architecture.md)

## License

[Apache-2.0](LICENSE)
