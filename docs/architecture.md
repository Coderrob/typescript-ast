# Architecture

## Folder Responsibilities

- `src/ast`
  Public AST interpretation helpers grouped by analysis concern.
- `src/guards`
  Public reusable node guards and compatibility aliases.
- `src/internal`
  Private implementation support for runtime parent access, source-line lookup, and visitor-key child collection.
- `src/__tests__`
  Test files plus `test-helpers` used only by the suite.

## Boundary Rules

- Public behavior should be documented and exported from `src/index.ts`.
- Internal utilities may support public modules, but their types should not define the public contract by accident.
- Structural input contracts belong in the public module that consumes them. For example:
  - `JsdocSourceCodeLike` lives in `ast/jsdoc`
  - `VisitorKeySourceCodeLike` lives in `ast/helpers`
  - `SearchVisitorKeyMapLike` lives in `ast/search`

## Naming Conventions

- Use kebab-case for file names.
- Name files after their primary concern rather than a grab bag of mixed utilities.
- Use `test-helpers` for test-only support code.
- Prefer type names ending in `Like` for structural contracts that describe required capabilities rather than concrete implementations.

## Documentation Model

- Source JSDoc should explain edge cases, null-return behavior, and caller requirements.
- Product docs should describe module responsibilities, public contracts, and usage patterns.
- Internal modules should stay documented enough for maintainers, but they are not part of the supported external API.
