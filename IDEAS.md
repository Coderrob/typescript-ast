# IDEAS

## Auto-Generated File Heading Manifest and TOC Comments

### Problem

Function-heavy files are harder to scan quickly during agentic development and code review.
A lightweight, always-current heading manifest at the top of files would improve navigation and reduce context-fetch overhead.

### Idea

Auto-generate a per-file heading comment block that acts as a table of contents for functions in that file.
The block includes each function name and its start/end line range.

This should be generated from source contents (not manually maintained), and automatically refreshed in pre-commit.

### Proposed Scope

- Target directory: `src/**` (TypeScript files only).
- Include:
  - exported function declarations
  - internal function declarations
  - optionally: class methods (phase 2)
- Exclude:
  - `src/**/__tests__/**`
  - generated files

### Suggested Heading Format

Use a stable marker so tooling can replace only the generated region.

```ts
/* @manifest:start
 * File TOC (auto-generated)
 * - getCallArgument: L10-L20
 * - getCalleeNamePath: L28-L35
 * - getMemberCalleeNameSegments: L80-L102
 * @manifest:end
 */
```

### Generation Strategy

- Parse each TypeScript file using `@typescript-eslint/typescript-estree`.
- Collect symbols with source locations (`loc.start.line`, `loc.end.line`).
- Sort by source order.
- Render deterministic output (same style/order every run).
- Replace existing manifest block between markers, or insert at file top when missing.

### Pre-Commit Integration

- Add a script, for example: `npm run manifest:toc`.
- Run it in pre-commit before lint/test gates.
- If generator changes files, commit should include updated manifests.

Example flow:

1. `manifest:toc` updates heading blocks.
2. `prettier --write` on touched files.
3. `eslint` and `test` continue as normal.

### Git Hook Options

- Preferred: Husky + lint-staged.
- Alternative: simple `.git/hooks/pre-commit` shell script.

### Guardrails

- Generated block must be idempotent.
- No manual edits inside `@manifest:start` and `@manifest:end`.
- Keep block concise to avoid noise.
- Skip files with fewer than 2 functions (optional, to reduce clutter).

### Why This Helps Agentic Development

- Fast symbol map at top-of-file for retrieval and patch planning.
- Reduced token spend for exploratory reads.
- Better edit targeting and change impact triage.
- Easier human review of large utility files.

### Rollout Plan

1. Build generator script in `scripts/generate-file-manifests.mjs`.
2. Run once across `src/**` and commit generated headers.
3. Wire into pre-commit.
4. Add CI check to fail if generated manifests are stale.

### Open Questions

- Should line ranges use absolute line numbers only, or include character offsets?
- Should overloaded function signatures collapse into one entry?
- Should class methods be included in the first iteration?
- Should private/internal helpers be omitted for smaller TOCs?
