# API Overview

The package is organized by analysis concern rather than by AST node kind.

## Module Map

### `ast/calls`

Call-expression analysis:

- argument access
- callee path resolution
- identifier/member-call matching

### `ast/helpers`

General AST convenience helpers:

- function naming
- member-property resolution
- visitor-key child collection
- small literal/option utilities

### `ast/jsdoc`

JSDoc ownership and line-position helpers for function-like nodes.

### `ast/navigation`

Ancestor walking, enclosing-function lookup, sibling lookup, and boundary tests.

### `ast/parameters`

Parameter normalization and type-annotation extraction.

### `ast/search`

Visitor-key descendant search helpers.

### `ast/statements`

Helpers for return statements and boolean-literal values.

### `ast/types`

Type-reference inspection and wrapper unwrapping.

### `guards/nodes`

Reusable ESTree node guards and compatibility aliases.

### `import-paths`

Small import-path and filename utilities.

## Return Conventions

Most helpers follow these conventions:

- return `null` when a value cannot be resolved safely
- return `false` when a predicate cannot match
- avoid throwing for ordinary unresolved AST shapes

## API Notes

- `ast/navigation` and `ast/jsdoc` expect runtime parent links when walking upward
- `ast/jsdoc` source-position helpers are safe when `loc` is missing
- `ast/search` requires visitor keys
- `guards/nodes` exports both primary guards and compatibility alias constants
