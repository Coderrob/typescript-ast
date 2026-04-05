# Helpers, JSDoc, And Search

## `ast/helpers`

### Core helpers

- `getCallMemberMethodName(node)`
- `getFunctionDeclarationName(node)`
- `getFunctionMethodName(node)`
- `getFunctionVariableName(node)`
- `getIdentifierName(node)`
- `getLiteralStringValue(node)`
- `getMappedMemberPropertyName(node, replacements)`
- `getMemberPropertyName(node)`
- `getOptionMaxValue(option)`
- `getVisitorChildNodes(node, sourceCode)`
- `resolveFunctionName(node)`

### Public input contracts

- `VisitorKeySourceCodeLike`
  A structural contract with a `visitorKeys` map used by `getVisitorChildNodes(...)`.

### Typical uses

- resolve a descriptive function name for diagnostics
- read a member property name from dot or string-computed access
- collect direct visitor-key children without reimplementing traversal glue

## `ast/jsdoc`

### Public input contracts

- `JsdocSourceCodeLike`
  A structural contract with `lines` and `getCommentsBefore(...)` used by the JSDoc helpers.

### Core helpers

- `getJsdocComment(sourceCode, node)`
- `getLineIndentation(sourceCode, node)`
- `getParentOwnedTargetNode(node)`
- `getTargetNode(node)`
- `getVariableOwnedTargetNode(node)`
- `isJsdocBlockComment(comment)`
- `isParentOwnedTargetType(type)`
- `isStandaloneLineTarget(sourceCode, node)`

### Behavior notes

- upward ownership helpers depend on runtime `parent` links
- source-position helpers are location-safe:
  - `getLineIndentation(...)` returns `""` when `loc` is missing
  - `isStandaloneLineTarget(...)` returns `false` when `loc` is missing

### Typical uses

- attach generated JSDoc to the correct declaration node
- determine indentation when inserting documentation
- decide whether a target already starts at a standalone line

## `ast/search`

### Public input contracts

- `SearchVisitorKeyMapLike`
  A structural visitor-key map used by the search helpers.

### Core helpers

- `findDescendant(node, visitorKeys, predicate, stopPredicate?)`
- `hasMatchingDescendant(node, visitorKeys, predicate)`
- `hasMatchingDescendantUntil(node, visitorKeys, predicate, stopPredicate)`
- `hasSomeDescendant(node, visitorKeys, predicate, stopPredicate?)`

### Behavior notes

- traversal is depth-first
- `stopPredicate` blocks descent into children, not matching of the current node
- a node that matches both `predicate` and `stopPredicate` is still returned

### Typical uses

- search for nested calls, identifiers, or statements
- stop at nested function boundaries
- answer "does this subtree contain X?" without manual recursion
