# Contributing

Thanks for contributing to `@coderrob/typescript-ast`.

## Development Setup

1. Use Node.js 18+.
2. Install dependencies:

```bash
npm install
```

## Common Commands

- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test: `npm run test`
- Coverage: `npm run test:coverage`
- Circular dependency check: `npm run deps:circular`
- Full quality check: `npm run check`

## Code Style

- TypeScript only in `src`.
- Formatting is managed by Prettier.
- Linting is managed by ESLint.
- Keep helpers small, composable, and policy-agnostic.

## Code Organization

- Put supported product APIs in `src/ast`, `src/guards`, and other root-level public modules exported from `src/index.ts`.
- Keep implementation details in `src/internal`; do not leak internal-only types into the public API surface.
- Use descriptive kebab-case file names.
- Reserve `test-helpers` naming for test-only utilities to avoid confusion with product modules.

## Documentation Expectations

- Add or update JSDoc for behavior that is non-obvious, contract-heavy, or edge-case sensitive.
- Keep MkDocs pages aligned with the public modules and exported contract types.
- Update product documentation when public behavior, naming, or required inputs change.

## Tests

- Add tests under `src/__tests__`.
- Prefer explicit `describe` and `it` organization.
- Include edge-case and nullish-path tests for new helpers.

## Pull Requests

Before opening a PR, run:

```bash
npm run check
```

For release-critical changes, also run:

```bash
npm run deps:circular
npm run pack:dry-run
```

## Commit Guidance

- Keep commits focused and minimal.
- Include tests for behavior changes.
- Update `CHANGELOG.md` for user-visible changes.
