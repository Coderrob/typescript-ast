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
