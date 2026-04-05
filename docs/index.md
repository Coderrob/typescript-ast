# typescript-ast

`@coderrob/typescript-ast` is a small utility library for reading and interpreting TypeScript ESTree nodes.

It is designed for:

- ESLint rules and rule helpers
- static analysis tooling
- codemods and AST inspections
- custom repository audits

The package stays deliberately policy-agnostic. It does not decide whether a pattern is good or bad; it helps you inspect AST structure consistently.

## What It Provides

- Call-expression helpers for callee names, argument access, and member-call matching
- Ancestor and boundary navigation helpers
- Parameter and type-annotation extraction
- Descendant search helpers driven by visitor keys
- Statement/value helpers for return and boolean-literal analysis
- Small node guards and import-path helpers
- JSDoc placement helpers for function-like nodes

## Design Goals

- Small composable helpers
- Predictable null-returning behavior for unresolved cases
- Safe handling of runtime parent links and optional source locations
- Reusable primitives that work across linters, transforms, and audits

## Repository Structure

- `src/ast` contains the public AST interpretation helpers
- `src/guards` contains reusable public node guards
- `src/internal` contains private support utilities used to keep public modules focused
- `src/__tests__` contains the test suite and test-only helpers

The organization is intentional: public modules define user-facing behavior, while internal modules carry implementation details such as runtime parent access, visitor-key expansion, and source-line lookup.

## Public Surface

The package exports:

- `ast/calls`
- `ast/helpers`
- `ast/jsdoc`
- `ast/navigation`
- `ast/parameters`
- `ast/search`
- `ast/statements`
- `ast/types`
- `guards/nodes`
- `import-paths`

Internal files under `src/internal` are implementation details and are not part of the supported public API.

## Next Steps

- Read [Getting Started](getting-started.md) for installation and a minimal setup
- Read [Architecture](architecture.md) for folder boundaries and naming rules
- Use [Common Analysis Patterns](guides/common-analysis-patterns.md) for practical examples
- Browse the [API reference](api/index.md) by module
