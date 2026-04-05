# Calls And Navigation

## `ast/calls`

### Core helpers

- `getCallArgument(node, index)`
- `getFirstCallArgument(node)`
- `getStringLiteralCallArgument(node, index)`
- `getCalleeNamePath(callee)`
- `hasCallCalleeNamePath(node, expectedPath)`
- `hasIdentifierCallee(node, name)`
- `hasMemberCallee(node)`
- `getMatchingCallMemberMethodName(node, names)`
- `isNamedCall(node, name)`
- `isNamedMemberCall(node, objectName, propertyName)`

### Behavior notes

- `getCalleeNamePath(...)` resolves identifier and member paths such as `foo`, `foo.bar`, and `foo["bar"]`
- top-level chained call forms such as `test.each()()` resolve to `test.each`
- member access on a call result such as `foo().bar()` intentionally returns `null`
- unresolved or dynamic paths return `null` rather than guessing

### Typical uses

- ban or allow specific call targets
- inspect logging, test, or assertion helpers
- identify known method names on known objects

## `ast/navigation`

### Core helpers

- `findAncestor(node, predicate)`
- `findEnclosingFunction(node)`
- `getNextStatementInBlock(block, node)`
- `getNodeParent(node)`
- `getParentBlockStatement(node)`
- `isInsideBoundary(nodeOrAncestors, stopTypes, matchTypes)`

### Boundary semantics

`isInsideBoundary(...)` answers:

"Do I hit a match boundary before I hit a stop boundary?"

It supports:

- walking upward from a node via runtime parents
- evaluating an explicit ancestor array

Match precedence is intentional. If a node type appears in both collections, match wins before stop.

### Typical uses

- detect whether a node is inside a function, loop, or callback
- stop searching once a structural boundary is reached
- inspect neighboring statements inside a block
