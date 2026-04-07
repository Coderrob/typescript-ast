# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [Unreleased]

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
