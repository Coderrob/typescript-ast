# Parameters, Types, And Statements

## `ast/parameters`

### Core helpers

- `getAssignmentPatternIdentifier(param)`
- `getFirstNonThisParameter(params)`
- `getNamedParameterIdentifier(param)`
- `getNamedParameterName(param)`
- `getObjectDestructuredParameterTypeNode(param)`
- `getParameterTypeAnnotation(param)`
- `getParameterTypeNode(param)`
- `getRestElementIdentifier(param)`
- `getTsParameterPropertyIdentifier(param)`
- `isThisParameter(param)`

### Why these matter

ESTree parameter nodes branch quickly across:

- identifiers
- assignment patterns
- rest elements
- object patterns
- `TSParameterProperty`

These helpers normalize that branching into a smaller public surface.

## `ast/types`

### Core helpers

- `getFirstTypeArgument(node)`
- `getTypeReferenceName(node)`
- `hasAllReadonlyPropertyMembers(node)`
- `hasNamedTypeReferenceWithTypeArguments(node, name)`
- `hasTypeArguments(node)`
- `isNamedTypeReference(node, name)`
- `unwrapTsExpression(expression)`

### Typical uses

- detect `Readonly<T>` or project-specific wrappers
- inspect generic type arguments
- unwrap `TSAsExpression`, `TSSatisfiesExpression`, and related wrappers before analysis

## `ast/statements`

### Core helpers

- `getBooleanLiteralReturnValue(statement)`
- `getBooleanLiteralValue(value)`
- `getFollowingStatementInBlock(statement)`
- `getReturnStatement(statement)`
- `getSingleReturnStatement(block)`

### Typical uses

- detect obvious `return true` / `return false` patterns
- analyze single-return helper functions
- find the statement after a matched statement inside a block
