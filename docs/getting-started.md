# Getting Started

## Requirements

- Node.js 18 or newer
- TypeScript ESTree-compatible nodes, typically from `@typescript-eslint/typescript-estree` or ESLint parser services

## Installation

```bash
npm install @coderrob/typescript-ast
```

## Minimal Example

```ts
import { parse } from "@typescript-eslint/typescript-estree";
import { getCalleeNamePath, isNamedCall } from "@coderrob/typescript-ast";

const program = parse("logger.info('ready')", { jsx: false });
const statement = program.body[0];

if (statement.type === "ExpressionStatement" && statement.expression.type === "CallExpression") {
  console.log(getCalleeNamePath(statement.expression.callee));
  console.log(isNamedCall(statement.expression, "logger.info"));
}
```

## Working With Parent Links

Some helpers, especially in `ast/navigation` and `ast/jsdoc`, depend on runtime `parent` references. If your AST source does not attach them automatically, attach them before using those helpers.

The test suite uses `simpleTraverse` from `@typescript-eslint/typescript-estree` to do that.

Example:

```ts
import { simpleTraverse } from "@typescript-eslint/typescript-estree";

function attachParents(program) {
  simpleTraverse(
    program,
    {
      enter(node, parent) {
        if (parent) {
          Reflect.set(node, "parent", parent);
        }
      },
    },
    true,
  );
}
```

## Working With Source Locations

Helpers like `getLineIndentation` and `isStandaloneLineTarget` use `node.loc` when available. If a node was parsed without location data:

- `getLineIndentation(...)` returns `""`
- `isStandaloneLineTarget(...)` returns `false`

If you need those helpers, parse with locations enabled.

## Public Structural Contracts

Some helpers accept structural source-code objects rather than a concrete parser implementation:

- `VisitorKeySourceCodeLike` in `ast/helpers` expects a `visitorKeys` map
- `JsdocSourceCodeLike` in `ast/jsdoc` expects `lines` and `getCommentsBefore(...)`
- `SearchVisitorKeyMapLike` in `ast/search` expects a visitor-key map for descendant traversal

That keeps the package policy-agnostic while still making the required inputs explicit.

## Typical Inputs

This library is most useful when combined with:

- `@typescript-eslint/types`
- `@typescript-eslint/typescript-estree`
- ESLint `SourceCode` objects or compatible wrappers
- visitor keys from `@typescript-eslint/visitor-keys`

## Suggested Reading Order

1. [Common Analysis Patterns](guides/common-analysis-patterns.md)
2. [API Overview](api/index.md)
3. Module reference pages for the helpers you want to use
