# typescript-ast

Reusable, policy-agnostic AST interpretation helpers for TypeScript analysis.

## Installation

```bash
npm install @coderrob/typescript-ast
```

## Usage

```typescript
import {
  getCalleeNamePath,
  isNamedCall,
  hasMatchingDescendant,
} from "@coderrob/typescript-ast";
```

## Benchmarks

Benchmarks run with [tinybench](https://github.com/tinylibs/tinybench) on Node.js (100 000 iterations each).

| Task                                      | ops/sec    | avg (ns) | margin |
| ----------------------------------------- | ---------- | -------- | ------ |
| `getCalleeNamePath` — identifier          | 10,487,025 | 104      | ±0.06% |
| `getCalleeNamePath` — member chain        | 2,974,297  | 347      | ±0.06% |
| `isNamedCall` — match                     | 9,227,404  | 116      | ±0.06% |
| `hasMatchingDescendant` — CallExpression  | 1,255,912  | 1,001    | ±0.68% |
| `hasMatchingDescendantUntil` — Identifier | 588,633    | 1,813    | ±4.41% |
| `findDescendant` — CallExpression         | 1,550,813  | 734      | ±2.28% |

Run benchmarks locally:

```bash
npm run benchmark
```
