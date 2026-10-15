# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [Unreleased]

### Changed

- Development dependencies were pruned and refreshed for Node 24.
- Development dependency lockfile was updated to resolve npm audit findings.
- README usage examples and supported entry points were expanded.
- Boundary checks now handle deep parent chains and ancestor arrays without recursive calls.
- `hasSomeDescendant` is the preferred boolean descendant-search helper; the older `hasMatchingDescendant` helpers remain available as compatibility aliases.
- Documentation now consistently states the Node.js 24 minimum and Node 24 LTS development target.

### Added

- A packed-package smoke check for CommonJS, ESM, and NodeNext declarations in the CI gate.
- Manual release preparation and tag-triggered npm publishing workflows.

## [1.0.0] - 2026-04-06

### Changed

- Published JavaScript bundles now inline runtime dependencies instead of externalizing `node_modules`.
- Bundled declaration output now only emits entrypoint type files for `index`, `core`, and `typescript`.
- Package metadata now publishes `.d.mts` and `.d.cts` export-condition type entries while retaining `.d.ts` declaration files for the package-level `types` fallback.
- TypeScript settings are now split between `tsconfig.json` for library code and `tsconfig.test.json` for tests.
- Packaging lifecycle scripts now avoid recursive `npm pack` execution by reserving `prepublishOnly` for release checks and keeping `prepack` build-only.

### Added

- Productization updates for package metadata and scripts.
- Coverage enforcement and expanded tests to satisfy quality gates.
- README improvements, npm packaging controls, and dependency graph tooling.
- Initial release of reusable AST helpers for TypeScript ESTree analysis.
- Guard utilities, AST traversal helpers, call/parameter/type helpers, and benchmark support.
