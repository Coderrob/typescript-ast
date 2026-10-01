# Quality And Release

## Tooling

The project uses:

- TypeScript for builds and declarations
- ESLint for code-quality rules
- jscpd for production-source duplication checks
- Prettier for formatting
- Vitest for tests
- Istanbul coverage through `vitest --coverage`
- madge for dependency-graph and circular-dependency checks

## Common Commands

```bash
npm run build
npm run lint
npm run duplication
npm run typecheck
npm run test
npm run test:coverage
npm run quality
npm run ci
```

## Release-Oriented Commands

```bash
npm run deps:graph
npm run deps:circular
npm run pack:dry-run
npm run pack:smoke
npm run publint
```

## Publishing Model

- package name: `@coderrob/typescript-ast`
- public package access
- distributable output published from `dist`
- supported package entry points are the root export plus `core` and `typescript`
- Node.js engine floor: 24+; Node 24 LTS is the default CI target
- cyclomatic complexity enforced below `4` on production TypeScript
- production-source duplication enforced below `1%`

## Artifact Shape

- the publish tarball contains the built entry points and their declaration files
- `npm run pack:smoke` checks the built tarball in a temporary CommonJS, ESM, and NodeNext consumer after `npm run build`
- test output and source maps are intentionally excluded from the package
- `src/internal` remains a private implementation concern even when internal declaration files are emitted to support public type references

## Documentation Sources

Repository-level docs also live in:

- [`README.md`](../README.md)
- [`CONTRIBUTING.md`](../CONTRIBUTING.md)
- [`CHANGELOG.md`](../CHANGELOG.md)

## Notes For Maintainers

- keep public API docs aligned with the supported package entry points, not only `src/index.ts`
- treat `src/internal` as private implementation detail
- keep structural contract types defined at the public module boundary, not in `src/internal`
- use descriptive kebab-case file names and reserve `test-helpers` naming for test-only utilities
- prefer additive docs updates when public behavior changes
