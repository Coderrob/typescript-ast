# Guards And Import Paths

## `guards/nodes`

### Primary exports

- `FunctionNode`
- `isBinaryExpression`
- `isBlockStatement`
- `isCallExpression`
- `isFunctionDeclaration`
- `isFunctionLike`
- `isIdentifier`
- `isLiteral`
- `isMemberExpression`
- `isMethodDefinition`
- `isNamedIdentifier`
- `isNodeLike`
- `isReturnStatement`
- `isStringLiteral`
- `isSwitchCase`
- `isTestFile`
- `isThisExpression`
- `isTSAsExpression`
- `isTSEnumMember`
- `isTSNonNullExpression`
- `isTSParameterProperty`
- `isTSPropertySignature`
- `isTSSatisfiesExpression`
- `isTSTypeAnnotation`
- `isTSTypeLiteral`
- `isTSTypeReference`
- `isUnaryExpression`
- `isUncomputedMemberExpression`
- `isVariableDeclaration`
- `isVariableDeclarator`

### Compatibility aliases

The module also exports compatibility alias constants such as:

- `isBinaryExpressionNode`
- `isIdentifierNode`
- `isVariableDeclarationNode`

Use the primary names for new code. The alias constants exist for compatibility with older call sites.

## `import-paths`

### Core helpers

- `getFilename(filePath)`
- `isBarrelFile(filePath)`
- `isParentDirectoryImportPath(importPath)`

### Typical uses

- identify `index.*` barrel files
- inspect relative imports that traverse upward
- normalize filename extraction across POSIX and Windows paths
