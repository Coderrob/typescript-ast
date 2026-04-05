# Common Analysis Patterns

## Find A Named Call

Use `isNamedCall(...)` when you want exact matching against a static callee path.

```ts
import { isNamedCall } from "@coderrob/typescript-ast";

if (node.type === "CallExpression" && isNamedCall(node, "console.error")) {
  // matched console.error(...)
}
```

This only matches statically resolvable callees. For example:

- `console.error()` resolves
- `test.each()()` resolves to `test.each`
- `foo().bar()` does not resolve and returns `null` through path helpers

## Read A Callee Path

Use `getCalleeNamePath(...)` when you need the resolved string form.

```ts
const name = getCalleeNamePath(call.callee);
if (name === "logger.info") {
  // ...
}
```

If the callee cannot be resolved safely, the helper returns `null`.

## Search Descendants Safely

Use `findDescendant(...)` with visitor keys when you need to inspect nested shapes.

```ts
import { visitorKeys } from "@typescript-eslint/visitor-keys";
import { findDescendant, isIdentifier } from "@coderrob/typescript-ast";

const match = findDescendant(node, visitorKeys, isIdentifier);
```

You can also stop traversal into unwanted subtrees:

```ts
const match = findDescendant(node, visitorKeys, predicate, (child) => child.type === "FunctionExpression");
```

## Walk Up To Structural Boundaries

Use `findAncestor(...)`, `findEnclosingFunction(...)`, and `isInsideBoundary(...)` when rules depend on context.

Examples:

- whether a `return` is inside a function
- whether a node is inside a loop or callback
- whether a match boundary appears before a stop boundary

## Read Parameter Shapes

Use the parameter helpers when reading function signatures:

- `getFirstNonThisParameter(...)`
- `getNamedParameterIdentifier(...)`
- `getParameterTypeAnnotation(...)`
- `getObjectDestructuredParameterTypeNode(...)`

These helpers normalize several ESTree parameter forms so you do not have to repeat the same branching logic.

## Extract Simple Return Information

Use the statements helpers for rules that care about obvious boolean returns.

```ts
const value = getBooleanLiteralReturnValue(statement);
if (value === true) {
  // return true;
}
```

## Work With JSDoc Ownership

Use `getTargetNode(...)` and `getVariableOwnedTargetNode(...)` to determine where documentation should attach for function-like nodes.

This is useful when a function is:

- a declaration
- a method
- a single exported variable initializer

## Prefer Guards Plus Helpers

A reliable pattern in this package is:

1. Narrow the node with a guard
2. Pass the narrowed node to a helper
3. Treat unresolved cases as `null` instead of forcing assumptions

That pattern keeps rule code small and makes edge cases easier to test.
